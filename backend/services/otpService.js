import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * Hash OTP for storage in database
 * @param {string} otp - Plain OTP code
 * @returns {Promise<string>} Hashed OTP
 */
export const hashOTP = async (otp) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    return hashedOTP;
  } catch (error) {
    throw new Error(`Error hashing OTP: ${error.message}`);
  }
};

/**
 * Verify OTP against stored hash
 * @param {string} plainOTP - Plain OTP from user
 * @param {string} hashedOTP - Hashed OTP from database
 * @returns {Promise<boolean>} True if OTP matches
 */
export const verifyOTP = async (plainOTP, hashedOTP) => {
  try {
    const isMatch = await bcrypt.compare(plainOTP, hashedOTP);
    return isMatch;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};

/**
 * Check if OTP has expired
 * @param {Date} expiryTime - OTP expiry timestamp from database
 * @returns {boolean} True if OTP has expired
 */
export const isOTPExpired = (expiryTime) => {
  if (!expiryTime) return true;
  return new Date() > new Date(expiryTime);
};

/**
 * Calculate OTP expiry time (current time + X minutes)
 * @param {number} minutes - Number of minutes until OTP expires (default: 10)
 * @returns {Date} OTP expiry timestamp
 */
export const calculateOTPExpiry = (minutes = 10) => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + minutes);
  return expiryTime;
};

export default {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired,
  calculateOTPExpiry,
};
