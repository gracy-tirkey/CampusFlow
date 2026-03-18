import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notesUploaded: 0,
    doubtsSolved: 0,
    quizzesCreated: 0
  });
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-text">
        Welcome, {user?.name || "Teacher"}!
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-secondary p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors">
          <h3 className="text-lg font-semibold text-dark mb-2">Notes Uploaded</h3>
          <p className="text-2xl font-bold text-primary">{stats.notesUploaded}</p>
          <p className="text-text">Manage your uploaded notes</p>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors">
          <h3 className="text-lg font-semibold text-dark mb-2">Doubts Solved</h3>
          <p className="text-2xl font-bold text-primary">{stats.doubtsSolved}</p>
          <p className="text-text">View doubts you've answered</p>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors">
          <h3 className="text-lg font-semibold text-dark mb-2">Quiz Created</h3>
          <p className="text-2xl font-bold text-primary">{stats.quizzesCreated}</p>
          <p className="text-text">Manage your created quizzes</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TeacherDashboard;
