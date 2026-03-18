import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function AskDoubt() {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("question", question);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      await API.post("/doubts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/doubts");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post doubt");
      console.error("Error posting doubt:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="max-w-xl mx-auto bg-secondary p-8 rounded-lg shadow-md">

        <h1 className="text-2xl font-bold mb-6 text-text">
          Ask a Doubt
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <textarea
            placeholder="Describe your doubt..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70 resize-none"
            rows="4"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-3 bg-light text-text rounded border border-dark/20"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-text py-3 rounded hover:bg-primary/80 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Doubt"}
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default AskDoubt;
