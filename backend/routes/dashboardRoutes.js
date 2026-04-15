import express from "express";
import {
  getDashboardStats,
  getUserQuizzes,
  getStudentDashboardSummary,
  getStudentRecentNotes,
  getStudentRecentDoubts,
  getStudentQuizStats,
  getTeacherDashboardSummary,
  getTeacherRecentActivity,
  getTeacherPendingDoubts,
  getTeacherQuizOverview,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/quizzes", protect, getUserQuizzes);

// Student dashboard endpoints
router.get("/student/summary", protect, getStudentDashboardSummary);
router.get("/student/recent-notes", protect, getStudentRecentNotes);
router.get("/student/recent-doubts", protect, getStudentRecentDoubts);
router.get("/student/quiz-stats", protect, getStudentQuizStats);

// Teacher dashboard endpoints
router.get("/teacher/summary", protect, getTeacherDashboardSummary);
router.get("/teacher/recent-activity", protect, getTeacherRecentActivity);
router.get("/teacher/pending-doubts", protect, getTeacherPendingDoubts);
router.get("/teacher/quiz-overview", protect, getTeacherQuizOverview);

export default router;
