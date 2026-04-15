import mongoose from "mongoose";

const careerResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    track: {
      type: String,
      enum: [
        "MERN Developer",
        "SDE",
        "Data Analyst",
        "UI/UX",
        "DevOps",
        "Cloud Architect",
      ],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "roadmap",
        "resume",
        "dsa",
        "internship",
        "referral",
        "tips",
        "contest",
      ],
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    duration: String, // e.g., "3 months", "6 weeks"
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    resources: [
      {
        title: String,
        url: String,
        type: String, // "article", "video", "course", "book"
      },
    ],
    relatedTopics: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      average: Number,
      count: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CareerResource", careerResourceSchema);
