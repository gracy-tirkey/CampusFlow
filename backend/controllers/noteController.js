import Note from "../models/Note.js";

export const uploadNote = async (req, res) => {

  try {

    const { title, description, subject } = req.body;

    const note = new Note({
      title,
      description,
      subject,
      fileUrl: req.file.path,
      uploadedBy: req.user.id,
      role: req.user.role
    });

    await note.save();

    res.status(201).json({
      message: "Note uploaded successfully",
      note
    });

  } catch (error) {

    res.status(500).json({
      message: "Upload failed"
    });

  }

};


export const getNotes = async (req, res) => {

  try {

    const notes = await Note.find()
      .populate("uploadedBy", "name email role");

    res.json(notes);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching notes"
    });

  }

};