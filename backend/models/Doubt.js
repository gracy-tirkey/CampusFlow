import mongoose from "mongoose";

// Define reply schema first
const replySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const doubtSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    image: String,

    tags: [String],

    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    votes: {
      type: Number,
      default: 0,
    },

    votedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: Number,
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    bookmarkedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    // Remove old comments array - replaced by answers
    // comments: [...], // DEPRECATED

    answers: [
      {
        text: {
          type: String,
          required: true,
        },
        image: String,

        isAI: {
          type: Boolean,
          default: false,
        },

        votes: {
          type: Number,
          default: 0,
        },

        votedBy: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            value: Number,
          },
        ],

        replies: {
          type: [replySchema],
          default: [],
        },

        answeredBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    pinnedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Doubt", doubtSchema);
