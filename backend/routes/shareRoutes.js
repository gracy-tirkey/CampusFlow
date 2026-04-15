import express from "express";
import {
  createShare,
  getReceivedShares,
  getSentShares,
  markShareAsSeen,
  deleteShare,
  getUsersForShare,
} from "../controllers/shareController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create a new share
router.post("/", createShare);

// Get shares received by current user
router.get("/received", getReceivedShares);

// Get shares sent by current user
router.get("/sent", getSentShares);

// Get users available for sharing
router.get("/users/list", getUsersForShare);

// Mark share as seen
router.put("/:shareId/seen", markShareAsSeen);

// Delete a share
router.delete("/:shareId", deleteShare);

export default router;
