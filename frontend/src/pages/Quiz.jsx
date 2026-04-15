import DashboardLayout from "../layouts/DashboardLayout";
import QuizCard from "../components/QuizCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa";

function Quiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await API.get("/quizzes");
      // Handle both response formats: wrapped {data} and direct array
      const quizzesData = response.data?.data || response.data || [];
      setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
    } catch (err) {
      setError("Failed to load quizzes");
      console.error("Error fetching quizzes:", err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-text">
          Loading quizzes...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 p-4">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-text">Quizzes</h1>

        {/* Create Quiz Button for teachers */}
        {user && user.role === "teacher" && (
          <Link to="/create-quiz">
            <button className="flex items-center gap-2 bg-primary text-text px-4 md:px-6 py-2 md:py-3 rounded shadow-md hover:bg-primary/80 transition-colors text-sm md:text-base">
              <FaPlus /> Create Quiz
            </button>
          </Link>
        )}
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <div className="text-center text-text/70 py-8">
          No quizzes available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <QuizCard key={quiz._id || index} quiz={quiz} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Quiz;
