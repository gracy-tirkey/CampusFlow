// services/socket.js
import { Server } from "socket.io";
import Message from "../models/Message.js"; // make sure this exists


export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
    origin: "https://campusflow-n4d1.onrender.com",
    methods: ["GET", "POST"]
  }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_user", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("send_message", async (data) => {
      try {
        const { receiverId, message, senderId, senderName } = data;

        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          content: message
        });

        await newMessage.save();
        await newMessage.populate("sender", "name");

        socket.to(receiverId).emit("receive_message", {
          senderId,
          senderName,
          content: message,
          timestamp: newMessage.timestamp
        });

        socket.emit("message_sent", {
          receiverId,
          content: message,
          timestamp: newMessage.timestamp
        });

      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export const getIO = () => io;
