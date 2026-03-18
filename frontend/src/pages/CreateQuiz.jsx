import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate quiz data
    if (!title.trim()) {
      setError("Quiz title is required");
      setLoading(false);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} is required`);
        setLoading(false);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        setError(`All options for question ${i + 1} are required`);
        setLoading(false);
        return;
      }
      if (!q.correctAnswer.trim()) {
        setError(`Correct answer for question ${i + 1} is required`);
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      await API.post("/quizzes", { title, questions }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate("/quiz");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
      console.error("Error creating quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-text">
          Create New Quiz
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <label className="block text-dark font-semibold mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70"
              placeholder="Enter quiz title"
              required
            />
          </div>

          {questions.map((q, questionIndex) => (
            <div key={questionIndex} className="bg-secondary p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-dark">
                  Question {questionIndex + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                  className="w-full p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70"
                  placeholder="Enter question"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                      className="p-3 bg-light text-text rounded border border-dark/20 placeholder-text/70"
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                  ))}
                </div>

                <select
                  value={q.correctAnswer}
                  onChange={(e) => updateQuestion(questionIndex, "correctAnswer", e.target.value)}
                  className="w-full p-3 bg-light text-text rounded border border-dark/20"
                  required
                >
                  <option value="">Select correct answer</option>
                  {q.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      Option {optionIndex + 1}: {option || `Option ${optionIndex + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={addQuestion}
              className="bg-secondary text-dark px-6 py-3 rounded hover:bg-secondary/80 transition-colors"
            >
              Add Question
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-text px-6 py-3 rounded hover:bg-primary/80 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Creating Quiz..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateQuiz;
