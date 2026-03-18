import express from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuiz
} from "../controllers/quizController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createQuiz);

router.get("/", getQuizzes);
router.get("/:id", getQuizById);

router.post("/submit", protect, submitQuiz);

export default router;