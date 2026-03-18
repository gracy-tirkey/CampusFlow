import express from "express";
import { uploadNote, getNotes } from "../controllers/noteController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadNote);

router.get("/", getNotes);

export default router;