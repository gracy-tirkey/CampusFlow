import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import Notes from "../pages/Notes";
import UploadNotes from "../pages/UploadNotes";
import Doubts from "../pages/Doubts";
import AskDoubt from "../pages/AskDoubt";
import Chat from "../pages/Chat";
import Quiz from "../pages/Quiz";
import CreateQuiz from "../pages/CreateQuiz";
import EditProfile from "../pages/EditProfile";
import TakeQuiz from "../pages/TakeQuiz";
import AIStudyAssistant from "../pages/AIStudyAssistant";
import AIChat from "../pages/AIChat";
import MentorConnect from "../pages/MentorConnect";
import CareerHub from "../pages/CareerHub";
import CampusFeed from "../pages/CampusFeed";
import AccountSettings from "../pages/AccountSettings";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <HashRouter>
        <div className="flex items-center justify-center h-screen bg-dark">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-text">Loading...</p>
          </div>
        </div>
      </HashRouter>
    );
  }

  const DashboardRedirect = () => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return user.role === "teacher" ? (
      <Navigate to="/teacher/dashboard" replace />
    ) : (
      <Navigate to="/student/dashboard" replace />
    );
  };

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route
          path="/account-settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-notes"
          element={
            <ProtectedRoute>
              <UploadNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doubts"
          element={
            <ProtectedRoute>
              <Doubts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ask-doubt"
          element={
            <ProtectedRoute>
              <AskDoubt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/take-quiz/:id"
          element={
            <ProtectedRoute>
              <TakeQuiz />
            </ProtectedRoute>
          }
        />

        {/* Phase 2 Feature Routes - Protected */}
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIStudyAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentors"
          element={
            <ProtectedRoute>
              <MentorConnect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/career"
          element={
            <ProtectedRoute>
              <CareerHub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CampusFeed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
