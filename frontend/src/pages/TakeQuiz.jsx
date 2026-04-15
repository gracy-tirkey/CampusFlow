import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

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
    const loadQuiz = async () => {
      try {
        const response = await API.get(`/quizzes/${id}`);
        // Handle both response formats
        const quizData = response.data?.data || response.data;
        setQuiz(quizData);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) correctAnswers++;
    });
    const finalScore = Math.round(
      (correctAnswers / quiz.questions.length) * 100,
    );

    try {
      await API.post("/quizzes/submit", { quizId: id, score: finalScore });
      setScore(finalScore);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-text">
          Loading quiz...
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
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-text">
            Quiz Completed!
          </h1>
          <div className="bg-secondary p-6 md:p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-text mb-4">
              Your Score
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-text mb-4">
              {score}%
            </p>
            <p className="text-text text-sm md:text-base mb-6">
              You got{" "}
              {
                Object.values(answers).filter(
                  (answer, index) =>
                    answer === quiz.questions[index].correctAnswer,
                ).length
              }{" "}
              out of {quiz.questions.length} questions correct.
            </p>
            <button
              onClick={() => navigate("/quiz")}
              className="flex items-center justify-center gap-2 bg-primary text-text px-4 md:px-6 py-2 md:py-3 rounded hover:bg-primary/80 transition-colors"
            >
              <FaArrowLeft /> Back to Quizzes
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-text">
          {quiz.title}
        </h1>

        <div className="bg-secondary p-4 md:p-6 rounded-lg shadow-md">
          <div className="mb-3 text-sm text-text/70">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>

          <h2 className="text-lg md:text-xl font-semibold mb-4 text-dark">
            {question.question}
          </h2>

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
            className="flex items-center gap-2 bg-secondary text-dark px-3 py-2 rounded hover:bg-secondary/80 disabled:opacity-50 transition-colors"
          >
            <FaArrowLeft /> Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || !answers[currentQuestion]}
              className="flex items-center gap-2 bg-primary text-text px-3 py-2 rounded hover:bg-primary/80 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  Submit Quiz <FaCheck />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!answers[currentQuestion]}
              className="flex items-center gap-2 bg-primary text-text px-3 py-2 rounded hover:bg-primary/80 disabled:opacity-50 transition-colors"
            >
              Next <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TakeQuiz;
