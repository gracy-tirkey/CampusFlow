import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-text py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-secondary">
            CampusFlow
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
              <Link to="/" className="hover:text-secondary transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-secondary transition-colors duration-200">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-secondary transition-colors duration-200">
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

          <div className="flex gap-4 mt-4 text-xl">
            <a
              href="https://github.com/gracy-tirkey/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors duration-200"
            >
              <FaGithub />
            </a>
            <a
              href="https://in.linkedin.com/in/gracy-tirkey-069945296"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary transition-colors duration-200"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:ariasaikia@gmail.com"
              className="hover:text-secondary transition-colors duration-200"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-secondary mt-8 pt-4 text-center text-sm text-text/70">
        © {new Date().getFullYear()} CampusFlow. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;