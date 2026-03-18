import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/edit-profile" element={<EditProfile/>}/>

        <Route path="/student/dashboard" element={<StudentDashboard/>}/>
        <Route path="/teacher/dashboard" element={<TeacherDashboard/>}/>

        <Route path="/notes" element={<Notes />} />
        <Route path="/upload-notes" element={<UploadNotes />} />

        <Route path="/doubts" element={<Doubts />} />
        <Route path="/ask-doubt" element={<AskDoubt />} />

        <Route path="/chat" element={<Chat />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/take-quiz/:id" element={<TakeQuiz />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
