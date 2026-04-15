import Note from "../models/Note.js";
import { successResponse, errorResponse } from "../utils/responseFormatter.js";

export const uploadNote = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    // ✅ Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    // ✅ Validate file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload a PDF or image file.",
      });
    }

    // ✅ Validate file URL from Cloudinary
    if (!req.file.path) {
      return res.status(400).json({
        success: false,
        message: "File upload to cloud storage failed",
      });
    }

    // ✅ Create and save note with all fields
    const note = new Note({
      title: title.trim(),
      description: description?.trim() || "",
      subject: subject.trim(),
      fileUrl: req.file.path,
      uploadedBy: req.user.id,
      role: req.user.role,
    });

    await note.save();
    await note.populate("uploadedBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Note uploaded successfully",
      data: note,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Upload failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    // ✅ Always return consistent format with 'data' wrapper
    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
    });
  } catch (error) {
    console.error("Fetch notes error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching notes",
      data: [],
    });
  }
};
