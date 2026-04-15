import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    grade: {
      type: String,
      default: "",
      enum: [
        "",
        "9th",
        "10th",
        "11th",
        "12th",
        "Undergraduate",
        "Graduate",
        "Other",
      ],
    },

    subjects: [
      {
        type: String,
        enum: [
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "Computer Science",
          "English",
          "History",
          "Geography",
          "Economics",
          "Other",
        ],
      },
    ],

    institution: {
      type: String,
      default: "",
    },

    // Email Verification Fields (PHASE 5)
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiry: {
      type: Date,
      select: false,
    },

    // Profile Image for mentors & community
    profileImage: {
      type: String,
      default: "",
    },

    points: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
