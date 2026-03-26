import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUniversity, 
  FaGraduationCap, 
  FaBook, 
  FaAlignLeft, 
  FaLock 
} from "react-icons/fa";

export default function EditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    grade: "",
    subjects: [],
    institution: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        bio: user.bio || "",
        grade: user.grade || "",
        subjects: user.subjects || [],
        institution: user.institution || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.put("/auth/update", formData);
      login(response.data.user, localStorage.getItem('token'));
      navigate(-1);
    } catch (error) {
      setError(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!user) return <div>Please login first</div>;

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-8">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-2xl relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-text hover:text-red-500 transition-colors text-2xl"
          title="Cancel"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-primary text-center">Edit Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaUser className="text-primary" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-3 bg-light text-text rounded border border-dark/20"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope className="text-primary" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 bg-light text-text rounded border border-dark/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaPhone className="text-primary" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-3 bg-light text-text rounded border border-dark/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <FaUniversity className="text-primary" />
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="Institution"
                className="w-full p-3 bg-light text-text rounded border border-dark/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-primary" />
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-3 bg-light text-text rounded border border-dark/20"
            >
              <option value="">Select Grade/Class</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-text mb-2">Subjects of Interest:</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "History", "Geography", "Economics", "Other"].map(subject => (
                <label key={subject} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                    className="rounded"
                  />
                  <span className="text-sm">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaAlignLeft className="text-primary" />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="w-full p-3 bg-light text-text rounded border border-dark/20 resize-none h-24"
              maxLength="500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>

          <div className="flex items-center gap-2">
            <FaLock className="text-primary" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password (leave blank to keep current)"
              className="w-full p-3 bg-light text-text rounded border border-dark/20"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-secondary text-text py-3 rounded hover:bg-primary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-text py-3 rounded hover:bg-primary/80 transition-colors"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}