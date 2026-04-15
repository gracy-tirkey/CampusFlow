import "dotenv/config";

import express from "express";
import cors from "cors";
import http from "http";

import connectDB from "./config/db.js";
import { initSocket } from "./services/socket.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiStudyRoutes from "./routes/aiStudyRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);

// New routes for Phase 2 features
app.use("/api/ai-study", aiStudyRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/ai", aiChatRoutes);

// Share routes for user-to-user sharing
app.use("/api/share", shareRoutes);

app.get("/", (req, res) => {
  res.send("CampusFlow API Running");
});

// Error handling middleware (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

//  Create server AFTER app
const server = http.createServer(app);

//  Initialize socket
initSocket(server);

const PORT = process.env.PORT || 6090;

server
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use`);
    }
  });
