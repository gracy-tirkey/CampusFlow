import express from "express";
import {
  createResource,
  getAllResources,
  getResourcesByTrack,
  getResourcesByCategory,
  getResourceById,
  getCareerPaths,
  rateResource,
  updateResource,
  deleteResource,
} from "../controllers/careerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Resource management
router.post("/create", verifyToken, createResource);
router.get("/all", getAllResources);
router.get("/tracks", getCareerPaths);
router.get("/:id", getResourceById);
router.put("/:id", verifyToken, updateResource);
router.delete("/:id", verifyToken, deleteResource);

// Filtered resources
router.get("/track/:track", getResourcesByTrack);
router.get("/category/:category", getResourcesByCategory);

// Rating
router.post("/:id/rate", verifyToken, rateResource);

export default router;
