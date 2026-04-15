import express from "express";
import {
  getMessages,
  sendMessage,
  getChatUsers,
  markAsRead,
  uploadFile,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/users", getChatUsers);
router.get("/:userId", getMessages);
router.post("/", sendMessage);
router.put("/:userId/read", markAsRead);

// ✅ 9: File & Image Sharing - Upload endpoint
router.post("/upload/file", upload.single("file"), uploadFile);

export default router;
