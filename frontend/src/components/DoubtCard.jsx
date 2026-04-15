import { useState, useRef } from "react";
import API from "../api/axios";
import { getRandomColor } from "../utils/colorPalette";
import { getFileType, buildFileUrl, downloadFile } from "../utils/fileUtils";
import ExpandableText from "./ExpandableText";
import {
  FaCommentDots,
  FaUser,
  FaChevronDown,
  FaChevronRight,
  FaPaperPlane,
  FaDownload,
  FaFilePdf,
  FaImage,
  FaFile,
  FaTimes,
  FaCamera,
} from "react-icons/fa";

function DoubtCard({ doubt, onUpdate, index = 0 }) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answerImage, setAnswerImage] = useState(null);
  const [answerImagePreview, setAnswerImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const fileInputRef = useRef(null);
  const backgroundColor = getRandomColor(index);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnswerImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAnswerImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setAnswerImage(null);
    setAnswerImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("text", answer);
      if (answerImage) {
        formData.append("image", answerImage);
      }

      const res = await API.post(`/doubts/${doubt._id}/answer`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdate(doubt._id, res.data.answer);

      setAnswer("");
      setAnswerImage(null);
      setAnswerImagePreview(null);
      setShowAnswerForm(false);
      setShowAnswers(true);
    } catch (err) {
      console.error("❌ Answer error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderMediaPreview = (mediaUrl, type = "small") => {
    if (!mediaUrl) return null;

    const fileType = getFileType(mediaUrl);
    const fullUrl = buildFileUrl(mediaUrl);

    const previewClasses = type === "small" ? "h-24 max-w-xs" : "h-32 max-w-md";

    const handleDownloadMedia = (e) => {
      e.stopPropagation();
      downloadFile(mediaUrl, `media_${Date.now()}`);
    };

    if (fileType === "image") {
      return (
        <div
          className={`${previewClasses} rounded-lg overflow-hidden border border-white/10 relative group`}
        >
          <img
            src={fullUrl}
            alt="Media"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <button
            onClick={handleDownloadMedia}
            className="absolute top-1 right-1 bg-black/60 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Download"
          >
            <FaDownload size={12} className="text-white" />
          </button>
        </div>
      );
    }

    if (fileType === "pdf") {
      return (
        <div
          className={`${previewClasses} rounded-lg border border-white/10 bg-black/20 flex flex-col items-center justify-center relative group`}
        >
          <FaFilePdf size={32} className="text-white/60" />
          <p className="text-xs text-white/60 mt-1">PDF</p>
          <button
            onClick={handleDownloadMedia}
            className="absolute top-1 right-1 bg-black/60 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Download"
          >
            <FaDownload size={12} className="text-white" />
          </button>
        </div>
      );
    }

    return (
      <div
        className={`${previewClasses} rounded-lg border border-white/10 bg-black/20 flex flex-col items-center justify-center relative group`}
      >
        <FaFile size={28} className="text-white/60" />
        <p className="text-xs text-white/60 mt-1">File</p>
        <button
          onClick={handleDownloadMedia}
          className="absolute top-1 right-1 bg-black/60 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Download"
        >
          <FaDownload size={12} className="text-white" />
        </button>
      </div>
    );
  };

  return (
    <div
      className="backdrop-blur-lg border border-white/10 p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col gap-3"
      style={{ backgroundColor }}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
          {(doubt.askedBy?.name || "U")[0].toUpperCase()}
        </div>

        <div className="text-xs">
          <p className="font-medium">{doubt.askedBy?.name || "Anonymous"}</p>
          <p className="opacity-60">{doubt.askedBy?.role || "student"}</p>
        </div>
      </div>

      {/* QUESTION */}
      <div className="mb-2">
        <ExpandableText
          text={doubt.question}
          maxChars={100}
          preserveLineBreaks={true}
          className="text-sm font-semibold"
        />
      </div>

      {/* DOUBT IMAGE PREVIEW */}
      {doubt.image && renderMediaPreview(doubt.image, "small")}

      {/* ACTION ROW */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
        >
          {showAnswers ? <FaChevronDown /> : <FaChevronRight />}
          {doubt.answers?.length || 0}
        </button>

        <button
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded-md hover:bg-blue-500"
        >
          <FaCommentDots size={12} />
          Answer
        </button>
      </div>

      {/* ANSWER FORM */}
      {showAnswerForm && (
        <form
          onSubmit={handleSubmitAnswer}
          className="flex flex-col gap-2 bg-black/30 p-2 rounded-lg"
        >
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write answer..."
            className="text-xs p-2 rounded-md bg-white/5 border border-white/10 resize-none outline-none focus:ring-1 focus:ring-blue-500"
            rows="2"
          />

          {/* Image Preview */}
          {answerImagePreview && (
            <div className="relative w-full h-24 rounded-md overflow-hidden border border-white/10">
              <img
                src={answerImagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={clearImagePreview}
                className="absolute top-1 right-1 bg-red-600 p-1 rounded text-xs text-white hover:bg-red-700"
              >
                <FaTimes size={10} />
              </button>
            </div>
          )}

          {/* Image Upload Button */}
          <div className="flex gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1 bg-slate-600 py-1.5 rounded-md text-xs hover:bg-slate-500 text-white"
            >
              <FaCamera size={12} />
              Add Image
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-1 bg-green-600 py-1.5 rounded-md text-xs hover:bg-green-500 disabled:opacity-50 text-white"
            >
              <FaPaperPlane size={12} />
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {/* ANSWERS */}
      {showAnswers && (
        <div className="space-y-2">
          {doubt.answers?.length === 0 && (
            <p className="text-xs opacity-60 text-center">No answers yet</p>
          )}

          {doubt.answers?.map((ans, index) => (
            <div
              key={index}
              className="bg-black/30 p-2 rounded-lg border border-white/5 space-y-2"
            >
              <div className="text-xs">
                <ExpandableText
                  text={ans.text}
                  maxChars={100}
                  preserveLineBreaks={true}
                />
              </div>

              {/* ANSWER IMAGE PREVIEW */}
              {ans.image && renderMediaPreview(ans.image, "small")}

              <div className="flex items-center gap-1 text-[10px] opacity-70">
                <FaUser className="text-blue-400" />
                {ans.answeredBy?.name || "Anonymous"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoubtCard;
