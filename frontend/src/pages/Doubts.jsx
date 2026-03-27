import DashboardLayout from "../layouts/DashboardLayout";
import DoubtCard from "../components/DoubtCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { FaQuestionCircle, FaSearch } from "react-icons/fa";

export default function Doubts() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      const response = await API.get("/doubts");
      setDoubts(response.data);
    } catch (err) {
      setError("Failed to load doubts");
      console.error("Error fetching doubts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoubts = doubts.filter(doubt =>
    (doubt.question || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-text">Loading doubts...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 p-4">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text">
          Doubt Discussion
        </h1>

        <Link to="/ask-doubt">
          <button className="flex items-center gap-2 bg-primary text-text text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded hover:bg-primary/80 transition-colors shadow-md">
            <FaQuestionCircle /> Ask Doubt
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <input
          type="text"
          placeholder="Search doubts by question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 p-3 bg-secondary text-text rounded border border-dark/20 placeholder-text/70 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {filteredDoubts.length === 0 ? (
        <div className="text-center text-text/70 py-8">
          No doubts found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map((doubt, index) => (
            <DoubtCard key={doubt._id || index} doubt={doubt} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}