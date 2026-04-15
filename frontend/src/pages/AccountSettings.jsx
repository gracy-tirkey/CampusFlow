import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaBook,
  FaAlignLeft,
  FaLock,
  FaEdit,
  FaCalendarAlt,
  FaTrophy,
  FaStar,
  FaShieldAlt,
  FaBell,
  FaCog,
  FaChevronRight,
} from "react-icons/fa";
import { ModernCard } from "../components/Card";
import API from "../api/axios";

export default function AccountSettings() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notesUploaded: 0,
    doubtsAnswered: 0,
    quizzesCreated: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // This would ideally come from a dedicated stats endpoint
      // For now, we'll use the dashboard stats
      const response = await API.get("/dashboard/stats");
      const statsData = response.data?.data || {};

      setStats({
        notesUploaded: statsData.notesUploaded || 0,
        doubtsAnswered: statsData.doubtsSolved || 0,
        quizzesCreated: statsData.quizzesCreated || 0,
        totalPoints: user?.points || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setStats({
        notesUploaded: 0,
        doubtsAnswered: 0,
        quizzesCreated: 0,
        totalPoints: user?.points || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Please login to view your account settings.</p>
        </div>
      </DashboardLayout>
    );
  }

  const joinedDate = new Date(user.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Account Settings
            </h1>
            <p className="text-text-secondary mt-1">
              Manage your profile and preferences
            </p>
          </div>
          <Link to="/edit-profile">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <FaEdit size={16} />
              Edit Profile
            </motion.button>
          </Link>
        </div>

        {/* Profile Overview Card */}
        <ModernCard
          elevated
          className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {user.name}
                  </h2>
                  <p className="text-text-secondary flex items-center gap-2 mt-1">
                    <FaEnvelope size={14} />
                    {user.email}
                  </p>
                  <p className="text-text-secondary flex items-center gap-2 mt-1">
                    <FaCalendarAlt size={14} />
                    Joined {joinedDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-primary/20 px-3 py-1 rounded-full text-sm font-semibold text-primary mb-2">
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <FaStar />
                    <span className="text-sm font-semibold">
                      {user.points || 0} Points
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="mb-4">
                  <p className="text-text-secondary italic">"{user.bio}"</p>
                </div>
              )}

              {/* Academic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {user.grade && (
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-primary" />
                    <span className="text-text-secondary">
                      Grade: {user.grade}
                    </span>
                  </div>
                )}
                {user.institution && (
                  <div className="flex items-center gap-2">
                    <FaUniversity className="text-primary" />
                    <span className="text-text-secondary">
                      {user.institution}
                    </span>
                  </div>
                )}
                {user.subjects && user.subjects.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FaBook className="text-primary" />
                    <span className="text-text-secondary">
                      {user.subjects.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ModernCard className="text-center">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaBook className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              {stats.notesUploaded}
            </h3>
            <p className="text-text-secondary text-sm">Notes Shared</p>
          </ModernCard>

          <ModernCard className="text-center">
            <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              {stats.doubtsAnswered}
            </h3>
            <p className="text-text-secondary text-sm">Doubts Answered</p>
          </ModernCard>

          <ModernCard className="text-center">
            <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaClipboardList className="text-purple-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              {stats.quizzesCreated}
            </h3>
            <p className="text-text-secondary text-sm">Quizzes Created</p>
          </ModernCard>

          <ModernCard className="text-center">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaTrophy className="text-yellow-600 text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">
              {stats.totalPoints}
            </h3>
            <p className="text-text-secondary text-sm">Total Points</p>
          </ModernCard>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-3 rounded-xl">
                <FaShieldAlt className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Security
                </h3>
                <p className="text-text-secondary text-sm">
                  Manage your account security
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                to="/edit-profile"
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaLock className="text-text-secondary" />
                  <span className="text-text-primary">Change Password</span>
                </div>
                <FaChevronRight className="text-text-secondary" />
              </Link>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-text-secondary" />
                  <span className="text-text-primary">Two-Factor Auth</span>
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </ModernCard>

          {/* Academic Preferences */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <FaGraduationCap className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Academic Preferences
                </h3>
                <p className="text-text-secondary text-sm">
                  Customize your learning experience
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                to="/edit-profile"
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaBook className="text-text-secondary" />
                  <span className="text-text-primary">Subject Interests</span>
                </div>
                <FaChevronRight className="text-text-secondary" />
              </Link>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCog className="text-text-secondary" />
                  <span className="text-text-primary">Learning Goals</span>
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </ModernCard>

          {/* Notifications */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <FaBell className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Notifications
                </h3>
                <p className="text-text-secondary text-sm">
                  Control your notification preferences
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-text-primary">Email Notifications</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-text-primary">Push Notifications</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </ModernCard>

          {/* Account Management */}
          <ModernCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-500/20 p-3 rounded-xl">
                <FaCog className="text-gray-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Account Management
                </h3>
                <p className="text-text-secondary text-sm">
                  Manage your account settings
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-text-primary">Data Export</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-500/20 rounded-lg">
                <span className="text-red-600">Delete Account</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </ModernCard>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
