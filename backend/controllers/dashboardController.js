import User from "../models/User.js";
import Note from "../models/Note.js";
import Doubt from "../models/Doubt.js";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let stats = {};

    if (user.role === "student") {
      // Notes Downloaded: count notes uploaded by teachers (assuming students can download them)
      const notesDownloaded = await Note.countDocuments({ downloadedBy: userId });

      // Doubts Asked: count doubts asked by user
      const doubtsAsked = await Doubt.countDocuments({ askedBy: userId });

      // Quiz Points: sum of all quiz scores for the user
      const quizResults = await Result.find({ userId });
      const quizPoints = quizResults.reduce((total, result) => total + (result.score || 0), 0);

      stats = {
        notesDownloaded,
        doubtsAsked,
        quizPoints,
      };
    } else if (user.role === "teacher") {
      // Notes Uploaded: count notes uploaded by user
      const notesUploaded = await Note.countDocuments({ uploadedBy: userId });

      // Doubts Solved: count answers given by user
      const doubtsSolved = await Doubt.countDocuments({ "answers.answeredBy": userId });

      // Quizzes Created: count quizzes created by user
      const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });

      stats = {
        notesUploaded,
        doubtsSolved,
        quizzesCreated
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Result.find({ userId }).populate("quizId", "title");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};