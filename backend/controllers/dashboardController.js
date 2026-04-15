import User from "../models/User.js";
import Note from "../models/Note.js";
import Doubt from "../models/Doubt.js";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import Message from "../models/Message.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let stats = {};

    if (user.role === "student") {
      // Notes Downloaded: count notes uploaded by teachers (assuming students can download them)
      const notesDownloaded = await Note.countDocuments({
        downloadedBy: userId,
      });

      // Doubts Asked: count doubts asked by user
      const doubtsAsked = await Doubt.countDocuments({ askedBy: userId });

      // Quiz Points: sum of all quiz scores for the user
      const quizResults = await Result.find({ userId });
      const quizPoints = quizResults.reduce(
        (total, result) => total + (result.score || 0),
        0,
      );

      stats = {
        notesDownloaded,
        doubtsAsked,
        quizPoints,
      };
    } else if (user.role === "teacher") {
      // Notes Uploaded: count notes uploaded by user
      const notesUploaded = await Note.countDocuments({ uploadedBy: userId });

      // Doubts Solved: count answers given by user
      const doubtsSolved = await Doubt.countDocuments({
        "answers.answeredBy": userId,
      });

      // Quizzes Created: count quizzes created by user
      const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });

      stats = {
        notesUploaded,
        doubtsSolved,
        quizzesCreated,
      };
    }

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching dashboard stats",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for student dashboard summary
export const getStudentDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Student role required.",
      });
    }

    // Profile summary
    const profileSummary = {
      name: user.name,
      grade: user.grade,
      subjects: user.subjects,
      institution: user.institution,
      points: user.points,
      badges: user.badges,
    };

    // Total uploaded/downloaded notes
    const totalNotesDownloaded = await Note.countDocuments({
      downloadedBy: userId,
    });

    // Recent notes (last 5 downloaded)
    const recentNotes = await Note.find({
      downloadedBy: userId,
    })
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title subject uploadedBy createdAt");

    // Recent doubts (last 5 asked)
    const recentDoubts = await Doubt.find({ askedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("question tags createdAt answers");

    // Active chats / unread messages
    const unreadMessages = await Message.countDocuments({
      receiver: userId,
      status: { $ne: "seen" },
    });

    // Recent messages for active chats
    const recentMessages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // Quiz attempts and latest scores
    const quizAttempts = await Result.find({ userId })
      .populate("quizId", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("score percentage quizId createdAt");

    // Performance percentage (average of all quiz percentages)
    const allResults = await Result.find({ userId });
    const performancePercentage =
      allResults.length > 0
        ? Math.round(
            allResults.reduce((sum, r) => sum + (r.percentage || 0), 0) /
              allResults.length,
          )
        : 0;

    // Leaderboard position (simplified - based on total points)
    const higherPointsUsers = await User.countDocuments({
      role: "student",
      points: { $gt: user.points },
    });
    const leaderboardPosition = higherPointsUsers + 1;

    res.status(200).json({
      success: true,
      message: "Student dashboard summary retrieved successfully",
      data: {
        profileSummary,
        totalNotesDownloaded,
        recentNotes,
        recentDoubts,
        unreadMessages,
        recentMessages,
        quizAttempts,
        performancePercentage,
        leaderboardPosition,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching student dashboard summary",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for recent notes
export const getStudentRecentNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Student role required.",
      });
    }

    const recentNotes = await Note.find({
      downloadedBy: userId,
    })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 })
      .limit(10)
      .select(
        "title description subject fileUrl uploadedBy downloads ratings createdAt",
      );

    res.status(200).json({
      success: true,
      message: "Recent notes retrieved successfully",
      data: recentNotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching recent notes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for recent doubts
export const getStudentRecentDoubts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Student role required.",
      });
    }

    const recentDoubts = await Doubt.find({ askedBy: userId })
      .populate("answers.answeredBy", "name role")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("question image tags answers votes views createdAt");

    res.status(200).json({
      success: true,
      message: "Recent doubts retrieved successfully",
      data: recentDoubts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching recent doubts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for quiz stats
export const getStudentQuizStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Student role required.",
      });
    }

    const quizResults = await Result.find({ userId })
      .populate("quizId", "title")
      .sort({ createdAt: -1 });

    const totalQuizzes = quizResults.length;
    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + (r.score || 0), 0) /
              totalQuizzes,
          )
        : 0;
    const averagePercentage =
      totalQuizzes > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) /
              totalQuizzes,
          )
        : 0;

    // Group by subject (assuming quiz titles contain subject info)
    const subjectStats = {};
    quizResults.forEach((result) => {
      const subject = result.quizId?.title?.split(" - ")[0] || "General";
      if (!subjectStats[subject]) {
        subjectStats[subject] = { attempts: 0, totalScore: 0, bestScore: 0 };
      }
      subjectStats[subject].attempts++;
      subjectStats[subject].totalScore += result.score || 0;
      subjectStats[subject].bestScore = Math.max(
        subjectStats[subject].bestScore,
        result.score || 0,
      );
    });

    res.status(200).json({
      success: true,
      message: "Quiz stats retrieved successfully",
      data: {
        totalQuizzes,
        averageScore,
        averagePercentage,
        subjectStats,
        recentAttempts: quizResults.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching quiz stats",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for teacher dashboard summary
export const getTeacherDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Teacher role required.",
      });
    }

    // Teacher profile
    const profileSummary = {
      name: user.name,
      subjects: user.subjects,
      institution: user.institution,
      bio: user.bio,
      points: user.points,
      badges: user.badges,
    };

    // Notes uploaded count
    const notesUploaded = await Note.countDocuments({ uploadedBy: userId });

    // Doubts answered count
    const doubtsAnswered = await Doubt.countDocuments({
      "answers.answeredBy": userId,
    });

    // Total students engaged (unique students who downloaded notes or asked doubts answered by teacher)
    const studentsFromNotes = await Note.distinct("downloadedBy", {
      uploadedBy: userId,
    });
    const studentsFromDoubts = await Doubt.distinct("askedBy", {
      "answers.answeredBy": userId,
    });
    const uniqueStudents = new Set([
      ...studentsFromNotes,
      ...studentsFromDoubts,
    ]);
    const totalStudentsEngaged = uniqueStudents.size;

    // Quizzes created
    const quizzesCreated = await Quiz.countDocuments({ createdBy: userId });

    // Quiz results summary
    const quizResults = await Result.find({
      quizId: { $in: await Quiz.distinct("_id", { createdBy: userId }) },
    }).populate("quizId", "title");

    const totalQuizAttempts = quizResults.length;
    const averageQuizScore =
      totalQuizAttempts > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + (r.score || 0), 0) /
              totalQuizAttempts,
          )
        : 0;

    // Latest student activities (recent quiz attempts on teacher's quizzes)
    const latestStudentActivities = await Result.find({
      quizId: { $in: await Quiz.distinct("_id", { createdBy: userId }) },
    })
      .populate("userId", "name")
      .populate("quizId", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("score percentage userId quizId createdAt");

    // Recent uploads (teacher's recent notes)
    const recentUploads = await Note.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title subject downloads ratings createdAt");

    // Pending doubts needing answers (doubts in subjects teacher teaches that haven't been answered)
    const pendingDoubts = await Doubt.find({
      tags: { $in: user.subjects },
      $or: [
        { answers: { $size: 0 } },
        { answers: { $not: { $elemMatch: { answeredBy: userId } } } },
      ],
    })
      .populate("askedBy", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("question tags askedBy votes createdAt");

    res.status(200).json({
      success: true,
      message: "Teacher dashboard summary retrieved successfully",
      data: {
        profileSummary,
        notesUploaded,
        doubtsAnswered,
        totalStudentsEngaged,
        quizzesCreated,
        quizResultsSummary: {
          totalAttempts: totalQuizAttempts,
          averageScore: averageQuizScore,
        },
        latestStudentActivities,
        recentUploads,
        pendingDoubts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching teacher dashboard summary",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for teacher recent activity
export const getTeacherRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Teacher role required.",
      });
    }

    // Recent notes uploaded
    const recentNotes = await Note.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title subject downloads ratings createdAt");

    // Recent doubts answered
    const recentDoubtsAnswered = await Doubt.find({
      "answers.answeredBy": userId,
    })
      .populate("askedBy", "name")
      .sort({ "answers.createdAt": -1 })
      .limit(10)
      .select("question askedBy answers.$ createdAt");

    // Recent quiz results from students
    const recentQuizResults = await Result.find({
      quizId: { $in: await Quiz.distinct("_id", { createdBy: userId }) },
    })
      .populate("userId", "name")
      .populate("quizId", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("score percentage userId quizId createdAt");

    res.status(200).json({
      success: true,
      message: "Teacher recent activity retrieved successfully",
      data: {
        recentNotes,
        recentDoubtsAnswered,
        recentQuizResults,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching teacher recent activity",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for pending doubts
export const getTeacherPendingDoubts = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Teacher role required.",
      });
    }

    const pendingDoubts = await Doubt.find({
      tags: { $in: user.subjects },
      $or: [
        { answers: { $size: 0 } },
        { answers: { $not: { $elemMatch: { answeredBy: userId } } } },
      ],
    })
      .populate("askedBy", "name grade")
      .sort({ createdAt: -1 })
      .limit(20)
      .select("question image tags askedBy votes views answers createdAt");

    res.status(200).json({
      success: true,
      message: "Pending doubts retrieved successfully",
      data: pendingDoubts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching pending doubts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// New endpoint for quiz overview
export const getTeacherQuizOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Teacher role required.",
      });
    }

    const quizzes = await Quiz.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    const quizOverview = await Promise.all(
      quizzes.map(async (quiz) => {
        const results = await Result.find({ quizId: quiz._id }).populate(
          "userId",
          "name",
        );

        const totalAttempts = results.length;
        const averageScore =
          totalAttempts > 0
            ? Math.round(
                results.reduce((sum, r) => sum + (r.score || 0), 0) /
                  totalAttempts,
              )
            : 0;
        const highestScore =
          totalAttempts > 0 ? Math.max(...results.map((r) => r.score || 0)) : 0;

        return {
          quizId: quiz._id,
          title: quiz.title,
          questionsCount: quiz.questions.length,
          totalAttempts,
          averageScore,
          highestScore,
          createdAt: quiz.createdAt,
          recentAttempts: results.slice(0, 3),
        };
      }),
    );

    res.status(200).json({
      success: true,
      message: "Quiz overview retrieved successfully",
      data: quizOverview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching quiz overview",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getUserQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Result.find({ userId }).populate("quizId", "title");

    res.status(200).json({
      success: true,
      message: "User quizzes retrieved successfully",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching user quizzes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
