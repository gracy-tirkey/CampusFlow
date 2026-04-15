import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateOTP,
  hashOTP,
  verifyOTP as verifyOTPHash,
  isOTPExpired,
  calculateOTPExpiry,
} from "../services/otpService.js";
import { sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";

// REGISTER - Generate OTP and send email
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpiry = calculateOTPExpiry(10); // 10 minutes validity

    // Create user (NOT verified yet)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      otp: hashedOTP,
      otpExpiry: otpExpiry,
      isEmailVerified: false,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Don't fail registration if email fails, just log it
      return res.status(500).json({
        message:
          "Registration failed: Could not send OTP email. Check your email configuration.",
      });
    }

    res.status(201).json({
      message: "Registration successful! OTP sent to your email.",
      email: email,
      requiresOTP: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

// VERIFY OTP - Mark email as verified
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check OTP expiry
    if (isOTPExpired(user.otpExpiry)) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    const isOTPValid = await verifyOTPHash(otp, user.otp);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(email, user.name);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
      // Don't fail verification if welcome email fails
    }

    res.json({
      message: "Email verified successfully! You can now login.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: error.message || "Verification failed" });
  }
};

// RESEND OTP - Generate new OTP and send
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpiry = calculateOTPExpiry(10);

    user.otp = hashedOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, user.name);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      return res.status(500).json({
        message: "Could not send OTP. Please check your email configuration.",
      });
    }

    res.json({
      message: "OTP sent to your email successfully",
      email: email,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: error.message || "Failed to resend OTP" });
  }
};

// LOGIN - Check if email verified before allowing login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
        email: email,
        requiresOTP: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const userWithoutPassword = await User.findById(user._id).select(
      "-password -otp -otpExpiry",
    );

    res.json({
      token,
      user: userWithoutPassword,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpiry",
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, grade, subjects, institution, profileImage } =
      req.body;
    let { password, email } = req.body;
    const userId = req.user.id;

    const updateData = {
      name,
      phone,
      bio,
      grade,
      subjects,
      institution,
      profileImage,
    };

    // Don't allow email updates through this endpoint
    // Create a separate "change email" endpoint if needed

    // Only hash password if provided and not empty
    if (password && password.trim().length > 0) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: error.message || "Profile update failed" });
  }
};
