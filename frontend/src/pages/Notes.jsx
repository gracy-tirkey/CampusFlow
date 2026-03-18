import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

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
    <Navbar showLogo={ true } showSidebar={ false } />
    <div className="min-h-screen bg-light text-text p-6">


      <h1 className="text-3xl font-bold mb-6 text-text">
        Study Materials
      </h1>

      {error && (
        <div className="mb-4 p-2 bg-red-600 text-white rounded">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes by title, subject, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-secondary text-dark rounded border border-dark/20 placeholder-text/70"
        />
      </div>

      {/* Upload Form */}
        <div className="flex justify-end mb-6">
          <Link to="/upload-notes">
            <button className="bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors shadow-md">
              📤 Upload New Note
            </button>
          </Link>
        </div>

      {/* Notes List */}
      <div className="grid md:grid-cols-3 gap-6">

        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center text-text/70 py-8">
            No notes found.
          </div>
        ) : (
          filteredNotes.map((note)=>(
            <div
              key={note._id}
              className="bg-secondary p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >

              <h2 className="font-bold text-dark text-lg mb-2">
                {note.title}
              </h2>

              <p className="text-primary font-medium text-sm mb-1">
                Subject: {note.subject}
              </p>

              <p className="text-text/80 text-sm mb-3">
                {note.description}
              </p>

              <div className="text-xs text-text/60 mb-3">
                Uploaded by: {note.uploadedBy?.name || "Unknown"} ({note.role})
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(note.fileUrl)}
                  className="bg-primary hover:bg-primary/80 text-text px-3 py-1 rounded text-sm transition-colors"
                >
                  📥 Download
                </button>
                <button
                  onClick={() => handleShare(note)}
                  className="bg-secondary hover:bg-secondary/80 text-dark px-3 py-1 rounded text-sm border transition-colors"
                >
                  🔗 Share
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
