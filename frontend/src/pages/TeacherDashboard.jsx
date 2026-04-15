import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FaUpload, FaCheckCircle, FaClipboardList } from "react-icons/fa";

function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notesUploaded: 0,
    doubtsSolved: 0,
    quizzesCreated: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/dashboard/stats");
        // Handle both response formats: wrapped {data} and direct object
        const statsData = response.data?.data || response.data || {};
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Set default stats on error
        setStats({
          notesUploaded: 0,
          doubtsSolved: 0,
          quizzesCreated: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-text">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-text">
        Welcome, {user?.name || "Teacher"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Notes Uploaded */}
        <div className="bg-secondary p-4 md:p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-primary">
            <FaUpload />{" "}
            <h3 className="text-lg font-semibold text-dark">Notes Uploaded</h3>
          </div>
          <p className="text-2xl font-bold text-primary">
            {stats.notesUploaded}
          </p>
          <p className="text-text text-sm">Manage your uploaded notes</p>
        </div>

        {/* Doubts Solved */}
        <div className="bg-secondary p-4 md:p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-primary">
            <FaCheckCircle />{" "}
            <h3 className="text-lg font-semibold text-dark">Doubts Solved</h3>
          </div>
          <p className="text-2xl font-bold text-primary">
            {stats.doubtsSolved}
          </p>
          <p className="text-text text-sm">View doubts you've answered</p>
        </div>

        {/* Quizzes Created */}
        <div className="bg-secondary p-4 md:p-6 rounded-lg shadow-md hover:bg-secondary/80 transition-colors flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-primary">
            <FaClipboardList />{" "}
            <h3 className="text-lg font-semibold text-dark">Quizzes Created</h3>
          </div>
          <p className="text-2xl font-bold text-primary">
            {stats.quizzesCreated}
          </p>
          <p className="text-text text-sm">Manage your created quizzes</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TeacherDashboard;
