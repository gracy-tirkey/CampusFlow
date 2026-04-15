import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    subject: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    downloadedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    // Engagement metrics
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    downloads: {
      type: Number,
      default: 0,
    },

    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      details: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          rating: { type: Number, min: 1, max: 5 },
          comment: String,
        },
      ],
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Note", noteSchema);
