import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // ✅ New: Message content type
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    // ✅ New: File/image URL
    fileUrl: {
      type: String,
      default: null,
    },
    // ✅ New: File name for downloads
    fileName: {
      type: String,
      default: null,
    },
    // ✅ New: Message status tracking
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
    // ✅ New: Track when message was seen
    seenAt: {
      type: Date,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, status: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;