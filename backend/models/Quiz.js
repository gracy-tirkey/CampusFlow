import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  question: { type: String, required: true },
  image: String,
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length >= 2, "At least 2 options required"],
  },
  correctAnswer: { type: String, required: true },
});

const quizSchema = mongoose.Schema({
  title: { type: String, required: true },
  questions: {
    type: [questionSchema],
    required: true,
    validate: [arr => arr.length > 0, "Quiz must have questions"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;