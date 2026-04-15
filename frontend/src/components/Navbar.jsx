import { useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaSearch, FaBell, FaCog } from "react-icons/fa";

export default function Navbar({ onToggleSidebar, showSearch = true }) {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-lg bg-glass border-b border-secondary/30 shadow-soft sticky top-0 z-40"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary/30 transition-all text-text-primary"
        >
          <FaBars size={20} />
        </button>

        {/* Center - Search */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex flex-1 max-w-md ml-6"
          >
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-full bg-background/40 backdrop-blur-md border transition-all duration-300 ${
                searchFocus
                  ? "border-primary/50 bg-background/60"
                  : "border-secondary/30"
              }`}
            >
              <FaSearch className="text-text-tertiary opacity-70" size={14} />
              <input
                type="text"
                placeholder="Search notes, doubts, quizzes..."
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                className="bg-transparent outline-none text-text-primary placeholder-text-tertiary/50 flex-1 text-sm"
              />
            </div>
          </motion.div>
        )}

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-lg hover:bg-secondary/30 transition-all flex items-center justify-center text-text-primary"
          >
            <FaBell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-lg hover:bg-secondary/30 transition-all flex items-center justify-center text-text-primary"
          >
            <FaCog size={18} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
