import Mentor from "../models/Mentor.js";
import User from "../models/User.js";

// Become a mentor
export const becomeMentor = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const {
      company = "",
      role = "",
      experience = 0,
      bio = "",
      expertise = [],
      availability = 5,
      linkedin = "",
      github = "",
    } = req.body || {};

    let mentor = await Mentor.findOne({ userId });

    if (mentor) {
      // Update existing mentor profile
      mentor.isMentor = true;
      mentor.mentorDetails = {
        company,
        role,
        experience,
        bio,
        expertise,
        availability,
      };
      mentor.socialLinks = { linkedin, github };
      await mentor.save();
    } else {
      // Create new mentor profile
      mentor = new Mentor({
        userId,
        isMentor: true,
        mentorDetails: {
          company,
          role,
          experience,
          bio,
          expertise,
          availability,
        },
        socialLinks: {
          linkedin,
          github,
        },
      });
      await mentor.save();
    }

    res.json({
      message: "Mentor profile created/updated successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get all mentors
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({
      isMentor: true,
      status: "active",
    })
      .populate("userId", "name email profileImage")
      .sort({ "ratings.average": -1 });

    res.status(200).json({
      success: true,
      message: "Mentors retrieved successfully",
      data: mentors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching mentors",
    });
  }
};

// Get mentors by expertise
export const getMentorsByExpertise = async (req, res) => {
  try {
    const { expertise } = req.query;

    const mentors = await Mentor.find({
      isMentor: true,
      status: "active",
      "mentorDetails.expertise": expertise,
    })
      .populate("userId", "name email profileImage")
      .limit(10);

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request mentorship
export const requestMentorship = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    if (mentor.mentees.includes(menteeId)) {
      return res.status(400).json({ error: "Already requested mentorship" });
    }

    mentor.mentees.push(menteeId);
    await mentor.save();

    res.json({
      message: "Mentorship request sent successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my mentor profile
export const getMyMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const mentor = await Mentor.findOne({ userId }).populate(
      "userId",
      "name email profileImage",
    );

    if (!mentor) {
      return res.status(404).json({ error: "No mentor profile found" });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get alumni profiles
export const getAlumni = async (req, res) => {
  try {
    const alumni = await Mentor.find({
      "alumni.isAlumni": true,
      status: "active",
    })
      .populate("userId", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      message: "Alumni retrieved successfully",
      data: alumni,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching alumni",
    });
  }
};

// Get mentee list
export const getMentees = async (req, res) => {
  try {
    const userId = req.user.id;
    const mentor = await Mentor.findOne({ userId }).populate(
      "mentees",
      "name email profileImage",
    );

    if (!mentor) {
      return res.status(404).json({ error: "Not a mentor" });
    }

    res.json(mentor.mentees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rate mentor
export const rateMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const menteeId = req.user.id;
    const { rating, review } = req.body;

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Add review
    mentor.ratings.reviews.push({
      menteeId,
      rating,
      review,
      createdAt: new Date(),
    });

    // Calculate average rating
    const totalRating = mentor.ratings.reviews.reduce(
      (sum, r) => sum + r.rating,
      0,
    );
    mentor.ratings.average = totalRating / mentor.ratings.reviews.length;
    mentor.ratings.count = mentor.ratings.reviews.length;

    await mentor.save();

    res.json({
      message: "Rating submitted successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
