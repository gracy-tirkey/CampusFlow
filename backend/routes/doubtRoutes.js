import express from "express";
import {
  createDoubt,
  getAllDoubts,
  answerDoubt,
  voteDoubt,
  bookmarkDoubt,
  // generateAIAnswer, // DISABLED - Keep for future use
  voteAnswer,
  replyToAnswer,
  pinAnswer,
} from "../controllers/doubtController.js";

import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logging middleware for debugging
const logRequest = (req, res, next) => {
  console.log(
    `📡 ${req.method} ${req.originalUrl} - User: ${req.user?.id || "Anonymous"}`,
  );
  next();
};

// Apply logging to all routes
router.use(logRequest);

// Core doubt routes
router.post("/", protect, upload.single("image"), createDoubt);
router.get("/", getAllDoubts);

// Doubt interactions
router.post("/:id/answer", protect, upload.single("image"), answerDoubt);
router.post("/:id/vote", protect, voteDoubt);
router.post("/:id/bookmark", protect, bookmarkDoubt);

// AI route (disabled)
// router.post("/:id/ai", protect, generateAIAnswer);

// Answer interactions
router.post("/:id/answers/:answerId/vote", protect, voteAnswer);
router.post("/:id/answers/:answerId/reply", protect, replyToAnswer);
router.post("/:id/answers/:answerId/pin", protect, pinAnswer);

export default router;
