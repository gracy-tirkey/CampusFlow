import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaCheckCircle,
  FaClipboardList,
  FaUsers,
  FaChartLine,
  FaBook,
  FaQuestionCircle,
  FaChevronRight,
  FaExclamationTriangle,
  FaChalkboardTeacher,
  FaStar,
  FaClock,
  FaUserGraduate,
} from "react-icons/fa";
import { ModernCard, StatsCard } from "../components/Card";

function TeacherDashboard() {
  const { user } = useAuth();
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
      const summaryResponse = await API.get("/dashboard/teacher/summary");
      const activityResponse = await API.get(
        "/dashboard/teacher/recent-activity",
      );

      const summary = summaryResponse.data?.data;
      const activity = activityResponse.data?.data;

      setDashboardData({
        ...summary,
        ...activity,
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
            <p className="text-muted">Loading your teaching dashboard...</p>
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
              <Link to="/upload-notes">
                <button className="w-full bg-secondary hover:bg-secondary/80 text-text-primary py-2 px-4 rounded-lg transition-colors">
                  Upload Notes Instead
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
    notesUploaded = 0,
    doubtsAnswered = 0,
    totalStudentsEngaged = 0,
    quizzesCreated = 0,
    quizResultsSummary = {},
    latestStudentActivities = [],
    recentUploads = [],
    pendingDoubts = [],
    recentNotes = [],
    recentDoubtsAnswered = [],
    recentQuizResults = [],
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
                Welcome back, {profileSummary?.name || "Teacher"}! 👋
              </h1>
              <p className="text-text-secondary mb-4">
                Here's your teaching impact and recent activities.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaChalkboardTeacher className="text-blue-500" />
                  <span>
                    {profileSummary?.subjects?.join(", ") || "No subjects"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-green-500" />
                  <span>{totalStudentsEngaged} Students Engaged</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span>
                    {quizResultsSummary.averageScore || 0} Avg Quiz Score
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <FaChalkboardTeacher size={32} className="text-primary" />
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={FaBook}
            title="Notes Uploaded"
            value={notesUploaded}
            unit="notes shared"
            category="notes"
          />
          <StatsCard
            icon={FaCheckCircle}
            title="Doubts Answered"
            value={doubtsAnswered}
            unit="questions solved"
            category="doubts"
          />
          <StatsCard
            icon={FaUsers}
            title="Students Engaged"
            value={totalStudentsEngaged}
            unit="learners reached"
            category="community"
          />
          <StatsCard
            icon={FaClipboardList}
            title="Quizzes Created"
            value={quizzesCreated}
            unit="assessments made"
            category="quizzes"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Student Quiz Results */}
            <ModernCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recent Student Performance
                </h3>
                <Link
                  to="/create-quiz"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  Create Quiz <FaChevronRight size={12} />
                </Link>
              </div>
              {recentQuizResults.length > 0 ? (
                <div className="space-y-3">
                  {recentQuizResults.slice(0, 5).map((result, idx) => (
                    <motion.div
                      key={result._id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <FaUserGraduate size={12} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary text-sm">
                            {result.userId?.name}
                          </h4>
                          <p className="text-xs text-text-secondary">
                            {result.quizId?.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary">
                          {result.percentage}%
                        </div>
                        <div className="text-xs text-text-muted">
                          {new Date(result.createdAt).toLocaleDateString()}
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
                  <Link to="/create-quiz">
                    <button className="mt-2 text-primary hover:underline">
                      Create Your First Quiz
                    </button>
                  </Link>
                </div>
              )}
            </ModernCard>

            {/* Recent Notes Uploaded */}
            <ModernCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recent Notes Shared
                </h3>
                <Link
                  to="/upload-notes"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  Upload More <FaChevronRight size={12} />
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
                          {note.subject} • {note.downloads} downloads
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
                  <p>No notes uploaded yet</p>
                  <Link to="/upload-notes">
                    <button className="mt-2 text-primary hover:underline">
                      Share Your First Notes
                    </button>
                  </Link>
                </div>
              )}
            </ModernCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Doubts */}
            <ModernCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Pending Doubts
                </h3>
                <Link
                  to="/doubts"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  View All <FaChevronRight size={12} />
                </Link>
              </div>
              {pendingDoubts.length > 0 ? (
                <div className="space-y-3">
                  {pendingDoubts.slice(0, 3).map((doubt, idx) => (
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
                          by {doubt.askedBy?.name}
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
                  <FaCheckCircle
                    size={24}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p className="text-sm">All caught up!</p>
                  <p className="text-xs text-text-muted">No pending doubts</p>
                </div>
              )}
            </ModernCard>

            {/* Recent Doubts Answered */}
            <ModernCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recently Answered
                </h3>
                <Link
                  to="/doubts"
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  View All <FaChevronRight size={12} />
                </Link>
              </div>
              {recentDoubtsAnswered.length > 0 ? (
                <div className="space-y-3">
                  {recentDoubtsAnswered.slice(0, 3).map((doubt, idx) => (
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
                          Answered {doubt.answers?.length || 0} times
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
                  <p className="text-sm">No recent answers</p>
                </div>
              )}
            </ModernCard>

            {/* Quick Actions */}
            <ModernCard>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/upload-notes">
                  <button className="w-full flex items-center gap-3 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
                    <FaUpload />
                    <span className="text-sm font-medium">Upload Notes</span>
                  </button>
                </Link>
                <Link to="/create-quiz">
                  <button className="w-full flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary/70 text-text-primary rounded-lg transition-colors">
                    <FaClipboardList />
                    <span className="text-sm font-medium">Create Quiz</span>
                  </button>
                </Link>
                <Link to="/doubts">
                  <button className="w-full flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary/70 text-text-primary rounded-lg transition-colors relative">
                    <FaQuestionCircle />
                    <span className="text-sm font-medium">Answer Doubts</span>
                    {pendingDoubts.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingDoubts.length > 9 ? "9+" : pendingDoubts.length}
                      </span>
                    )}
                  </button>
                </Link>
                <Link to="/community">
                  <button className="w-full flex items-center gap-3 p-3 bg-secondary/50 hover:bg-secondary/70 text-text-primary rounded-lg transition-colors">
                    <FaUsers />
                    <span className="text-sm font-medium">View Community</span>
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

export default TeacherDashboard;
