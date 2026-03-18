import express from "express";
import {
  createDoubt,
  getAllDoubts,
  answerDoubt
} from "../controllers/doubtController.js";

import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createDoubt);

router.get("/", getAllDoubts);

router.post("/:id/answer", protect, answerDoubt);

export default router;