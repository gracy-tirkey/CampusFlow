import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { FaUpload, FaDownload, FaShareAlt, FaSearch } from "react-icons/fa";
import { getRandomColor } from "../utils/colorPalette";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const buildFileUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `http://localhost:6090/${url.replace(/^\/+/, "")}`;
  };

  const isImageFile = (url) => {
    if (!url) return false;
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notes");

      // ✅ Handle consistent response format with .data wrapper
      const notesData = res.data?.data || res.data || [];
      setNotes(Array.isArray(notesData) ? notesData : []);
      setError("");
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
      setError("Failed to load notes. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = Array.isArray(notes)
    ? notes.filter(
        (note) =>
          (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (note.subject || "").toLowerCase().includes(search.toLowerCase()) ||
          (note.description || "").toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const handleDownload = (fileUrl) => {
    if (!fileUrl) return;

    const url = buildFileUrl(fileUrl);
    const fileName = fileUrl?.split("/").pop() || "download";

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const handleShare = (note) => {
    const url = buildFileUrl(note?.fileUrl);

    if (!url) return;

    if (navigator.share) {
      navigator.share({
        title: note.title || "Note",
        text: note.description || "",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light text-text flex justify-center items-center">
        Loading notes...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-light text-text p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Study Materials
          </h1>

          <Link to="/upload-notes">
            <button className="flex items-center gap-2 bg-[#a29bfe] text-text px-4 py-2 rounded hover:bg-primary/80 transition">
              <FaUpload /> Upload New Note
            </button>
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">{error}</div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-text/60" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-3 bg-secondary text-dark rounded border border-dark/20"
          />
        </div>

        {/* Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center text-text/70 py-8">
              No notes found.
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <div
                key={note._id}
                className="border border-secondary/20 p-5 rounded-xl shadow hover:shadow-lg transition"
                style={{ backgroundColor: getRandomColor(index) }}
              >
                <h2 className="font-bold text-lg mb-2">
                  {note.title || "Untitled"}
                </h2>

                <p className="text-sm text-primary mb-1">
                  Subject: {note.subject || "N/A"}
                </p>

                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {note.description || "No description"}
                </p>

                {isImageFile(note.fileUrl) && (
                  <img
                    src={buildFileUrl(note.fileUrl)}
                    alt={note.title}
                    className="w-full max-h-56 object-cover rounded mb-3"
                  />
                )}

                <div className="text-xs text-gray-500 mb-3">
                  Uploaded by: {note.uploadedBy?.name || "Unknown"}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(note.fileUrl)}
                    className="flex items-center gap-1 bg-[#02b875] text-white px-3 py-1 rounded text-sm"
                  >
                    <FaDownload /> Download
                  </button>

                  <button
                    onClick={() => handleShare(note)}
                    className="flex items-center gap-1 bg-[#0a66c2] text-white px-3 py-1 rounded text-sm"
                  >
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
