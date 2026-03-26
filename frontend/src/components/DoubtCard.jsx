import { useState } from "react";
import API from "../api/axios";
import { FaCommentDots, FaUser, FaChevronDown, FaChevronRight } from "react-icons/fa";

function DoubtCard({ doubt }) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await API.post(`/doubts/${doubt._id}/answer`, { text: answer }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAnswer("");
      setShowAnswerForm(false);
      window.location.reload(); // Refresh doubts list
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary p-5 rounded-lg hover:bg-secondary/80 transition-colors shadow-md hover:shadow-lg flex flex-col">

      {/* Question */}
      <h2 className="text-xl font-semibold mb-3 text-text flex items-center gap-2">
        <FaCommentDots className="text-primary" />
        {doubt.question}
      </h2>

      {/* Image */}
      {doubt.image && (
        <img
          src={`http://localhost:5001/${doubt.image}`}
          alt="Doubt"
          className="max-w-full h-48 object-cover rounded mb-3"
        />
      )}

      {/* Asked By */}
      <p className="text-text/80 mb-3 flex items-center gap-2">
        <FaUser className="text-primary" />
        Asked by: {doubt.askedBy?.name || "Unknown"} ({doubt.askedBy?.role || "student"})
      </p>

      {/* Answers */}
      {doubt.answers && doubt.answers.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="flex items-center gap-2 text-primary font-medium mb-2 hover:text-primary/80 transition"
          >
            {showAnswers ? <FaChevronDown /> : <FaChevronRight />}
            {showAnswers ? "Hide Answers" : "Show Answers"} ({doubt.answers.length})
          </button>
          {showAnswers && (
            <div className="space-y-2">
              {doubt.answers.map((ans, index) => (
                <div key={index} className="bg-light p-3 rounded">
                  <p className="text-text">{ans.text}</p>
                  <p className="text-xs text-text/60 mt-1 flex items-center gap-1">
                    <FaUser className="text-primary" /> 
                    By: {ans.answeredBy?.name || "Unknown"} ({ans.answeredBy?.role || "teacher"})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Answer Button */}
      <button
        onClick={() => setShowAnswerForm(!showAnswerForm)}
        className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors mb-2 flex items-center gap-2"
      >
        <FaCommentDots />
        {showAnswerForm ? "Cancel" : "Answer"}
      </button>

      {/* Answer Form */}
      {showAnswerForm && (
        <form onSubmit={handleSubmitAnswer} className="mt-2 flex flex-col gap-2">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer..."
            className="w-full p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70 resize-none"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>
        </form>
      )}

    </div>
  );
}

export default DoubtCard;