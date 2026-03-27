import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaComments,
  FaClipboardList,
  FaTimes
} from "react-icons/fa";

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-2 text-text hover:text-primary transition-colors py-2 px-3 rounded hover:bg-secondary/20 text-sm";
    return isActive(path)
      ? `${baseClass} bg-primary/20 text-primary font-semibold border-l-4 border-primary`
      : baseClass;
  };
  return (
    <div className="w-56 bg-dark p-4 flex flex-col shadow-lg min-h-screen text-sm relative">
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text hover:text-primary md:hidden"
      >
        <FaTimes size={20} />
      </button>

      {/* Logo */}
      <div className="mb-6 flex justify-center items-center h-20 overflow-hidden">
        <img
          src="/images/logo-2.png"
          alt="Logo"
          className="h-full scale-[2] object-contain p-1 hover:scale-[2.1] transition-transform"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 border-t border-secondary pt-3">

        <Link
          to="/"
          className={getLinkClass("/")}
          onClick={onClose}
        >
          <FaHome /> <span className="hidden md:inline">Home</span>
        </Link>

        <Link
          to="/notes"
          className={getLinkClass("/notes")}
          onClick={onClose}
        >
          <FaBook /> Notes
        </Link>

        <Link
          to="/doubts"
          className={getLinkClass("/doubts")}
          onClick={onClose}
        >
          <FaQuestionCircle /> Doubts
        </Link>

        <Link
          to="/chat"
          className={getLinkClass("/chat")}
          onClick={onClose}
        >
          <FaComments /> Chat
        </Link>

        <Link
          to="/quiz"
          className={getLinkClass("/quiz")}
          onClick={onClose}
        >
          <FaClipboardList /> Quiz
        </Link>
      </nav>
    </div>
  );
}