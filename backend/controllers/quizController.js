import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz({
      ...req.body,
      createdBy: req.user.id,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name");

    res.status(200).json({
      success: true,
      message: "Quizzes fetched successfully",
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching quizzes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Quiz fetched successfully",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, score } = req.body;

    const result = new Result({
      quizId,
      userId: req.user.id,
      score,
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        score,
        resultId: result._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error submitting quiz",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
