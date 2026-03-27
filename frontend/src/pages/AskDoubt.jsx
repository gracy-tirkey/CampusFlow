import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import { FaPaperPlane, FaImage, FaQuestionCircle } from "react-icons/fa";

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
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 bg-secondary p-6 sm:p-8 rounded-lg shadow-md">

        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-6 text-text">
          <FaQuestionCircle /> Ask a Doubt
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

          <label className="flex items-center gap-2 p-3 bg-light text-text rounded border border-dark/20 cursor-pointer hover:bg-light/90 transition-colors">
            <FaImage /> {image ? image.name : "Attach an image (optional)"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-primary text-text py-3 rounded hover:bg-primary/80 transition-colors shadow-md disabled:opacity-50"
          >
            <FaPaperPlane /> {loading ? "Posting..." : "Post Doubt"}
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
}

export default AskDoubt;