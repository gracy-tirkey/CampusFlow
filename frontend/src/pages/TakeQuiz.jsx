import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await API.get(`/quizzes/${id}`);
      setQuiz(response.data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);

    try {
      await API.post("/quizzes/submit", {
        quizId: id,
        score: finalScore
      });
      setScore(finalScore);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div>Loading quiz...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600">Quiz not found</div>
      </DashboardLayout>
    );
  }

  if (score !== null) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6 text-dark">Quiz Completed!</h1>
          <div className="bg-secondary p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">Your Score</h2>
            <p className="text-4xl font-bold text-dark mb-4">{score}%</p>
            <p className="text-text mb-6">
              You got {Object.values(answers).filter((answer, index) =>
                answer === quiz.questions[index].correctAnswer
              ).length} out of {quiz.questions.length} questions correct.
            </p>
            <button
              onClick={() => navigate("/quiz")}
              className="bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-dark">{quiz.title}</h1>

        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <span className="text-sm text-text/70">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-dark">{question.question}</h2>

          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswerChange(currentQuestion, option)}
                  className="text-primary"
                />
                <span className="text-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="bg-secondary text-dark px-4 py-2 rounded hover:bg-secondary/80 disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || !answers[currentQuestion]}
              className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion]}
              className="bg-primary text-text px-4 py-2 rounded hover:bg-primary/80 disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TakeQuiz;
