import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBook,
  FaQuestionCircle,
  FaStar,
  FaChartLine,
  FaTrophy,
  FaFire,
  FaClock,
  FaUsers,
  FaEnvelope,
  FaChevronRight,
  FaExclamationTriangle,
  FaUserGraduate,
  FaClipboardList,
} from "react-icons/fa";
import { ModernCard, StatsCard } from "../components/Card";

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch comprehensive dashboard data
      const summaryResponse = await API.get("/dashboard/student/summary");
      const quizStatsResponse = await API.get("/dashboard/student/quiz-stats");

      const summary = summaryResponse.data?.data;
      const quizStats = quizStatsResponse.data?.data;

      setDashboardData({
        ...summary,
        quizStats,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted">Loading your personalized dashboard...</p>
            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <ModernCard className="max-w-md text-center">
            <div className="text-red-500 mb-4">
              <FaExclamationTriangle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-text-secondary mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={handleRetry}
                className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <Link to="/notes">
                <button className="w-full bg-secondary hover:bg-secondary/80 text-text-primary py-2 px-4 rounded-lg transition-colors">
                  Browse Notes Instead
                </button>
              </Link>
            </div>
          </ModernCard>
        </div>
      </DashboardLayout>
    );
  }

  const {
    profileSummary,
    totalNotesDownloaded = 0,
    recentNotes = [],
    recentDoubts = [],
    unreadMessages = 0,
    quizAttempts = [],
    performancePercentage = 0,
    leaderboardPosition = 0,
    quizStats,
  } = dashboardData || {};

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Welcome Hero Section */}
        <ModernCard
          elevated
          className="bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Welcome back, {profileSummary?.name || "Student"}! 👋
              </h1>
              <p className="text-text-secondary mb-4">
                Ready to continue your learning journey? Here's your progress
                overview.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaFire className="text-orange-500" />
                  <span>Grade: {profileSummary?.grade || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  <span>Rank: #{leaderboardPosition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-green-500" />
                  <span>{performancePercentage}% Avg Performance</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <FaUserGraduate size={32} className="text-primary" />
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={FaBook}
            title="Notes Downloaded"
            value={totalNotesDownloaded}
            unit="notes"
            category="notes"
          />
          <StatsCard
            icon={FaQuestionCircle}
            title="Doubts Asked"
            value={recentDoubts.length}
            unit="questions"
            category="doubts"
          />
          <StatsCard
            icon={FaEnvelope}
            title="Unread Messages"
            value={unreadMessages}
            unit="messages"
            category="community"
          />
          <StatsCard
            icon={FaTrophy}
            title="Performance"
            value={performancePercentage}
            unit="% average"
            category="stats"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Notes */}
            <ModernCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recent Notes
                </h3>
                <Link
                  to="/notes"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  View All <FaChevronRight size={12} />
                </Link>
              </div>
              {recentNotes.length > 0 ? (
                <div className="space-y-3">
                  {recentNotes.slice(0, 5).map((note, idx) => (
                    <motion.div
                      key={note._id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary text-sm">
                          {note.title}
                        </h4>
                        <p className="text-xs text-text-secondary">
                          {note.subject} • by {note.uploadedBy?.name}
                        </p>
                      </div>
                      <div className="text-xs text-text-muted">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <FaBook size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No notes downloaded yet</p>
                  <Link to="/notes">
                    <button className="mt-2 text-primary hover:underline">
                      Browse Notes
                    </button>
                  </Link>
                </div>
              )}
            </ModernCard>

            {/* Recent Quiz Attempts */}
            <ModernCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recent Quiz Attempts
                </h3>
                <Link
                  to="/quizzes"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  Take Quiz <FaChevronRight size={12} />
                </Link>
              </div>
              {quizAttempts.length > 0 ? (
                <div className="space-y-3">
                  {quizAttempts.slice(0, 5).map((attempt, idx) => (
                    <motion.div
                      key={attempt._id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-text-primary text-sm">
                          {attempt.quizId?.title}
                        </h4>
                        <p className="text-xs text-text-secondary">
                          Score: {attempt.score}/
                          {attempt.totalQuestions || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary">
                          {attempt.percentage}%
                        </div>
                        <div className="text-xs text-text-muted">
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <FaClipboardList
                    size={32}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p>No quiz attempts yet</p>
                  <Link to="/quizzes">
                    <button className="mt-2 text-primary hover:underline">
                      Take Your First Quiz
                    </button>
                  </Link>
                </div>
              )}
            </ModernCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Doubts */}
            <ModernCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recent Doubts
                </h3>
                <Link
                  to="/doubts"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  View All <FaChevronRight size={12} />
                </Link>
              </div>
              {recentDoubts.length > 0 ? (
                <div className="space-y-3">
                  {recentDoubts.slice(0, 3).map((doubt, idx) => (
                    <motion.div
                      key={doubt._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 bg-secondary/50 rounded-lg"
                    >
                      <h4 className="font-medium text-text-primary text-sm line-clamp-2">
                        {doubt.question}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-secondary">
                          {doubt.answers?.length || 0} answers
                        </span>
                        <span className="text-xs text-text-muted">
                          {new Date(doubt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-text-secondary">
                  <FaQuestionCircle
                    size={24}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p className="text-sm">No doubts asked yet</p>
                  <Link to="/ask-doubt">
                    <button className="mt-2 text-primary hover:underline text-sm">
                      Ask a Doubt
                    </button>
                  </Link>
                </div>
              )}
            </ModernCard>

            {/* Quick Actions */}
            <ModernCard>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/notes">
                  <button className="w-full flex items-center gap-3 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
                    <FaBook />
                    <span className="text-sm font-medium">Browse Notes</span>
                  </button>
                </Link>
                <Link to="/ask-doubt">
                  <button className="w-full flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary/70 text-text-primary rounded-lg transition-colors">
                    <FaQuestionCircle />
                    <span className="text-sm font-medium">Ask a Doubt</span>
                  </button>
                </Link>
                <Link to="/quizzes">
                  <button className="w-full flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary/70 text-text-primary rounded-lg transition-colors">
                    <FaClipboardList />
                    <span className="text-sm font-medium">Take Quiz</span>
                  </button>
                </Link>
                <Link to="/chat">
                  <button className="w-full flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary/70 text-text-primary rounded-lg transition-colors relative">
                    <FaEnvelope />
                    <span className="text-sm font-medium">Messages</span>
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )}
                  </button>
                </Link>
              </div>
            </ModernCard>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
