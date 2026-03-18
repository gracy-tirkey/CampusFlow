import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

export const createQuiz = async (req,res)=>{

  try{

    const quiz = new Quiz({
      ...req.body,
      createdBy:req.user.id
    });

    await quiz.save();

    res.status(201).json(quiz);

  }catch(error){

    res.status(500).json({
      message:"Error creating quiz"
    });

  }

};


export const getQuizzes = async (req,res)=>{

  try{

    const quizzes = await Quiz.find().populate("createdBy", "name");

    res.json(quizzes);

  }catch(error){

    res.status(500).json({
      message:"Error fetching quizzes"
    });

  }

};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, score } = req.body;

    const result = new Result({
      quizId,
      userId: req.user.id,
      score
    });

    await result.save();

    res.json({
      message: "Quiz submitted successfully",
      score
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};