import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

function Navbar({ showLogo = true, showSidebar = false }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="bg-dark p-4 flex justify-between items-center shadow-md">

      {/* Logo */}
      {showLogo && (
        <img
          src="/images/logo-2.png"
          alt="Logo"
          className="pl-3 pt-1 h-12 scale-[4.5] object-contain"
        />
      )}

      <div className="flex gap-6 ml-auto items-center">

        {/* Always visible */}
        <Link to="/" className="text-text hover:text-primary transition-colors">
          Home
        </Link>

        {user ? (
          <>
            {/* ✅ SHOW ONLY WHEN SIDEBAR IS NOT PRESENT */}
            {!showSidebar && (
              <>
                <Link
                  to={user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}
                  className="text-text hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>

                <Link to="/notes" className="text-text hover:text-primary transition-colors">
                  Notes
                </Link>

                <Link to="/doubts" className="text-text hover:text-primary transition-colors">
                  Doubts
                </Link>

                <Link to="/chat" className="text-text hover:text-primary transition-colors">
                  Chat
                </Link>

                <Link to="/quiz" className="text-text hover:text-primary transition-colors">
                  Quiz
                </Link>
              </>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-text hover:text-primary transition-colors flex items-center gap-2"
              >
                <span>👤</span> 
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-light rounded-md shadow-lg z-10">
                  <p className="flex justify-center p-2 bg-secondary text-text">{user.name}</p>
                  <Link
                    to="/edit-profile"
                    className="block px-4 py-2 text-text hover:bg-primary hover:text-text"
                    onClick={() => setShowDropdown(false)}
                  >
                    Edit Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-text hover:bg-primary hover:text-text"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-text hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-text hover:text-primary transition-colors">
              Register
            </Link>
          </>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-text hover:text-primary transition-colors"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
