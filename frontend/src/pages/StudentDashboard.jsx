import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import HeroDashboard from "../components/HeroDashboard";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaQuestionCircle, FaStar } from "react-icons/fa";

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    notesDownloaded: 0,
    doubtsAsked: 0,
    quizPoints: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await API.get("/dashboard/stats");
        // Handle both response formats
        const statsData = response.data?.data || response.data;
        setStats(statsData);
        setError("");
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to load dashboard stats");
        // Set default stats on error
        setStats({
          notesDownloaded: 0,
          doubtsAsked: 0,
          quizPoints: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroDashboard />

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-200">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notes Downloaded */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaBook className="text-primary text-2xl" />
              <h3 className="text-lg font-semibold text-text">
                Notes Downloaded
              </h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {stats.notesDownloaded || 0}
            </p>
            <p className="text-text text-sm mt-2">Study materials accessed</p>
          </motion.div>

          {/* Doubts Asked */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaQuestionCircle className="text-primary text-2xl" />
              <h3 className="text-lg font-semibold text-text">Doubts Asked</h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {stats.doubtsAsked || 0}
            </p>
            <p className="text-text text-sm mt-2">Q&A interactions</p>
          </motion.div>

          {/* Quiz Points */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <FaStar className="text-primary text-2xl" />
              <h3 className="text-lg font-semibold text-text">Quiz Points</h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {stats.quizPoints || 0}
            </p>
            <p className="text-text text-sm mt-2">Total score earned</p>
          </motion.div>
        </div>

        {/* Quick Access Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/notes">
            <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-lg transition-colors border border-primary">
              📚 View Notes
            </button>
          </Link>
          <Link to="/ask-doubt">
            <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-lg transition-colors border border-primary">
              ❓ Ask a Doubt
            </button>
          </Link>
          <Link to="/quizzes">
            <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-3 rounded-lg transition-colors border border-primary">
              📝 Take Quiz
            </button>
          </Link>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
