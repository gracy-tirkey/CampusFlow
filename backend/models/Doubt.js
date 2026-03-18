import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({

  question: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  askedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  answers: [
    {
      text: String,

      image: String,

      upVotes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],

      answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

},{ timestamps:true });

export default mongoose.model("Doubt", doubtSchema);