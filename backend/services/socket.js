// services/socket.js - Enhanced Real-time Chat System
import { Server } from "socket.io";
import Message from "../models/Message.js";

let io;
// ✅ Track online users: { userId: { socketId, lastSeen, username } }
const onlineUsers = new Map();
// ✅ Track users currently typing: { socketId: { userId, targetUserId } }
const typingUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://campusflow-n4d1.onrender.com"
          : ["http://localhost:5173", "http://localhost:6090"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // ========== USER PRESENCE ==========
    // ✅ 3: Online/Offline Status & 4: Last Seen
    socket.on("join_user", (userId) => {
      socket.join(userId);
      socket.userId = userId;

      // Track user as online
      onlineUsers.set(userId, {
        socketId: socket.id,
        lastSeen: new Date(),
        status: "online",
      });

      // Broadcast user online to all connections
      io.emit("user_online", {
        userId,
        status: "online",
        timestamp: new Date(),
      });

      console.log(
        `👤 User ${userId} joined. Total online: ${onlineUsers.size}`,
      );
    });

    // ========== MESSAGING ==========
    // ✅ 1: Last Message & 6: Message Status System
    socket.on("send_message", async (data) => {
      try {
        const {
          receiverId,
          message,
          senderId,
          senderName,
          type = "text",
          fileUrl = null,
          fileName = null,
        } = data;

        // Validate required fields
        if (!receiverId || !message || !senderId) {
          socket.emit("message_error", { error: "Missing required fields" });
          return;
        }

        // Create and save message to database
        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          content: message,
          type,
          fileUrl,
          fileName,
          status: "sent", // ✅ Initial status: sent
        });

        await newMessage.save();

        // Send message to receiver only (no echo to sender)
        io.to(receiverId).emit("receive_message", {
          messageId: newMessage._id,
          senderId,
          senderName,
          content: message,
          message, // Keep for backward compatibility
          type,
          fileUrl,
          fileName,
          timestamp: newMessage.createdAt,
          status: "delivered", // ✅ Message status: delivered
        });

        // Update message status to delivered
        await Message.findByIdAndUpdate(newMessage._id, {
          status: "delivered",
        });

        // Send confirmation to sender (optimistic update cleared)
        socket.emit("message_sent", {
          messageId: newMessage._id,
          status: "delivered",
          timestamp: newMessage.createdAt,
          success: true,
        });

        // ✅ 1: Update last message in sidebar
        io.to(receiverId).emit("last_message_update", {
          userId: senderId,
          lastMessage: {
            content:
              type === "text" ? message : `📎 ${type.toUpperCase()} attachment`,
            timestamp: newMessage.createdAt,
            senderId,
          },
        });

        io.to(senderId).emit("last_message_update", {
          userId: receiverId,
          lastMessage: {
            content:
              type === "text" ? message : `📎 ${type.toUpperCase()} attachment`,
            timestamp: newMessage.createdAt,
            senderId,
          },
        });
      } catch (error) {
        console.error("❌ Error saving message:", error);
        socket.emit("message_error", {
          error: error.message || "Failed to send message",
        });
      }
    });

    // ✅ 6: Message Delivery Status
    socket.on("message_delivered", async (data) => {
      const { messageId, receiverId } = data;
      if (!messageId) return;

      try {
        await Message.findByIdAndUpdate(messageId, {
          status: "delivered",
        });

        // Notify sender that message was delivered
        const message = await Message.findById(messageId);
        if (message) {
          io.to(String(message.sender)).emit("message_status_update", {
            messageId,
            status: "delivered",
          });
        }
      } catch (error) {
        console.error("❌ Error updating message delivery:", error);
      }
    });

    // ✅ 6: Message Seen Status
    socket.on("message_seen", async (data) => {
      const { messageId, senderId } = data;
      if (!messageId) return;

      try {
        const seenAt = new Date();
        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          {
            status: "seen",
            seenAt,
            read: true,
          },
          { new: true },
        );

        if (updatedMessage) {
          // Notify sender that message was seen
          io.to(String(updatedMessage.sender)).emit("message_status_update", {
            messageId,
            status: "seen",
            seenAt,
          });
        }
      } catch (error) {
        console.error("❌ Error updating message seen status:", error);
      }
    });

    // ========== TYPING INDICATORS ==========
    // ✅ 5: Typing Indicator with debouncing
    socket.on("typing", (data) => {
      const { senderId, targetUserId, isTyping } = data;

      if (isTyping) {
        typingUsers.set(socket.id, { userId: senderId, targetUserId });
        io.to(targetUserId).emit("user_typing", {
          userId: senderId,
          isTyping: true,
        });
      } else {
        typingUsers.delete(socket.id);
        io.to(targetUserId).emit("user_typing", {
          userId: senderId,
          isTyping: false,
        });
      }
    });

    socket.on("stop_typing", (data) => {
      const { senderId, targetUserId } = data;
      typingUsers.delete(socket.id);
      io.to(targetUserId).emit("user_typing", {
        userId: senderId,
        isTyping: false,
      });
    });

    // ========== DISCONNECT & CLEANUP ==========
    // ✅ 4: Last Seen Tracking
    socket.on("disconnect", () => {
      const userId = socket.userId;

      if (userId && onlineUsers.has(userId)) {
        const userData = onlineUsers.get(userId);
        userData.status = "offline";
        userData.lastSeen = new Date();

        // Broadcast user offline
        io.emit("user_offline", {
          userId,
          status: "offline",
          lastSeen: userData.lastSeen,
        });

        console.log(`👤 User ${userId} went offline`);
      }

      // Clean up typing indicators
      for (const [socketId, typingData] of typingUsers.entries()) {
        if (socketId === socket.id) {
          const { targetUserId } = typingData;
          io.to(targetUserId).emit("user_typing", {
            userId: socket.userId,
            isTyping: false,
          });
          typingUsers.delete(socketId);
        }
      }
    });
  });

  // ✅ Cleanup stale connections every 30 seconds
  setInterval(() => {
    const now = new Date();
    for (const [userId, userData] of onlineUsers.entries()) {
      const timeSinceLastSeen = now - userData.lastSeen;
      // Consider disconnected if no activity for 1 minute
      if (timeSinceLastSeen > 60000 && userData.status === "online") {
        onlineUsers.delete(userId);
      }
    }
  }, 30000);
};

// ✅ Get active users for API endpoints
export const getOnlineUsers = () => {
  return {
    users: Array.from(onlineUsers.entries()).map(([userId, data]) => ({
      userId,
      ...data,
    })),
    count: onlineUsers.size,
  };
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
