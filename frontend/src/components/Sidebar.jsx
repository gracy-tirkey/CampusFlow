import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaComments,
  FaClipboardList,
  FaTimes,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaBrain,
  FaBriefcase,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    return user.role === "teacher"
      ? "/teacher/dashboard"
      : "/student/dashboard";
  };

  const navigationSections = [
    {
      title: "Main",
      items: [{ name: "Dashboard", path: getDashboardPath(), icon: FaHome }],
    },
    {
      title: "Learning",
      items: [
        { name: "Notes", path: "/notes", icon: FaBook },
        { name: "Doubts", path: "/doubts", icon: FaQuestionCircle },
        { name: "Quiz", path: "/quiz", icon: FaClipboardList },
      ],
    },
    {
      title: "Community",
      items: [
        { name: "Chat", path: "/chat", icon: FaComments },
        { name: "Mentors", path: "/mentors", icon: FaUserCircle },
        { name: "Network", path: "/community", icon: FaUsers },
      ],
    },
    {
      title: "Growth",
      items: [
        { name: "Chat with AI", path: "/ai-chat", icon: FaBrain },
        { name: "AI Assistant", path: "/ai-assistant", icon: FaBrain },
        { name: "Career Hub", path: "/career", icon: FaBriefcase },
        { name: "Calendar", path: "/calendar", icon: FaCalendarAlt },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 fixed top-0 left-0 h-screen z-50 bg-gradient-to-b from-background via-background to-background-secondary/20 backdrop-blur-lg shadow-glass border-r border-border flex flex-col"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-primary hover:text-primary md:hidden z-10"
      >
        <FaTimes size={20} />
      </button>

      {/* 🔹 HEADER (fixed) */}
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-primary to-accent rounded-2xl">
          <img
            src="/images/logo-2.png"
            alt="Logo"
            className="h-12 object-contain"
          />
        </div>
      </div>

      {/* 🔹 SCROLLABLE NAV (ONLY THIS SCROLLS) */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-3 opacity-70">
              {section.title}
            </p>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-1 rounded-xl transition-all duration-200 relative ${
                      active
                        ? "bg-gradient-to-r from-primary to-secondary text-text-primary"
                        : "text-text-primary hover:bg-surface-secondary hover:text-primary"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium flex-1">{item.name}</span>

                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 FOOTER (fixed) */}
      <div className="border-t border-border p-4 space-y-4 flex-shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-secondary hover:bg-primary-hover rounded-xl text-text-primary transition-colors"
        >
          {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Profile */}
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-secondary rounded-xl transition-colors">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <FaUserCircle className="text-lg text-text-primary" />
          </div>
          <div className="text-left text-sm">
            <p className="font-semibold text-text-primary text-xs">Account</p>
            <p className="text-text-muted text-xs opacity-75">
              Profile Settings
            </p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
