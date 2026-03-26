import { Link } from "react-router-dom";
import { FaPlay, FaQuestionCircle, FaUser } from "react-icons/fa";

function QuizCard({ quiz }) {
  return (
    <div className="bg-secondary p-5 rounded-lg hover:bg-secondary/80 transition-colors shadow-md hover:shadow-lg flex flex-col justify-between">

      {/* Quiz Title */}
      <h2 className="text-xl font-semibold mb-3 text-text flex items-center gap-2">
        <FaQuestionCircle className="text-primary" />
        {quiz.title}
      </h2>

      {/* Quiz Metadata */}
      <div className="mb-4 space-y-1 text-text/80">
        <p className="flex items-center gap-2">
          <FaPlay className="text-primary" /> Questions: {quiz.questions?.length || 0}
        </p>
        <p className="flex items-center gap-2">
          <FaUser className="text-primary" /> Created by: {quiz.createdBy?.name || "Unknown"}
        </p>
      </div>

      {/* Start Quiz Button */}
      <Link to={`/take-quiz/${quiz._id}`}>
        <button className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors shadow-sm hover:shadow-md flex items-center gap-2">
          <FaPlay /> Start Quiz
        </button>
      </Link>

    </div>
  );
}

export default QuizCard;