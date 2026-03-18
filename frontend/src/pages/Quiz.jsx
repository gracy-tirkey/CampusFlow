import DashboardLayout from "../layouts/DashboardLayout";
import QuizCard from "../components/QuizCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

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
      setQuizzes(response.data);
    } catch (err) {
      setError("Failed to load quizzes");
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-text">Loading quizzes...</div>
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

        <h1 className="text-3xl font-bold text-light">
          Quizzes
        </h1>

        {user && user.role === "teacher" && (
          <Link to="/create-quiz">
            <button className="bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors shadow-md">
              ➕ Create Quiz
            </button>
          </Link>
        )}

      </div>

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
