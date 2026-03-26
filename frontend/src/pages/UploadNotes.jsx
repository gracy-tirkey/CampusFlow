import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaUpload, FaFileAlt, FaBook, FaAlignLeft } from "react-icons/fa";

export default function UploadNotes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      setError("Failed to load notes");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const uploadNote = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    formData.append("file", file);

    try {
      await API.post("/notes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      fetchNotes();

      setTitle("");
      setDescription("");
      setSubject("");
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload note");
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light text-text p-6">


      {error && (
        <div className="mb-4 p-2 bg-red-600 text-white rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={uploadNote}
        className="bg-dark p-6 mx-20 rounded-lg mb-8 space-y-4 shadow-md"
      >
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">Upload Notes</h2>

        <div className="flex items-center gap-2">
          <FaFileAlt className="text-primary" />
          <input
            className="w-full p-3 bg-light text-text rounded border border-dark/20"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <FaBook className="text-primary" />
          <input
            className="w-full p-3 bg-light text-text rounded border border-dark/20"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <FaAlignLeft className="text-primary" />
          <input
            className="w-full p-3 bg-light text-text rounded border border-dark/20"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FaUpload className="text-primary" />
          <input
            type="file"
            className="w-full p-3 bg-light text-text rounded border border-dark/20"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="flex items-center gap-2 bg-secondary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors"
        >
          <FaUpload /> {uploading ? "Uploading..." : "Upload Note"}
        </button>

      </form>
    </div>
  );
}