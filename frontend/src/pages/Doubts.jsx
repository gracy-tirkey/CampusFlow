import DashboardLayout from "../layouts/DashboardLayout";
import DoubtCard from "../components/DoubtCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";

function Doubts() {
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

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-text">
          Doubt Discussion
        </h1>

        <Link to="/ask-doubt">
          <button className="bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors shadow-md">
            ❓ Ask Doubt
          </button>
        </Link>

      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search doubts by question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-secondary text-text rounded border border-dark/20 placeholder-text/70"
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

export default Doubts;
