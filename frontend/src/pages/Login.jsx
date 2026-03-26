import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserPlus,
  FaExclamationCircle
} from "react-icons/fa";

import API from "../api/axios";
import useBackgroundImage from "../hooks/useBackgroundImage";
import { useAuth } from "../context/AuthContext";

function Login() {
  const bgImage = useBackgroundImage();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      login(res.data.user, res.data.token);

      if (res.data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-dark/80 backdrop-blur-md p-8 rounded-lg w-96 shadow-lg"
      >
        {/* Title with icon */}
        <h2 className="text-2xl mb-6 text-center text-text flex items-center justify-center gap-2">
          <FaSignInAlt /> Login
        </h2>

        {/* Error with icon */}
        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded flex items-center gap-2">
            <FaExclamationCircle />
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text/60" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 pl-10 bg-secondary text-text rounded placeholder-text/70"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/60" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pl-10 pr-10 bg-secondary text-text rounded placeholder-text/70"
            required
          />

          {/* Show/Hide Password */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text/60"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Button with icon */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/80 p-2 rounded text-text disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Link with icon */}
        <p className="mt-4 text-center text-text flex items-center justify-center gap-2">
          Don't have an account?
          <Link
            to="/register"
            className="text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <FaUserPlus /> Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;