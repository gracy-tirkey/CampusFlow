import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";
import {
  FaUpload,
  FaFileAlt,
  FaBook,
  FaAlignLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { showSuccess, showError } from "../utils/toast";

export default function UploadNotes() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ✅ File validation function
  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      showError("Please select a file");
      return false;
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (selectedFile.size > maxSize) {
      showError("File size must be less than 15MB");
      return false;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      showError("Only PDF, JPG, PNG, and GIF files are allowed");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("");
      e.target.value = ""; // Reset input
    }
  };

  // ✅ Form validation before upload
  const validateForm = () => {
    if (!title.trim()) {
      showError("Please enter a title");
      return false;
    }

    if (!subject.trim()) {
      showError("Please select a subject");
      return false;
    }

    if (!file) {
      showError("Please upload a file");
      return false;
    }

    if (title.trim().length < 3) {
      showError("Title must be at least 3 characters");
      return false;
    }

    return true;
  };

  const uploadNote = async (e) => {
    e.preventDefault();

    // ✅ Validate before upload
    if (!validateForm()) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("subject", subject.trim());
    formData.append("file", file);

    try {
      // ✅ API already includes auth token via interceptor
      const response = await API.post("/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        // ✅ Success feedback
        setUploadSuccess(true);
        showSuccess("Note uploaded successfully!");

        // Reset form
        setTitle("");
        setDescription("");
        setSubject("");
        setFile(null);
        setFileName("");

        navigate("/notes"); // Redirect to notes library

        // Show success message for 3 seconds then reset
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      }
    } catch (err) {
      // ✅ Comprehensive error handling
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload note. Please try again.";

      console.error("Upload error:", err);
      showError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-text p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">
              Upload Notes
            </h1>
            <p className="text-muted">
              Share your study materials with the community
            </p>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
              <FaCheckCircle className="text-green-600 text-xl" />
              <div>
                <p className="font-semibold text-green-800">
                  Upload Successful!
                </p>
                <p className="text-sm text-green-700">
                  Your note has been added to the library.
                </p>
              </div>
            </div>
          )}

          {/* Upload Form */}
          <form
            onSubmit={uploadNote}
            className="bg-light border border-secondary/20 rounded-xl p-6 md:p-8 shadow-soft"
          >
            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaFileAlt className="text-primary" size={16} />
                  Note Title
                </div>
              </label>
              <input
                type="text"
                placeholder="e.g., Chapter 5 - Electromagnetism"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-text placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                required
              />
            </div>

            {/* Subject Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaBook className="text-primary" size={16} />
                  Subject
                </div>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                required
              >
                <option value="">Select a subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaAlignLeft className="text-primary" size={16} />
                  Description (Optional)
                </div>
              </label>
              <textarea
                placeholder="Add details about these notes (topics covered, difficulty level, etc.)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-lg text-text placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-none"
              />
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-dark mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaUpload className="text-primary" size={16} />
                  Upload File
                </div>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-background border border-secondary/30 border-dashed rounded-lg text-text cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80 transition-all duration-200"
                  required
                />
              </div>
              {fileName && (
                <p className="mt-2 text-sm text-primary font-medium">
                  📎 Selected: {fileName}
                </p>
              )}
              <p className="mt-2 text-xs text-muted">
                Supported formats: PDF, JPG, PNG, GIF (Max 15MB)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-dark font-bold rounded-lg hover:shadow-elevated transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaUpload size={18} />
              {uploading ? "Uploading..." : "Upload Note"}
            </button>
          </form>

          {/* File Format Help */}
          <div className="mt-8 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <h3 className="font-semibold text-dark mb-2">💡 Tips:</h3>
            <ul className="text-sm text-muted space-y-1">
              <li>• Use a clear, descriptive title for easy searching</li>
              <li>
                • Provide a brief description to help others understand the
                content
              </li>
              <li>
                • Convert images of your notes to PDF for better compatibility
              </li>
              <li>• Ensure your file is not corrupted before uploading</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
