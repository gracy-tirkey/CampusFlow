import nodemailer from "nodemailer";

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP email to user
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} name - User's name
 */
export const sendOTPEmail = async (email, otp, name = "User") => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "CampusFlow - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #059669; margin-bottom: 20px;">Email Verification</h2>
            
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Hi <strong>${name}</strong>,
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Thank you for registering with CampusFlow! To complete your registration, please verify your email using the OTP below:
            </p>
            
            <div style="background-color: #f0fdf4; border: 2px solid #059669; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Your OTP Code</p>
              <p style="margin: 10px 0; font-size: 36px; font-weight: bold; color: #059669; letter-spacing: 5px;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              <strong>This OTP will expire in 10 minutes.</strong>
            </p>
            
            <p style="color: #666; font-size: 13px; margin-bottom: 20px;">
              If you didn't request this email, please ignore it or contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2024 CampusFlow. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully:", info.response);
    return { success: true, message: "OTP sent to email" };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetLink - Password reset link
 * @param {string} name - User's name
 */
export const sendPasswordResetEmail = async (
  email,
  resetLink,
  name = "User",
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "CampusFlow - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #059669; margin-bottom: 20px;">Password Reset</h2>
            
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Hi <strong>${name}</strong>,
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 13px; margin-bottom: 20px;">
              Or copy and paste this link in your browser:<br>
              <a href="${resetLink}" style="color: #059669; word-break: break-all;">${resetLink}</a>
            </p>
            
            <p style="color: #999; font-size: 13px; margin-bottom: 20px;">
              <strong>This link will expire in 1 hour.</strong>
            </p>
            
            <p style="color: #666; font-size: 13px;">
              If you didn't request this, you can ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2024 CampusFlow. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent successfully:", info.response);
    return { success: true, message: "Password reset link sent to email" };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

/**
 * Send welcome email
 * @param {string} email - User's email address
 * @param {string} name - User's name
 */
export const sendWelcomeEmail = async (email, name = "User") => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to CampusFlow!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #059669; margin-bottom: 20px;">Welcome to CampusFlow! 🎉</h2>
            
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Hi <strong>${name}</strong>,
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              Your email has been successfully verified! You can now enjoy all the features of CampusFlow:
            </p>
            
            <ul style="color: #666; font-size: 14px; margin-bottom: 20px;">
              <li>📚 Access study materials and lecture notes</li>
              <li>❓ Ask and answer doubts</li>
              <li>📝 Create and take quizzes</li>
              <li>💬 Connect with mentors and peers</li>
              <li>🎯 Track your learning progress</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 13px;">
              Happy learning! If you have any questions, feel free to contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2024 CampusFlow. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent successfully:", info.response);
    return { success: true, message: "Welcome email sent" };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
};

export default { sendOTPEmail, sendPasswordResetEmail, sendWelcomeEmail };
