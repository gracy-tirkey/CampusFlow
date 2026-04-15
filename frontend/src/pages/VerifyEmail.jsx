import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaKey,
  FaExclamationCircle,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import useBackgroundImage from "../hooks/useBackgroundImage";
import { showSuccess, showError } from "../utils/toast";

function VerifyEmail() {
  const bgImage = useBackgroundImage();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      showError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Email information missing. Please register again");
      showError("Email information missing. Please register again");
      setLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      const userData = response.data.user;

      // Auto-login the user
      login(userData, null); // OTP verified but need token for API

      setSuccess("Email verified successfully! Redirecting...");
      showSuccess("Email verified! Logging you in...");

      // After verification, redirect to login to get token
      setTimeout(() => {
        navigate("/login", { state: { autoLoginEmail: email } });
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "OTP verification failed";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError("");

    try {
      await API.post("/auth/resend-otp", { email });
      setSuccess("OTP sent to your email!");
      showSuccess("OTP resent to your email!");
      setResendCooldown(60); // 60 second cooldown

      // Countdown timer
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to resend OTP";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div
        className="flex justify-center items-center min-h-screen relative py-6"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative bg-dark/90 backdrop-blur-md p-8 rounded-xl w-full max-w-md shadow-2xl border border-white/10 text-center mx-4">
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-text mb-4">
            Email information not found. Please register again.
          </p>
          <Link to="/register">
            <button className="bg-primary hover:bg-primary/80 text-text px-6 py-2 rounded transition">
              Back to Register
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen relative py-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative bg-dark/90 backdrop-blur-md p-8 rounded-xl w-full max-w-md shadow-2xl border border-white/10 mx-4">
        {/* Title */}
        <h2 className="text-2xl mb-2 text-center text-text flex items-center justify-center gap-2">
          <FaKey className="text-primary" />
          Verify Email
        </h2>

        <p className="text-center text-text/70 text-sm mb-6">
          We've sent an OTP to <br />
          <span className="text-primary font-semibold">{email}</span>
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600 text-red-200 rounded flex items-center gap-2 text-sm">
            <FaExclamationCircle />
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 p-3 bg-green-600/20 border border-green-600 text-green-200 rounded text-sm">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input */}
          <div className="relative group">
            <FaKey
              className="absolute left-3 top-1/2 -translate-y-1/2 
                              text-primary/70 group-focus-within:text-primary"
            />

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength="6"
              disabled={loading}
              className="w-full h-11 pl-10 pr-3 rounded-lg text-center text-2xl tracking-widest
                         bg-white/5 border border-white/10 
                         text-text placeholder-text/60
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                         transition-all disabled:opacity-50"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/80 rounded-lg text-text 
                       flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-semibold"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center border-t border-white/10 pt-6">
          <p className="text-text/70 text-sm mb-2">Didn't receive OTP?</p>
          <button
            onClick={handleResend}
            disabled={resendLoading || resendCooldown > 0}
            className="text-primary hover:text-primary/80 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
          >
            {resendCooldown > 0 ? (
              <>
                <FaClock className="text-xs" />
                Resend in {resendCooldown}s
              </>
            ) : (
              `${resendLoading ? "Sending..." : "Resend OTP"}`
            )}
          </button>
        </div>

        {/* Back to Register */}
        <div className="mt-6 text-center border-t border-white/10 pt-6">
          <Link
            to="/register"
            className="text-primary hover:text-primary/80 flex items-center justify-center gap-2"
          >
            <FaArrowLeft className="text-xs" />
            Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
