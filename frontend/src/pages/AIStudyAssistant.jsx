import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBrain,
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import { ModernCard } from "../components/Card";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

export default function AIStudyAssistant() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subject: "",
    examDate: "",
    hoursPerDay: 2,
    weakTopics: [],
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = ["DSA", "WebDevelopment", "Python", "SystemDesign", "Other"];
  const weakTopicsList = {
    DSA: ["Arrays", "Trees", "Graphs", "DP", "Strings"],
    WebDevelopment: ["React", "Backend", "Database", "DevOps", "Testing"],
    Python: ["OOP", "Decorators", "AsyncIO", "Libraries", "Testing"],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleWeakTopic = (topic) => {
    setFormData({
      ...formData,
      weakTopics: formData.weakTopics.includes(topic)
        ? formData.weakTopics.filter((t) => t !== topic)
        : [...formData.weakTopics, topic],
    });
  };

  const handleGenerateRoadmap = async () => {
    if (!formData.subject || !formData.examDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await API.post("/ai-study/generate-roadmap", formData);
      setRoadmap(response.data.guidance);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-2xl">
              <FaBrain className="text-primary text-2xl" />
            </div>
            AI Study Assistant
          </h1>
          <p className="text-text-secondary">
            Get a personalized study roadmap powered by AI
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex gap-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  stepNum <= step
                    ? "bg-gradient-to-r from-primary to-secondary text-text-primary"
                    : "bg-surface-secondary text-text-muted"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`w-12 h-1 rounded transition-all ${
                    stepNum < step
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : "bg-secondary/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Subject & Exam Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ModernCard elevated className="p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                What do you want to study?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        subject,
                        weakTopics: [],
                      })
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.subject === subject
                        ? "border-primary bg-primary/20 text-text-primary font-semibold"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <FaBook className="inline mr-2" />
                    {subject}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.subject}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-text-primary font-bold py-3 rounded-lg hover:shadow-xl disabled:opacity-50 transition-all"
                >
                  Next →
                </button>
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* Step 2: Exam Date & Weak Topics */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ModernCard elevated className="p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Tell us about your exam
              </h2>

              <div className="space-y-6">
                {/* Exam Date */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">
                    <FaCalendarAlt className="inline mr-2" />
                    Exam Date
                  </label>
                  <input
                    type="date"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface-secondary/50 rounded-lg border border-border focus:border-primary outline-none text-text-primary"
                  />
                </div>

                {/* Hours Per Day */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">
                    <FaClock className="inline mr-2" />
                    How many hours can you study daily?
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="hoursPerDay"
                      min="1"
                      max="24"
                      value={formData.hoursPerDay}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-primary">
                      {formData.hoursPerDay}h
                    </span>
                  </div>
                </div>

                {/* Weak Topics */}
                {formData.subject && weakTopicsList[formData.subject] && (
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-3">
                      Weak areas (optional)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {weakTopicsList[formData.subject].map((topic) => (
                        <button
                          key={topic}
                          onClick={() => toggleWeakTopic(topic)}
                          className={`p-3 rounded-lg border transition-all ${
                            formData.weakTopics.includes(topic)
                              ? "border-primary bg-primary/20 text-dark font-semibold"
                              : "border-secondary/30 text-muted hover:border-primary/50"
                          }`}
                        >
                          {formData.weakTopics.includes(topic) && (
                            <FaCheckCircle className="inline mr-2" />
                          )}
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/20 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/10 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleGenerateRoadmap}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-dark font-bold py-3 rounded-lg hover:shadow-elevated disabled:opacity-50 transition-all"
                  >
                    {loading ? "Generating..." : "Generate Roadmap →"}
                  </button>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* Step 3: Roadmap Display */}
        {step === 3 && roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Roadmap Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ModernCard className="text-center">
                <div className="bg-primary/20 p-4 rounded-2xl inline-block mb-3">
                  <FaCalendarAlt className="text-primary text-2xl" />
                </div>
                <p className="text-muted text-sm">Subject</p>
                <p className="text-lg font-bold text-dark">{roadmap.subject}</p>
              </ModernCard>
              <ModernCard className="text-center">
                <div className="bg-primary/20 p-4 rounded-2xl inline-block mb-3">
                  <FaClock className="text-primary text-2xl" />
                </div>
                <p className="text-muted text-sm">Daily Hours</p>
                <p className="text-lg font-bold text-dark">
                  {roadmap.hoursPerDay}h
                </p>
              </ModernCard>
              <ModernCard className="text-center">
                <div className="bg-primary/20 p-4 rounded-2xl inline-block mb-3">
                  <FaBook className="text-primary text-2xl" />
                </div>
                <p className="text-muted text-sm">Weeks</p>
                <p className="text-lg font-bold text-dark">
                  {roadmap.roadmap?.length}
                </p>
              </ModernCard>
            </div>

            {/* Weeks Roadmap */}
            <ModernCard elevated className="p-8">
              <h3 className="text-2xl font-bold text-dark mb-6">
                Your Study Plan
              </h3>
              <div className="space-y-4">
                {roadmap.roadmap?.map((week, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-4 bg-background/30 rounded-lg border border-secondary/30 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/20 px-4 py-2 rounded-lg font-bold text-primary min-w-max">
                        Week {week.week}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-dark mb-2">
                          Topics: {week.topics.join(", ")}
                        </p>
                        <p className="text-sm text-muted mb-2">
                          Estimated Hours: {week.estimatedHours}h
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {week.dailyGoals.slice(0, 3).map((goal, i) => (
                            <span
                              key={i}
                              className="text-xs bg-secondary/30 text-dark px-2 py-1 rounded-full"
                            >
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ModernCard>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep(1);
                  setRoadmap(null);
                  setFormData({
                    subject: "",
                    examDate: "",
                    hoursPerDay: 2,
                    weakTopics: [],
                  });
                }}
                className="flex-1 border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/10 transition-all"
              >
                Generate New Plan
              </button>
              <button className="flex-1 bg-gradient-to-r from-primary to-secondary text-dark font-bold py-3 rounded-lg hover:shadow-elevated transition-all">
                Start Learning →
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
