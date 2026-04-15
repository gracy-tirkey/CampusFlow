import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  verifyOTP,
  resendOTP,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Protected endpoints
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

export default router;
