import express from "express";
import { getDashboardStats, getUserQuizzes } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/quizzes", protect, getUserQuizzes);

export default router;