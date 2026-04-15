import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaRoad,
  FaFileAlt,
  FaCode,
  FaUserGraduate,
  FaUserTie,
  FaStar,
  FaClock,
} from "react-icons/fa";
import { ModernCard } from "../components/Card";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

export default function CareerHub() {
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("roadmap");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const tracks = [
    {
      name: "MERN Developer",
      icon: FaCode,
      color: "from-blue-500 to-cyan-500",
    },
    { name: "SDE", icon: FaBriefcase, color: "from-green-500 to-emerald-500" },
    {
      name: "Data Analyst",
      icon: FaRoad,
      color: "from-purple-500 to-pink-500",
    },
    { name: "UI/UX", icon: FaFileAlt, color: "from-yellow-500 to-orange-500" },
    { name: "DevOps", icon: FaCode, color: "from-red-500 to-rose-500" },
    {
      name: "Cloud Architect",
      icon: FaBriefcase,
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const categories = [
    { id: "roadmap", name: "Roadmap", icon: FaRoad },
    { id: "resume", name: "Resume", icon: FaFileAlt },
    { id: "dsa", name: "DSA", icon: FaCode },
    { id: "internship", name: "Internship", icon: FaUserGraduate },
    { id: "referral", name: "Referral", icon: FaUserTie },
  ];

  useEffect(() => {
    fetchCareerPaths();
  }, [fetchCareerPaths]);

  const fetchCareerPaths = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/career/tracks");
      // Handle both response formats
      const pathsData = response.data?.data || response.data || [];
      setCareerPaths(Array.isArray(pathsData) ? pathsData : []);
    } catch (error) {
      console.error("Error fetching career paths:", error);
      setCareerPaths([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResourcesByTrack = useCallback(async () => {
    try {
      const response = await API.get(`/career/track/${selectedTrack}`);
      // Handle both response formats
      const resourcesData = response.data?.data || response.data || {};
      setResources(resourcesData);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources({});
    }
  }, [selectedTrack]);

  useEffect(() => {
    fetchCareerPaths();
  }, [fetchCareerPaths]);

  useEffect(() => {
    if (selectedTrack) {
      fetchResourcesByTrack();
    }
  }, [selectedTrack, selectedCategory, fetchResourcesByTrack]);

  const ResourceCard = ({ resource }) => (
    <ModernCard hoverScale className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-dark flex-1">{resource.title}</h4>
        {resource.difficulty && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ml-2 ${
              resource.difficulty === "Beginner"
                ? "bg-green-500/20 text-green-700"
                : resource.difficulty === "Intermediate"
                  ? "bg-yellow-500/20 text-yellow-700"
                  : "bg-red-500/20 text-red-700"
            }`}
          >
            {resource.difficulty}
          </span>
        )}
      </div>

      <p className="text-sm text-muted mb-3 flex-1">{resource.description}</p>

      {resource.duration && (
        <div className="flex items-center gap-2 text-xs text-muted mb-3 pb-3 border-b border-secondary/30">
          <FaClock size={12} />
          {resource.duration}
        </div>
      )}

      {resource.resources && resource.resources.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-dark mb-2">Resources</p>
          <div className="space-y-1">
            {resource.resources.slice(0, 3).map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline block truncate"
              >
                {res.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {resource.rating && (
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-xs ${
                i < Math.round(resource.rating.average || 0)
                  ? "text-orange-500"
                  : "text-secondary/30"
              }`}
            />
          ))}
          <span className="text-xs text-muted">
            ({resource.rating.count || 0})
          </span>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-primary to-secondary text-dark font-semibold py-2 rounded-lg hover:shadow-elevated transition-all"
      >
        Learn More →
      </motion.button>
    </ModernCard>
  );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-dark mb-2 flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-2xl">
              <FaBriefcase className="text-primary text-2xl" />
            </div>
            Career Guidance Hub
          </h1>
          <p className="text-muted">
            Explore career paths and roadmaps tailored for you
          </p>
        </div>

        {/* Career Tracks */}
        <div>
          <h2 className="text-2xl font-bold text-dark mb-4">
            Choose Your Career Path
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track, idx) => {
              const pathData = careerPaths.find((p) => p.track === track.name);
              const IconComponent = track.icon;

              return (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedTrack(track.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 rounded-2xl transition-all ${
                    selectedTrack === track.name
                      ? `bg-gradient-to-br ${track.color} text-white shadow-elevated`
                      : "bg-background/40 backdrop-blur border border-secondary/30 hover:border-primary/50 text-dark"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="text-2xl" />
                    <div className="text-left">
                      <p className="font-bold">{track.name}</p>
                      {pathData && (
                        <p className="text-xs opacity-75">
                          {pathData.resourceCount} resources
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Track Resources */}
        {selectedTrack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-bold text-dark mb-3">
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        selectedCategory === cat.id
                          ? "bg-gradient-to-r from-primary to-secondary text-dark"
                          : "bg-secondary/30 text-dark hover:bg-secondary/50"
                      }`}
                    >
                      <CatIcon size={14} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resources Grid */}
            <div>
              <h3 className="text-2xl font-bold text-dark mb-4">
                Resources for {selectedTrack}
              </h3>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : resources && Object.keys(resources).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(resources).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="text-lg font-bold text-dark mb-3 capitalize">
                        {category.replace("_", " ")}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((resource) => (
                          <ResourceCard
                            key={resource._id}
                            resource={resource}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ModernCard className="text-center py-12">
                  <p className="text-muted">
                    No resources available for this track yet
                  </p>
                </ModernCard>
              )}
            </div>
          </motion.div>
        )}

        {/* Career Tips Section */}
        {!selectedTrack && (
          <div>
            <h2 className="text-2xl font-bold text-dark mb-4">Career Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Build a Strong Portfolio",
                  description:
                    "Showcase your best projects on GitHub and personal website",
                },
                {
                  title: "Network Actively",
                  description:
                    "Connect with mentors, alumni, and professionals in your field",
                },
                {
                  title: "Master DSA",
                  description:
                    "Strong fundamentals in data structures and algorithms are crucial",
                },
                {
                  title: "Learn System Design",
                  description:
                    "Understand how to design scalable systems for interviews",
                },
              ].map((tip, idx) => (
                <ModernCard key={idx} delay={idx * 0.1}>
                  <h4 className="font-bold text-dark mb-2">{tip.title}</h4>
                  <p className="text-sm text-muted">{tip.description}</p>
                </ModernCard>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
