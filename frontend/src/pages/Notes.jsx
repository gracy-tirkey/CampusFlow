import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { FaUpload, FaDownload, FaShareAlt, FaSearch } from "react-icons/fa";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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

  const filteredNotes = notes.filter(note =>
    (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (note.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (note.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5001/${fileUrl}`;
    link.download = fileUrl.split('/').pop();
    link.click();
  };

  const handleShare = (note) => {
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: note.description,
        url: `http://localhost:5001/${note.fileUrl}`
      });
    } else {
      navigator.clipboard.writeText(`http://localhost:5001/${note.fileUrl}`);
      alert('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light text-text p-6 flex justify-center items-center">
        <div>Loading notes...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar showLogo={true} showSidebar={false} />
      <div className="min-h-screen bg-light text-text p-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text">
            Study Materials
          </h1>

          <Link to="/upload-notes">
            <button className="flex items-center gap-2 bg-primary text-text text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded hover:bg-primary/80 transition-colors shadow-md">
              <FaUpload /> Upload New Note
            </button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-text/60" />
          <input
            type="text"
            placeholder="Search notes by title, subject, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-3 bg-secondary text-dark rounded border border-dark/20 placeholder-text/70"
          />
        </div>

        {/* Notes List */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center text-text/70 py-8">
              No notes found.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-secondary p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="font-bold text-dark text-lg mb-2">{note.title}</h2>
                <p className="text-primary font-medium text-sm mb-1">Subject: {note.subject}</p>
                <p className="text-text/80 text-sm mb-3">{note.description}</p>
                <div className="text-xs text-text/60 mb-3">
                  Uploaded by: {note.uploadedBy?.name || "Unknown"} ({note.role})
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(note.fileUrl)}
                    className="flex items-center gap-1 bg-primary hover:bg-primary/80 text-text px-3 py-1 rounded text-sm transition-colors"
                  >
                    <FaDownload /> Download
                  </button>
                  <button
                    onClick={() => handleShare(note)}
                    className="flex items-center gap-1 bg-secondary hover:bg-secondary/80 text-dark px-3 py-1 rounded text-sm border transition-colors"
                  >
                    <FaShareAlt /> Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}