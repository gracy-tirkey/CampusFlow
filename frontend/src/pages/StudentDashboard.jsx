import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notesDownloaded: 0,
    doubtsAsked: 0,
    quizPoints: 0
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuizzes, setShowQuizzes] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await API.get("/dashboard/quizzes");
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleViewQuizzes = () => {
    if (!showQuizzes) {
      fetchQuizzes();
    }
    setShowQuizzes(!showQuizzes);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text">
          Welcome, {user?.name || "Student"}!
        </h1>
        <div className="flex gap-4">
          <Link to="/edit-profile">
            <button className="bg-secondary text-text px-4 py-2 rounded hover:bg-secondary/80 transition-colors">
              ✏️ Edit Profile
            </button>
          </Link>
          <button
            onClick={handleViewQuizzes}
            className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors"
          >
            {showQuizzes ? "Hide Quizzes" : "📊 View Quizzes"}
          </button>
        </div>
      </div>

      {showQuizzes && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-text">My Quiz Attempts</h2>
          {quizzes.length === 0 ? (
            <>
              <p className="text-text/70">No quizzes attempted yet.</p>
              <Link to="/quizzes">
                <button className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors">Take a Quiz</button>
              </Link>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((result) => (
                <div key={result._id} className="bg-secondary p-4 rounded-lg shadow-md">
              <    h3 className="font-semibold text-dark">{result.quizId?.title || "Deleted Quiz"}</h3>
                  <p className="text-primary font-bold">Score: {result.score}%</p>
                  <p className="text-xs text-text/60">
                    Attempted on: {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-secondary p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors">
          <h3 className="text-lg font-semibold text-dark mb-2">Notes Downloaded</h3>
          <p className="text-2xl font-bold text-primary">{stats.notesDownloaded}</p>
          <p className="text-text">Track your downloaded notes</p>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors">
          <h3 className="text-lg font-semibold text-dark mb-2">Doubts Asked</h3>
          <p className="text-2xl font-bold text-primary">{stats.doubtsAsked}</p>
          <p className="text-text">View your doubt history</p>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors">
          <h3 className="text-lg font-semibold text-dark mb-2">Quiz Points</h3>
          <p className="text-2xl font-bold text-primary">{stats.quizPoints}</p>
          <p className="text-text">Check your quiz performance</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
