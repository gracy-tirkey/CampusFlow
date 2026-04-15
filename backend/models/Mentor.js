import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isMentor: {
      type: Boolean,
      default: false,
    },
    mentorDetails: {
      company: String,
      role: String,
      experience: Number, // in years
      bio: String,
      expertise: [String], // e.g., ["DSA", "System Design", "React"]
      availability: Number, // hours per week
    },
    alumni: {
      isAlumni: Boolean,
      graduation: String, // e.g., "2023, B.Tech CSE"
      jobTitle: String,
      company: String,
    },
    profileImage: String,
    mentees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: Number,
      reviews: [
        {
          menteeId: mongoose.Schema.Types.ObjectId,
          rating: Number,
          review: String,
          createdAt: Date,
        },
      ],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "onLeave"],
      default: "active",
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Mentor", mentorSchema);
