import DashboardLayout from "../layouts/DashboardLayout";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { io } from "socket.io-client";
import { getRandomColor } from "../utils/colorPalette";
import ShareModal from "../components/ShareModal";

import {
  FaQuestionCircle,
  FaArrowUp,
  FaArrowDown,
  FaReply,
  FaThumbtack,
  FaShareAlt,
} from "react-icons/fa";

const socket = io("http://localhost:6090");

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
};

export default function Doubts() {
  const [doubts, setDoubts] = useState([]);
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState({});
  const [replyBox, setReplyBox] = useState({});
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareModal, setShareModal] = useState({ isOpen: false, doubt: null });
  const [shareSuccess, setShareSuccess] = useState("");

  const fetchDoubts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/doubts?page=1&search=${encodeURIComponent(search)}`,
      );
      // Handle both response formats: wrapped {data} and direct object with {data}
      const doubtsData = res.data?.data || res.data || [];
      setDoubts(Array.isArray(doubtsData) ? doubtsData : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load doubts.");
      setDoubts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchDoubts();
  }, [fetchDoubts]);

  useEffect(() => {
    if (shareSuccess) {
      const timer = setTimeout(() => setShareSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [shareSuccess]);

  useEffect(() => {
    socket.on("new_answer", ({ doubtId, answer }) => {
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === doubtId
            ? { ...d, answers: [...(d.answers || []), answer] }
            : d,
        ),
      );
    });

    socket.on("new_reply", ({ doubtId, answerId, reply }) => {
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === doubtId
            ? {
                ...d,
                answers: d.answers.map((a) =>
                  a._id === answerId
                    ? { ...a, replies: [...(a.replies || []), reply] }
                    : a,
                ),
              }
            : d,
        ),
      );
    });

    return () => {
      socket.off("new_answer");
      socket.off("new_reply");
    };
  }, []);

  const voteDoubt = async (id, value) => {
    try {
      const res = await API.post(`/doubts/${id}/vote`, { value });
      setDoubts((prev) =>
        prev.map((d) => (d._id === id ? { ...d, votes: res.data.votes } : d)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const voteAnswer = async (dId, aId, value) => {
    try {
      const res = await API.post(`/doubts/${dId}/answers/${aId}/vote`, {
        value,
      });
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === dId
            ? {
                ...d,
                answers: d.answers.map((a) =>
                  a._id === aId ? { ...a, votes: res.data.votes } : a,
                ),
              }
            : d,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const submitAnswer = async (id) => {
    const answerText = answers[id]?.trim();
    if (!answerText) return;

    try {
      const res = await API.post(`/doubts/${id}/answer`, {
        text: answerText,
      });

      setAnswers((prev) => ({ ...prev, [id]: "" }));
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === id
            ? {
                ...d,
                answers: [...(d.answers || []), res.data.answer],
              }
            : d,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const reply = async (dId, aId) => {
    const replyValue = replyText[aId]?.trim();
    if (!replyValue) return;

    try {
      const res = await API.post(`/doubts/${dId}/answers/${aId}/reply`, {
        text: replyValue,
      });

      setReplyText((prev) => ({ ...prev, [aId]: "" }));
      setReplyBox((prev) => ({ ...prev, [aId]: false }));
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === dId
            ? {
                ...d,
                answers: d.answers.map((a) =>
                  a._id === aId
                    ? {
                        ...a,
                        replies: [...(a.replies || []), res.data.reply],
                      }
                    : a,
                ),
              }
            : d,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareClick = (doubt) => {
    setShareModal({ isOpen: true, doubt });
  };

  const handleShareComplete = () => {
    setShareSuccess("✓ Doubt shared successfully!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Doubt Hub</h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse questions, vote answers, and reply in real time.
            </p>
          </div>

          <Link to="/ask-doubt">
            <button className="bg-blue-600 px-4 py-2 rounded flex gap-2 items-center">
              <FaQuestionCircle /> Ask
            </button>
          </Link>
        </div>

        <div className="relative mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pr-12 rounded bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none"
            placeholder="Search doubts..."
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            🔎
          </span>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-400 p-4 text-red-100">
            {error}
          </div>
        )}

        {shareSuccess && (
          <div className="mb-6 rounded-lg bg-green-500/10 border border-green-400 p-4 text-green-100">
            {shareSuccess}
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-28 rounded-2xl bg-slate-900" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {doubts.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6 text-center text-slate-400">
                No doubts found.
              </div>
            ) : (
              doubts.map((d, index) => {
                const pinnedAnswer = d.pinnedAnswer
                  ? d.answers?.find((ans) => ans._id === d.pinnedAnswer)
                  : null;

                return (
                  <div
                    key={d._id}
                    className="rounded-xl border border-slate-800 p-4 shadow-md"
                    style={{ backgroundColor: getRandomColor(index) }}
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h2 className="text-sm font-semibold">{d.question}</h2>
                        <p className="text-xs text-slate-500">
                          {d.answers?.length ?? 0} answers • {d.votes} votes
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <button
                          onClick={() => voteDoubt(d._id, 1)}
                          className="p-1 border border-slate-700 rounded hover:bg-slate-800"
                        >
                          <FaArrowUp />
                        </button>
                        <span>{d.votes}</span>
                        <button
                          onClick={() => voteDoubt(d._id, -1)}
                          className="p-1 border border-slate-700 rounded hover:bg-slate-800"
                        >
                          <FaArrowDown />
                        </button>
                        <button
                          onClick={() => handleShareClick(d)}
                          className="p-1 border border-slate-700 rounded hover:bg-slate-800 ml-2 text-blue-400"
                          title="Share doubt"
                        >
                          <FaShareAlt size={12} />
                        </button>
                      </div>
                    </div>

                    {/* ANSWER INPUT */}
                    <div className="flex gap-2 mb-4">
                      <input
                        value={answers[d._id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [d._id]: e.target.value,
                          }))
                        }
                        className="flex-1 text-xs rounded-lg border border-slate-800 bg-slate-900/80 p-2"
                        placeholder="Write answer..."
                      />
                      <button
                        onClick={() => submitAnswer(d._id)}
                        className="text-xs bg-emerald-500 px-3 py-2 rounded-lg hover:bg-emerald-400"
                      >
                        Post
                      </button>
                    </div>

                    {/* PINNED */}
                    {pinnedAnswer && (
                      <div className="mb-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                        📌 {pinnedAnswer.text}
                      </div>
                    )}

                    {/* ANSWERS */}
                    <div className="space-y-2">
                      {d.answers?.map((a) => (
                        <div
                          key={a._id}
                          className="p-3 rounded-lg bg-slate-900/80 border border-slate-800"
                        >
                          <p className="text-xs">{a.text}</p>

                          <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                            <span>{timeAgo(a.createdAt)}</span>

                            <div className="flex gap-1">
                              <button
                                onClick={() => voteAnswer(d._id, a._id, 1)}
                                className="p-1 border border-slate-700 rounded"
                              >
                                <FaArrowUp />
                              </button>
                              <span>{a.votes || 0}</span>
                              <button
                                onClick={() => voteAnswer(d._id, a._id, -1)}
                                className="p-1 border border-slate-700 rounded"
                              >
                                <FaArrowDown />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, doubt: null })}
        itemType="doubt"
        itemId={shareModal.doubt?._id}
        itemTitle={shareModal.doubt?.question}
        onShareComplete={handleShareComplete}
      />
    </DashboardLayout>
  );
}
