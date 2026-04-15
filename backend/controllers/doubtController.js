import Doubt from "../models/Doubt.js";
import { getIO } from "../services/socket.js";

// ---------------- CREATE ----------------
export const createDoubt = async (req, res) => {
  try {
    const { question, tags = [] } = req.body;

    const doubt = await Doubt.create({
      question,
      tags,
      image: req.file?.path,
      askedBy: req.user.id,
    });

    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET ALL ----------------
export const getAllDoubts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      question: { $regex: search, $options: "i" },
    };

    const doubts = await Doubt.find(query)
      .populate("askedBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Doubt.countDocuments(query);

    res.json({
      data: doubts,
      hasMore: page * limit < total,
    });
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Error fetching doubts" });
  }
};

// ---------------- ANSWER ----------------
export const answerDoubt = async (req, res) => {
  try {
    const { text } = req.body;
    const doubtId = req.params.id;
    const userId = req.user.id;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    // Initialize answers array if it doesn't exist
    if (!doubt.answers) {
      doubt.answers = [];
    }

    // Add new answer with optional image
    doubt.answers.push({
      text: text.trim(),
      image: req.file?.path || undefined, // Optional: Image URL from file upload
      answeredBy: userId,
      votedBy: [], // Initialize votedBy array
      replies: [], // Initialize replies array
    });

    await doubt.save();

    // Populate the new answer for response
    await doubt.populate("answers.answeredBy", "name");
    const newAnswer = doubt.answers[doubt.answers.length - 1];

    // Emit real-time update for answer creation
    try {
      getIO().emit("new_answer", { doubtId: doubt._id, answer: newAnswer });
    } catch (socketError) {
      console.warn("Socket emit failed for new_answer:", socketError.message);
    }

    res.status(201).json({
      message: "Answer added successfully",
      answer: newAnswer,
    });
  } catch (error) {
    console.error("❌ Answer error:", error);
    res.status(500).json({ message: "Failed to add answer" });
  }
};

// ---------------- VOTE (FIXED LOGIC) ----------------
export const voteDoubt = async (req, res) => {
  try {
    const { value } = req.body;
    const doubtId = req.params.id;
    const userId = req.user.id;

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return res
        .status(400)
        .json({ message: "Invalid vote value. Must be 1 or -1" });
    }

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    // Initialize votedBy array if it doesn't exist
    if (!doubt.votedBy) {
      doubt.votedBy = [];
    }

    const existingVoteIndex = doubt.votedBy.findIndex(
      (v) => v.user.toString() === userId,
    );

    if (existingVoteIndex !== -1) {
      const existingVote = doubt.votedBy[existingVoteIndex];

      if (existingVote.value === value) {
        // Same vote clicked again - remove vote
        doubt.votes -= existingVote.value;
        doubt.votedBy.splice(existingVoteIndex, 1);
      } else {
        // Opposite vote - update vote
        doubt.votes -= existingVote.value; // Remove old vote
        doubt.votes += value; // Add new vote
        existingVote.value = value;
      }
    } else {
      // First time voting
      doubt.votedBy.push({ user: userId, value });
      doubt.votes += value;
    }

    await doubt.save();

    res.json({
      votes: doubt.votes,
      userVote:
        doubt.votedBy.find((v) => v.user.toString() === userId)?.value || 0,
    });
  } catch (error) {
    console.error("❌ Vote error:", error);
    res.status(500).json({ message: "Voting failed" });
  }
};

// ---------------- BOOKMARK ----------------
export const bookmarkDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    const userId = req.user.id;

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    if (!Array.isArray(doubt.bookmarkedBy)) {
      doubt.bookmarkedBy = [];
    }

    if (doubt.bookmarkedBy.some((id) => id.toString() === userId)) {
      doubt.bookmarkedBy = doubt.bookmarkedBy.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      doubt.bookmarkedBy.push(userId);
    }

    await doubt.save();

    res.json({ bookmarkedBy: doubt.bookmarkedBy });
  } catch (error) {
    console.error("❌ Bookmark error:", error);
    res.status(500).json({ message: "Bookmark failed" });
  }
};

// ---------------- AI (DISABLED - Keep for future use) ----------------
// export const generateAIAnswer = async (req, res) => {
//   try {
//     const doubt = await Doubt.findById(req.params.id);
//     if (!doubt) return res.status(404).json({ message: "Not found" });

//     const aiAnswer = `Here's a clear explanation:\n\n${doubt.question}\n\n👉 This concept works because... (replace with real AI later)`;

//     doubt.answers.push({
//       text: aiAnswer,
//       isAI: true,
//     });

//     await doubt.save();

//     res.json({ answer: aiAnswer });
//   } catch (err) {
//     res.status(500).json({ message: "AI failed" });
//   }
// };

export const voteAnswer = async (req, res) => {
  try {
    const { value } = req.body;
    const { id, answerId } = req.params;
    const userId = req.user.id;

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return res
        .status(400)
        .json({ message: "Invalid vote value. Must be 1 or -1" });
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    const answer = doubt.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Initialize votedBy array if it doesn't exist
    if (!answer.votedBy) {
      answer.votedBy = [];
    }

    const existingVoteIndex = answer.votedBy.findIndex(
      (v) => v.user.toString() === userId,
    );

    if (existingVoteIndex !== -1) {
      const existingVote = answer.votedBy[existingVoteIndex];

      if (existingVote.value === value) {
        // Same vote clicked again - remove vote
        answer.votes -= existingVote.value;
        answer.votedBy.splice(existingVoteIndex, 1);
      } else {
        // Opposite vote - update vote
        answer.votes -= existingVote.value; // Remove old vote
        answer.votes += value; // Add new vote
        existingVote.value = value;
      }
    } else {
      // First time voting
      answer.votedBy.push({ user: userId, value });
      answer.votes += value;
    }

    await doubt.save();

    res.json({
      votes: answer.votes,
      userVote:
        answer.votedBy.find((v) => v.user.toString() === userId)?.value || 0,
    });
  } catch (error) {
    console.error("❌ Answer vote error:", error);
    res.status(500).json({ message: "Answer voting failed" });
  }
};

export const pinAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const userId = req.user.id;

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    // Only doubt owner can pin answers
    if (doubt.askedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the doubt owner can pin answers" });
    }

    const answer = doubt.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Update pinnedAnswer field instead of isPinned on individual answers
    doubt.pinnedAnswer = answerId;

    await doubt.save();

    res.json({
      message: "Answer pinned successfully",
      pinnedAnswer: answerId,
    });
  } catch (error) {
    console.error("❌ Pin answer error:", error);
    res.status(500).json({ message: "Failed to pin answer" });
  }
};

export const replyToAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    const { id, answerId } = req.params;
    const userId = req.user.id;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    const answer = doubt.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // ✅ FIX: initialize replies if missing
    if (!answer.replies) {
      answer.replies = [];
    }

    // Add reply
    answer.replies.push({
      text: text.trim(),
      user: userId,
    });

    await doubt.save();

    // Populate the reply user for response
    await doubt.populate("answers.replies.user", "name");
    const newReply = answer.replies[answer.replies.length - 1];

    // Emit real-time update for reply creation
    try {
      getIO().emit("new_reply", {
        doubtId: doubt._id,
        answerId,
        reply: newReply,
      });
    } catch (socketError) {
      console.warn("Socket emit failed for new_reply:", socketError.message);
    }

    res.status(201).json({
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    console.error("❌ Reply error:", error);
    res.status(500).json({ message: "Reply failed" });
  }
};
