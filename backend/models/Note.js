import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  subject: {
    type: String,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  downloadedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  role: {
    type: String,
    enum: ["student", "teacher"]
  }

}, { timestamps: true });

export default mongoose.model("Note", noteSchema);