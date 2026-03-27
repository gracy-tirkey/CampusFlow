import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaComments,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaBars
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Navbar({ showLogo = true, showSidebar = false, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-1 transition-all duration-200 py-1 px-2 rounded";
    return isActive(path)
      ? `${baseClass} text-primary font-bold bg-primary/10 border-b-2 border-primary`
      : `${baseClass} text-text hover:text-primary hover:bg-primary/5`;
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="bg-dark px-6 py-3 flex justify-between items-center shadow-md text-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger menu for sidebar */}
        {showSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-text hover:text-primary md:hidden"
          >
            <FaBars size={20} />
          </button>
        )}

        {/* Logo */}
        {showLogo && (
          <img
            src="/images/logo-2.png"
            alt="CampusFlow Logo"
            className="h-8 sm:h-10 md:h-12 object-contain hover:scale-110 transition-all duration-300 drop-shadow-lg border border-primary/20 rounded-md p-1 bg-white/10 backdrop-blur-sm"
          />
        )}
      </div>

      <div className="flex gap-6 ml-auto items-center text-sm">

        {user ? (
          <>
            {!showSidebar && (
              <>
                {/* Home */}
                <Link
                  to="/"
                  className={getLinkClass("/")}
                >
                  <FaHome /> <span className="hidden md:inline">Home</span>
                </Link>
                {/* Notes */}
                <Link
                  to="/notes"
                  className={getLinkClass("/notes")}
                >
                  <FaBook />
                  <span className="hidden md:inline">Notes</span>
                </Link>

                {/* Q&A */}
                <Link
                  to="/doubts"
                  className={getLinkClass("/doubts")}
                >
                  <FaQuestionCircle />
                  <span className="hidden md:inline">Doubts</span>
                </Link>

                {/* Chat */}
                <Link
                  to="/chat"
                  className={getLinkClass("/chat")}
                >
                  <FaComments />
                  <span className="hidden md:inline">Chat</span>
                </Link>

                {/* Quiz */}
                <Link
                  to="/quiz"
                  className={getLinkClass("/quiz")}
                >
                  <FaClipboardList />
                  <span className="hidden md:inline">Quiz</span>
                </Link>
              </>
            )}

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 text-text hover:text-primary transition"
              >
                <FaUserCircle size={20} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-light rounded-md shadow-lg z-10">

                  {/* User Name */}
                  <div className="flex justify-center p-2 bg-secondary text-text font-semibold">
                    {user.name}
                  </div>

                  <Link
                    to={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}
                    className="flex items-center gap-2 px-4 py-2 text-text hover:bg-primary hover:text-white transition"
                    onClick={() => setShowDropdown(false)}
                  >
                   <FaUser/> View Profile
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-text hover:bg-red-500 hover:text-white transition"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Login */}
            <Link
              to="/login"
              className="flex items-center gap-1 text-text hover:text-primary transition"
            >
              <FaSignInAlt /> Login
            </Link>

            {/* Register */}
            <Link
              to="/register"
              className="flex items-center gap-1 text-text hover:text-primary transition"
            >
              <FaUserPlus /> Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;