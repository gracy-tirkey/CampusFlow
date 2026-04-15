import mongoose from "mongoose";

const aiStudyGuidanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    hoursPerDay: {
      type: Number,
      required: true,
      min: 1,
      max: 24,
    },
    weakTopics: [
      {
        type: String,
      },
    ],
    roadmap: [
      {
        week: Number,
        topics: [String],
        dailyGoals: [String],
        resources: [String],
        estimatedHours: Number,
      },
    ],
    revisionPlan: [
      {
        date: Date,
        topics: [String],
        focusAreas: [String],
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "paused", "archived"],
      default: "active",
    },
    progress: {
      completedTopics: [String],
      currentWeek: Number,
      completionPercentage: Number,
    },
    isAI: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("AIStudyGuidance", aiStudyGuidanceSchema);
