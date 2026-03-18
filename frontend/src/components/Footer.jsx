import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-text py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-secondary">
            NotesProvider
          </h2>
          <p className="mt-3 text-sm text-text/80">
            A collaborative platform for students and teachers to share notes,
            solve doubts, and grow together.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-secondary transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-secondary transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-secondary transition">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">
            Connect
          </h3>
          <p className="text-sm text-text/80">
            Have questions or feedback? Reach out!
          </p>

          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-secondary transition">
              GitHub
            </a>
            <a href="#" className="hover:text-secondary transition">
              LinkedIn
            </a>
            <a href="#" className="hover:text-secondary transition">
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-secondary mt-8 pt-4 text-center text-sm text-text/70">
        © {new Date().getFullYear()} NotesProvider. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
