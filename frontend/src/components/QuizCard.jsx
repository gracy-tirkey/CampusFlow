import { Link } from "react-router-dom";

function QuizCard({ quiz }) {

  return (
    <div className="bg-secondary p-5 rounded-lg hover:bg-secondary/80 transition-colors shadow-md hover:shadow-lg">

      <h2 className="text-xl font-semibold mb-2 text-text">
        {quiz.title}
      </h2>

      <p className="text-text/80">
        Questions: {quiz.questions?.length || 0}
      </p>

      <p className="text-text/80 mb-3">
        Created by: {quiz.createdBy?.name || "Unknown"}
      </p>

      <Link to={`/take-quiz/${quiz._id}`}>
        <button className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 transition-colors">
          ▶️ Start Quiz
        </button>
      </Link>

    </div>
  );
}

export default QuizCard;
