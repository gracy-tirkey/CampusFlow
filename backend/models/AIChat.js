import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const aiChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Chat",
    },

    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("AIChat", aiChatSchema);