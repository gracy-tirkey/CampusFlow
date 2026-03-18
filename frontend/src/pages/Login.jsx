import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import useBackgroundImage from "../hooks/useBackgroundImage";
import { useAuth } from "../context/AuthContext";

function Login() {
  const bgImage = useBackgroundImage();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
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

      // Use the login function from AuthContext to properly set user state
      login(res.data.user, res.data.token);

      // Navigate based on user role
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
            <h2 className="text-2xl mb-6 text-center text-text">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-secondary text-text rounded placeholder-text/70"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-secondary text-text rounded placeholder-text/70"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/80 p-2 rounded text-text disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-text">
          Don't have an account? <Link to="/register" className="text-primary hover:text-primary/80">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
