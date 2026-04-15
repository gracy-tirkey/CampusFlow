import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaPlus,
  FaTrophy,
  FaCalendarAlt,
  FaLightbulb,
  FaBullhorn,
} from "react-icons/fa";
import { ModernCard } from "../components/Card";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

export default function CampusFeed() {
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "discussion",
    tags: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: "achievement",
      name: "Achievement",
      icon: FaTrophy,
      color: "from-yellow-500",
    },
    { id: "event", name: "Event", icon: FaCalendarAlt, color: "from-blue-500" },
    {
      id: "discussion",
      name: "Discussion",
      icon: FaLightbulb,
      color: "from-purple-500",
    },
    {
      id: "opportunity",
      name: "Opportunity",
      icon: FaBullhorn,
      color: "from-green-500",
    },
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/community/all", {
        params: { sortBy: filter },
      });
      // Handle both response formats
      const postsData = response.data?.data || response.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);

      if (filter === "latest") {
        const trendingRes = await API.get("/community/trending");
        const trendingData = trendingRes.data?.data || trendingRes.data || [];
        setTrendingPosts(
          Array.isArray(trendingData) ? trendingData.slice(0, 3) : [],
        );
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setTrendingPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await API.post("/community/create", {
        ...newPost,
        tags: newPost.tags.split(",").map((tag) => tag.trim()),
      });

      setNewPost({ title: "", content: "", category: "discussion", tags: "" });
      setShowCreatePost(false);
      fetchPosts();
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post");
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.post(`/community/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const PostCard = ({ post }) => {
    const categoryData = categories.find((c) => c.id === post.category);
    const CatIcon = categoryData?.icon || FaLightbulb;

    return (
      <ModernCard elevated className="flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pb-4 border-b border-secondary/30">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">A</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-dark">
              {post.author?.name || "Anonymous"}
            </p>
            <p className="text-xs text-muted">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Just now"}
            </p>
          </div>
          <div
            className={`bg-gradient-to-r ${categoryData?.color} text-white p-2 rounded-lg`}
          >
            <CatIcon size={14} />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-dark mb-2">{post.title}</h3>
        <p className="text-sm text-muted mb-3 flex-1 line-clamp-3">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-secondary/30 text-sm text-muted">
          <button
            onClick={() =>
              handleLike(
                post._id,
                post.likes?.some((l) => l === "currentUserId"),
              )
            }
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <FaHeart className="text-sm" />
            {post.likes?.length || 0}
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <FaComment className="text-sm" />
            {post.comments?.length || 0}
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <FaShare className="text-sm" />
            {post.shares || 0}
          </button>
          <span className="ml-auto text-xs">{post.views || 0} views</span>
        </div>
      </ModernCard>
    );
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-dark mb-2">Campus Feed</h1>
            <p className="text-muted">
              Share achievements, events, and connect with your community
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-dark font-bold px-6 py-3 rounded-full hover:shadow-elevated transition-all"
          >
            <FaPlus /> Create Post
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Sort & Filter */}
            <div className="flex gap-2 mb-4">
              {["latest", "trending", "popular"].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setFilter(sort)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all capitalize ${
                    filter === sort
                      ? "bg-gradient-to-r from-primary to-secondary text-dark"
                      : "bg-secondary/30 text-dark hover:bg-secondary/50"
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))
            ) : (
              <ModernCard className="text-center py-12">
                <p className="text-muted">
                  No posts yet. Be the first to share!
                </p>
              </ModernCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Category Filter */}
            <ModernCard elevated>
              <h3 className="font-bold text-dark mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left ${
                        selectedCategory === cat.id
                          ? "bg-primary/20 text-primary font-semibold"
                          : "text-dark hover:bg-secondary/30"
                      }`}
                    >
                      <Icon size={14} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </ModernCard>

            {/* Trending Posts */}
            {trendingPosts.length > 0 && (
              <ModernCard elevated>
                <h3 className="font-bold text-dark mb-3">Trending 🔥</h3>
                <div className="space-y-3">
                  {trendingPosts.map((post) => (
                    <div
                      key={post._id}
                      className="p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-all cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-dark line-clamp-2">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {post.likes?.length} likes
                      </p>
                    </div>
                  ))}
                </div>
              </ModernCard>
            )}

            {/* Community Stats */}
            <ModernCard elevated>
              <h3 className="font-bold text-dark mb-3">Community</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Total Posts</span>
                  <span className="font-bold text-primary">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Active Members</span>
                  <span className="font-bold text-primary">1.2K+</span>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <ModernCard elevated className="max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark">Create Post</h2>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-dark hover:text-primary text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                  rows="4"
                />

                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newPost.tags}
                  onChange={(e) =>
                    setNewPost({ ...newPost, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background/50 rounded-lg border border-secondary/30 focus:border-primary outline-none text-dark"
                />

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="flex-1 border-2 border-primary text-primary font-bold py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-dark font-bold py-2 rounded-lg"
                  >
                    Post
                  </button>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
