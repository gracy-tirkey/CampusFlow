import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    // Who is sharing
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who receives the share
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // What is being shared
    itemType: {
      type: String,
      enum: ["note", "doubt"],
      required: true,
    },

    // Reference to Note or Doubt
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Item metadata (for display without populating)
    itemTitle: {
      type: String,
      required: true,
    },

    // Custom message from sender
    message: {
      type: String,
      default: "",
    },

    // Track if recipient has seen the share
    seenAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Index for efficient queries
shareSchema.index({ recipient: 1, createdAt: -1 });
shareSchema.index({ sender: 1, createdAt: -1 });
shareSchema.index({ itemId: 1, itemType: 1 });

const Share = mongoose.model("Share", shareSchema);

export default Share;
