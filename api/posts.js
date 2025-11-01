const express = require("express");
const router = express.Router();
const { Post, User } = require("../database");

// ✅ GET /api/posts — get all posts (optionally filter or search)
router.get("/", async (req, res) => {
  try {
    const { category, q, status } = req.query;

    const where = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (q) {
      where.title = { [require("sequelize").Op.iLike]: `%${q}%` };
    }

    const posts = await Post.findAll({
      where,
      include: {
        model: User,
        attributes: ["emplid", "username", "email"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ✅ GET /api/posts/:id — get single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["emplid", "username", "email"],
      },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// ✅ POST /api/posts — create a new post
router.post("/", async (req, res) => {
  try {
    const { title, description, price, category, location, image_url, userId } = req.body;

    if (!title || !description || !category || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found — must be a BMCC student" });
    }

    const newPost = await Post.create({
      title,
      description,
      price,
      category,
      location,
      image_url,
      userId,
    });

    res.status(201).json({
      message: "✅ Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// ✅ PUT /api/posts/:id — update post info
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const { title, description, price, category, location, image_url, status } = req.body;

    if (title) post.title = title;
    if (description) post.description = description;
    if (price !== undefined) post.price = price;
    if (category) post.category = category;
    if (location) post.location = location;
    if (image_url) post.image_url = image_url;
    if (status) post.status = status;

    await post.save();

    res.json({ message: "✅ Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// ✅ DELETE /api/posts/:id — delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    await post.destroy();
    res.json({ message: "🗑️ Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
