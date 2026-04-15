import AIStudyGuidance from "../models/AIStudyGuidance.js";
import { generateAIResponse } from "../services/aiService.js";

// 🔧 Normalize AI roadmap (CRITICAL FIX)
function normalizeRoadmap(roadmap) {
  return roadmap.map((week) => ({
    ...week,

    topics: Array.isArray(week.topics) ? week.topics : [],

    // ✅ Fix dailyGoals → MUST be array of strings
    dailyGoals: Array.isArray(week.dailyGoals)
      ? week.dailyGoals.map((goal) => {
          if (typeof goal === "string") return goal;

          if (typeof goal === "object") {
            return `Day ${goal.day || ""}: ${
              goal.goal || JSON.stringify(goal)
            }`;
          }

          return String(goal);
        })
      : ["Study and practice"],

    resources: Array.isArray(week.resources) ? week.resources : [],
  }));
}

// Generate AI Study Roadmap
export const generateStudyRoadmap = async (req, res) => {
  try {
    const { subject, examDate, hoursPerDay, weakTopics } = req.body;
    const userId = req.user?.id;

    if (!subject || !examDate || !hoursPerDay) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const weakTopicsSafe = Array.isArray(weakTopics) ? weakTopics : [];

    const today = new Date();
    const exam = new Date(examDate);
    const daysUntilExam = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExam <= 0) {
      return res.status(400).json({ error: "Exam date must be in the future" });
    }

    const weeks = Math.ceil(daysUntilExam / 7);

    // 🔥 AI PROMPT (STRICT)
    const prompt = `
You are a JSON generator.

Create a ${weeks}-week study roadmap for ${subject}.

Details:
- Study hours per day: ${hoursPerDay}
- Weak topics: ${weakTopicsSafe.join(", ") || "None"}

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- dailyGoals MUST be an array of strings

Format:
[
  {
    "week": 1,
    "topics": [],
    "dailyGoals": ["string", "string"],
    "resources": [],
    "estimatedHours": number
  }
]
`;

    let roadmap;

    try {
      const aiResponse = await generateAIResponse(prompt);

      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON found");

      roadmap = JSON.parse(jsonMatch[0]);

      // ✅ CRITICAL FIX
      roadmap = normalizeRoadmap(roadmap);
    } catch (err) {
      console.log("⚠️ AI roadmap failed:", err.message);

      roadmap = generateRoadmapStructure(
        subject,
        weeks,
        hoursPerDay,
        weakTopicsSafe
      );
    }

    // 🔥 REVISION PLAN
    let revisionPlan;

    try {
      const revisionPrompt = `
You are a JSON generator.

Create a 7-day revision plan for ${subject}.

STRICT RULES:
- Return ONLY JSON
- No explanation

Format:
[
  {
    "date": "YYYY-MM-DD",
    "topics": [],
    "focusAreas": []
  }
]
`;

      const revisionResponse = await generateAIResponse(revisionPrompt);

      const jsonMatch = revisionResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON found");

      revisionPlan = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.log("⚠️ Revision AI failed:", err.message);

      revisionPlan = generateRevisionPlan(exam, roadmap);
    }

    // ✅ SAVE
    const guidance = new AIStudyGuidance({
      userId,
      subject,
      examDate,
      hoursPerDay,
      weakTopics: weakTopicsSafe,
      roadmap,
      revisionPlan,
      progress: {
        completedTopics: [],
        currentWeek: 1,
        completionPercentage: 0,
      },
    });

    await guidance.save();

    res.status(201).json({
      message: "Study roadmap generated successfully",
      guidance,
    });
  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ---------------- OTHER APIs (unchanged) ----------------

export const getUserRoadmap = async (req, res) => {
  try {
    const roadmap = await AIStudyGuidance.findOne({
      userId: req.user.id,
      status: "active",
    });

    if (!roadmap) {
      return res.status(404).json({ error: "No active roadmap found" });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { completedTopics, currentWeek, completionPercentage } = req.body;

    const roadmap = await AIStudyGuidance.findByIdAndUpdate(
      roadmapId,
      {
        "progress.completedTopics": completedTopics || [],
        "progress.currentWeek": currentWeek || 1,
        "progress.completionPercentage": completionPercentage || 0,
      },
      { new: true }
    );

    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.json({ message: "Progress updated", roadmap });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRoadmaps = async (req, res) => {
  try {
    const roadmaps = await AIStudyGuidance.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoadmap = async (req, res) => {
  try {
    const deleted = await AIStudyGuidance.findByIdAndDelete(
      req.params.roadmapId
    );

    if (!deleted) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.json({ message: "Roadmap deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔧 FALLBACKS

function generateRoadmapStructure(subject, weeks, hoursPerDay) {
  const roadmap = [];

  for (let i = 1; i <= weeks; i++) {
    roadmap.push({
      week: i,
      topics: ["Fundamentals", "Intermediate", "Advanced"],
      dailyGoals: [`Study ${subject}`, "Practice", "Revise"],
      resources: ["YouTube", "Docs"],
      estimatedHours: hoursPerDay * 7,
    });
  }

  return roadmap;
}

function generateRevisionPlan(examDate, roadmap) {
  return Array.from({ length: 7 }).map(() => ({
    date: new Date(),
    topics: roadmap[0]?.topics || ["Revision"],
    focusAreas: ["Weak areas", "Mistakes"],
  }));
}