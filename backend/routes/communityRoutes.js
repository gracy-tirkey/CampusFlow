import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  commentOnPost,
  getPostsByCategory,
  getTrendingPosts,
  sharePost,
  deletePost,
} from "../controllers/communityController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Posts
router.post("/create", verifyToken, createPost);
router.get("/all", getAllPosts);
router.get("/trending", getTrendingPosts);
router.get("/category/:category", getPostsByCategory);
router.get("/:id", getPostById);
router.delete("/:id", verifyToken, deletePost);

// Interactions
router.post("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, commentOnPost);
router.post("/:id/share", verifyToken, sharePost);

export default router;
