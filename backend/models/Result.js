import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    // Detailed answer tracking
    answers: [
      {
        questionId: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],

    totalQuestions: {
      type: Number,
      default: 0,
    },

    // Percentage breakdown
    percentage: {
      type: Number,
      default: 0,
    },

    // Time spent on quiz (in seconds)
    timeTaken: {
      type: Number,
      default: 0,
    },

    // Status tracking
    status: {
      type: String,
      enum: ["completed", "abandoned"],
      default: "completed",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Result", resultSchema);
