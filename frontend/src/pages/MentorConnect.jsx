import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaBriefcase,
  FaStar,
  FaLink,
  FaGithub,
  FaLinkedinIn,
  FaPlus,
} from "react-icons/fa";
import { ModernCard, ActionCard } from "../components/Card";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

export default function MentorConnect() {
  const [mentors, setMentors] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showBecomeMentor, setShowBecomeMentor] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    company: "",
    role: "",
    experience: 0,
    bio: "",
    expertise: [],
    availability: 5,
    linkedin: "",
    github: "",
  });

  const expertiseOptions = [
    "DSA",
    "System Design",
    "React",
    "Backend",
    "DevOps",
    "Data Science",
    "Mobile Dev",
  ];

  useEffect(() => {
    fetchMentors();
  }, [filter]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await API.get("/mentors/all");
      const mentorsData = response.data?.data || response.data || [];
      setMentors(Array.isArray(mentorsData) ? mentorsData : []);

      const alumniResponse = await API.get("/mentors/alumni");
      const alumniData = alumniResponse.data?.data || alumniResponse.data || [];
      setAlumni(Array.isArray(alumniData) ? alumniData : []);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setMentors([]);
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeMentor = async () => {
    try {
      await API.post("/mentors/become-mentor", mentorForm);
      setShowBecomeMentor(false);
      fetchMentors();
      alert("Mentor profile created successfully!");
    } catch {
      alert("Error creating mentor profile");
    }
  };

  const toggleExpertise = (skill) => {
    setMentorForm({
      ...mentorForm,
      expertise: mentorForm.expertise.includes(skill)
        ? mentorForm.expertise.filter((s) => s !== skill)
        : [...mentorForm.expertise, skill],
    });
  };

  const MentorCard = ({ mentor }) => (
    <ModernCard elevation className="flex flex-col h-full">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white flex-shrink-0">
          <FaUser className="text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-dark">
            {mentor.userId?.name || "Anonymous"}
          </h3>
          <p className="text-sm text-primary font-semibold">
            {mentor.mentorDetails?.role}
          </p>
          <p className="text-xs text-muted">{mentor.mentorDetails?.company}</p>
        </div>
      </div>

      <p className="text-sm text-muted mb-3 flex-1">
        {mentor.mentorDetails?.bio}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-xs ${
              i < Math.round(mentor.ratings?.average || 0)
                ? "text-orange-500"
                : "text-secondary/30"
            }`}
          />
        ))}
        <span className="text-xs text-muted">
          ({mentor.ratings?.count || 0})
        </span>
      </div>

      {/* Expertise Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {mentor.mentorDetails?.expertise?.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex gap-2 mb-3 border-t border-secondary/30 pt-3">
        {mentor.socialLinks?.linkedin && (
          <a
            href={mentor.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors"
          >
            <FaLinkedinIn />
          </a>
        )}
        {mentor.socialLinks?.github && (
          <a
            href={mentor.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition-colors"
          >
            <FaGithub />
          </a>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-primary to-secondary text-dark font-semibold py-2 rounded-lg hover:shadow-elevated transition-all"
      >
        Connect
      </motion.button>
    </ModernCard>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading mentors...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-dark mb-2">
              Mentor Network
            </h1>
            <p className="text-muted">
              Connect with experienced mentors and alumni
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBecomeMentor(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-dark font-bold px-6 py-3 rounded-full hover:shadow-elevated transition-all"
          >
            <FaPlus /> Become a Mentor
          </motion.button>
        </div>

        {/* Become Mentor Modal */}
        {showBecomeMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <ModernCard
              elevated
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark">
                  Become a Mentor
                </h2>
                <button
                  onClick={() => setShowBecomeMentor(false)}
                  className="text-dark hover:text-primary text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={mentorForm.company}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, company: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <input
                  type="text"
                  placeholder="Current Role"
                  value={mentorForm.role}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, role: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <input
                  type="number"
                  placeholder="Years of Experience"
                  value={mentorForm.experience}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      experience: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <textarea
                  placeholder="Tell about yourself..."
                  value={mentorForm.bio}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, bio: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                  rows="3"
                />

                <div>
                  <p className="text-sm font-semibold text-dark mb-2">
                    Areas of Expertise
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {expertiseOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleExpertise(skill)}
                        className={`p-2 rounded-lg border transition-all ${
                          mentorForm.expertise.includes(skill)
                            ? "border-primary bg-primary/20"
                            : "border-secondary/30"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="url"
                  placeholder="LinkedIn Profile"
                  value={mentorForm.linkedin}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, linkedin: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <input
                  type="url"
                  placeholder="GitHub Profile"
                  value={mentorForm.github}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, github: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <input
                  type="number"
                  placeholder="Hours available per week"
                  value={mentorForm.availability}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      availability: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowBecomeMentor(false)}
                    className="flex-1 border-2 border-primary text-primary font-bold py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBecomeMentor}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-dark font-bold py-2 rounded-lg"
                  >
                    Create Profile
                  </button>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-4">
          {["all", "mentors", "alumni"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all capitalize ${
                filter === tab
                  ? "bg-gradient-to-r from-primary to-secondary text-dark"
                  : "bg-secondary/30 text-dark hover:bg-secondary/50"
              }`}
            >
              {tab === "all"
                ? "All Mentors"
                : tab === "mentors"
                  ? "Current Mentors"
                  : "Alumni"}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        {(filter === "all" || filter === "mentors") && (
          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Mentors</h2>
            {mentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <MentorCard key={mentor._id} mentor={mentor} />
                ))}
              </div>
            ) : (
              <ModernCard className="text-center py-12">
                <p className="text-muted">No mentors available yet</p>
              </ModernCard>
            )}
          </div>
        )}

        {/* Alumni Grid */}
        {(filter === "all" || filter === "alumni") && (
          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Alumni</h2>
            {alumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumni.map((person) => (
                  <MentorCard key={person._id} mentor={person} />
                ))}
              </div>
            ) : (
              <ModernCard className="text-center py-12">
                <p className="text-muted">No alumni available yet</p>
              </ModernCard>
            )}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
