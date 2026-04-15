import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
  FaCodeBranch,
} from "react-icons/fa";
import React from "react";

function Footer() {
  return (
    <footer className="bg-dark/95 text-text py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-secondary">CampusFlow</h2>
          <p className="mt-3 text-sm text-text/80 leading-relaxed">
            Empowering students and educators with a seamless platform to share
            notes, collaborate, and solve doubts efficiently.
          </p>

          {/* Version / Status */}
          <p className="mt-4 text-xs text-text-muted flex items-center gap-2">
            <FaCodeBranch /> Version 1.0
          </p>
        </div>

        {/* Platform */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-secondary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/notes" className="hover:text-secondary">
                Notes
              </Link>
            </li>
            <li>
              <Link to="/doubts" className="hover:text-secondary">
                Doubts
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-secondary">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-secondary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-secondary">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-secondary">
                Register
              </Link>
            </li>
            <li>
              <Link to="/notes" className="hover:text-secondary">
                Notes
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer / Contact */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Developer</h3>

          <p className="text-sm text-text/80">
            Built by{" "}
            <span className="text-secondary font-medium">Gracy Tirkey</span>
          </p>

          <p className="text-xs mt-2 text-text/60">
            Open to collaborations & opportunities
          </p>

          <div className="flex gap-4 mt-4 text-xl">
            <a
              href="https://github.com/gracy-tirkey/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary"
            >
              <FaGithub />
            </a>

            <a
              href="https://in.linkedin.com/in/gracy-tirkey-069945296"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary"
            >
              <FaLinkedin />
            </a>

            <a
              href="mailto:ariasaikia@gmail.com"
              className="hover:text-secondary"
            >
              <FaEnvelope />
            </a>
          </div>

          {/* GitHub CTA */}
          <a
            href="https://github.com/gracy-tirkey/CampusFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-xs text-secondary hover:underline"
          >
            <FaGithub /> View Project on GitHub
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-secondary mt-10 pt-5 text-center text-sm text-text/70">
        <p>© {new Date().getFullYear()} CampusFlow. All rights reserved.</p>

        <p className="mt-2 flex justify-center items-center gap-2 text-xs text-text/60">
          Made with <FaHeart className="text-red-500" /> using MERN Stack
        </p>
      </div>
    </footer>
  );
}

export default Footer;
