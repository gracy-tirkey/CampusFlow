import express from "express";
import {
  becomeMentor,
  getAllMentors,
  getMentorsByExpertise,
  requestMentorship,
  getMyMentorProfile,
  getAlumni,
  getMentees,
  rateMentor,
} from "../controllers/mentorController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mentor profile
router.post("/become-mentor", verifyToken, becomeMentor);
router.get("/my-profile", verifyToken, getMyMentorProfile);
router.get("/all", getAllMentors);
router.get("/by-expertise", getMentorsByExpertise);
router.get("/alumni", getAlumni);

// Mentorship
router.post("/request/:mentorId", verifyToken, requestMentorship);
router.get("/mentees", verifyToken, getMentees);
router.post("/:mentorId/rate", verifyToken, rateMentor);

export default router;
