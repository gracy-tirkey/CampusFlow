import Message from "../models/Message.js";
import User from "../models/User.js";

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name")
      .populate("receiver", "name");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users for chat list
export const getChatUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get all users except current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("name email role")
      .sort({ name: 1 });

    // Get last message for each user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        })
          .sort({ timestamp: -1 })
          .populate("sender", "name")
          .populate("receiver", "name");

        return {
          ...user.toObject(),
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                timestamp: lastMessage.timestamp,
                sender: lastMessage.sender.name,
                isFromMe: lastMessage.sender._id.toString() === currentUserId,
              }
            : null,
          lastMessageTime: lastMessage?.timestamp || user.createdAt || 0,
        };
      }),
    );

    // ✅ PHASE 6: Sort by latest message timestamp
    const sorted = usersWithLastMessage.sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
    );

    res.status(200).json({
      success: true,
      message: "Chat users retrieved successfully",
      data: sorted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    await Message.updateMany(
      { sender: userId, receiver: currentUserId, read: false },
      { read: true },
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ 9: File & Image Sharing - Upload Handler
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, filename, path, mimetype, size } = req.file;

    // Determine file type
    let type = "file";
    if (mimetype.startsWith("image/")) {
      type = "image";
    }

    // Return file info (will be used to send in message)
    res.json({
      success: true,
      file: {
        fileUrl: path.replace(/\\/g, "/"), // Convert Windows paths
        fileName: originalname,
        type,
        size,
        mimetype,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "File upload failed" });
  }
};
