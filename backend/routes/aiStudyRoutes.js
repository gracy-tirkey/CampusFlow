import express from "express";
import {
  generateStudyRoadmap,
  getUserRoadmap,
  updateProgress,
  getAllRoadmaps,
  deleteRoadmap,
} from "../controllers/aiStudyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate new study roadmap
router.post("/generate-roadmap", verifyToken, generateStudyRoadmap);

// Get current/active roadmap
router.get("/current-roadmap", verifyToken, getUserRoadmap);

// Get all roadmaps
router.get("/all-roadmaps", verifyToken, getAllRoadmaps);

// Update progress
router.put("/update-progress/:roadmapId", verifyToken, updateProgress);

// Delete roadmap
router.delete("/delete/:roadmapId", verifyToken, deleteRoadmap);

export default router;
