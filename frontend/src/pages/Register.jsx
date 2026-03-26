import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserPlus,
  FaExclamationCircle,
  FaSignInAlt
} from 'react-icons/fa';

import API from '../api/axios';
import useBackgroundImage from "../hooks/useBackgroundImage";

function Register() {
  const bgImage = useBackgroundImage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative bg-dark/90 backdrop-blur-md p-8 rounded-xl w-96 shadow-2xl border border-white/10">

        {/* Title */}
        <h2 className="text-2xl mb-6 text-center text-text flex items-center justify-center gap-2">
          <FaUserPlus className="text-primary" />
          Register
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded flex items-center gap-2 text-sm">
            <FaExclamationCircle />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Reusable Input Style */}
          {/* Name */}
          <div className="relative group">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 
                              text-primary/70 group-focus-within:text-primary" />

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-3 rounded-lg 
                         bg-white/5 border border-white/10 
                         text-text placeholder-text/60
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                         transition-all"
              required
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 
                                  text-primary/70 group-focus-within:text-primary" />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-3 rounded-lg 
                         bg-white/5 border border-white/10 
                         text-text placeholder-text/60
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                         transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 
                               text-primary/70 group-focus-within:text-primary" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-10 rounded-lg 
                         bg-white/5 border border-white/10 
                         text-text placeholder-text/60
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                         transition-all"
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer 
                         text-primary/70 hover:text-primary"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Role */}
          <div className="relative group">
            {formData.role === "student" ? (
              <FaUserGraduate className="absolute left-3 top-1/2 -translate-y-1/2 
                                         text-primary/70 group-focus-within:text-primary" />
            ) : (
              <FaChalkboardTeacher className="absolute left-3 top-1/2 -translate-y-1/2 
                                              text-primary/70 group-focus-within:text-primary" />
            )}

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-11 pl-10 pr-3 rounded-lg 
                         bg-white/5 border border-white/10 
                         text-text
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                         transition-all appearance-none"
            >
              <option className="bg-dark text-white" value="student">Student</option>
              <option className="bg-dark text-white" value="teacher">Teacher</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/80 rounded-lg text-text 
                       flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Login */}
        <p className="mt-4 text-center text-text text-sm flex items-center justify-center gap-2">
          Already have an account?
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <FaSignInAlt /> Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;