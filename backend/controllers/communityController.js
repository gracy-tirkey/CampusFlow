import CommunityPost from "../models/CommunityPost.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags, image } = req.body;
    const authorId = req.user.id;

    const post = new CommunityPost({
      author: authorId,
      title,
      content,
      category,
      tags,
      image,
      status: "published",
    });

    await post.save();
    await post.populate("author", "name profileImage email");

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const { category, sortBy = "latest" } = req.query;
    let query = { status: "published" };

    if (category) {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "trending") {
      sortOption = { likes: -1 };
    } else if (sortBy === "popular") {
      sortOption = { views: -1 };
    }

    const posts = await CommunityPost.find(query)
      .populate("author", "name profileImage email")
      .populate("comments.author", "name profileImage")
      .sort(sortOption)
      .limit(50);

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching posts",
    });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await CommunityPost.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    )
      .populate("author", "name profileImage email")
      .populate("comments.author", "name profileImage email");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json({
      message: likeIndex > -1 ? "Post unliked" : "Post liked",
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Comment on post
export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({
      author: authorId,
      content,
      createdAt: new Date(),
    });

    await post.save();
    await post.populate("comments.author", "name profileImage");

    res.json({
      message: "Comment added successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get posts by category
export const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const posts = await CommunityPost.find({
      category,
      status: "published",
    })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get trending posts
export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find({ status: "published" })
      .populate("author", "name profileImage")
      .sort({
        $expr: {
          $add: [
            { $multiply: [{ $size: "$likes" }, 2] },
            { $multiply: [{ $size: "$comments" }, 1] },
            { $divide: ["$views", 100] },
          ],
        },
      })
      .limit(20);

    res.status(200).json({
      success: true,
      message: "Trending posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching trending posts",
    });
  }
};

// Share post
export const sharePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await CommunityPost.findByIdAndUpdate(
      id,
      { $inc: { shares: 1 } },
      { new: true },
    );

    res.json({
      message: "Post shared",
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await CommunityPost.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
