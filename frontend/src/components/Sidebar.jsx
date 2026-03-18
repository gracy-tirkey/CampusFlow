import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-dark p-5 flex flex-col shadow-lg min-h-screen">

      {/* Logo */}
      <div className="mb-6 flex justify-center items-center h-24 overflow-hidden">
        <img
          src="/images/logo-2.png"
          alt="Logo"
          className="h-full scale-[2.5] object-contain p-1"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4 border-t border-secondary pt-4">

        <Link
          to="/student/dashboard"
          className="text-text hover:text-primary transition-colors py-2 px-3 rounded hover:bg-secondary/20"
        >
          Dashboard
        </Link>

        <Link
          to="/notes"
          className="text-text hover:text-primary transition-colors py-2 px-3 rounded hover:bg-secondary/20"
        >
          Notes
        </Link>

        <Link
          to="/doubts"
          className="text-text hover:text-primary transition-colors py-2 px-3 rounded hover:bg-secondary/20"
        >
          Doubts
        </Link>

        <Link
          to="/chat"
          className="text-text hover:text-primary transition-colors py-2 px-3 rounded hover:bg-secondary/20"
        >
          Chat
        </Link>

        <Link
          to="/quiz"
          className="text-text hover:text-primary transition-colors py-2 px-3 rounded hover:bg-secondary/20"
        >
          Quiz
        </Link>
      </nav>
    </div>
  );
}
