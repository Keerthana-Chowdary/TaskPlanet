const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   📁 Multer Setup
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* =========================
   📄 GET POSTS (Improved Pagination)
========================= */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 20);
    const page = parseInt(req.query.page, 10);
    const cursor = req.query.cursor;

    let posts;
    let hasMore = false;
    let nextCursor = null;

    // 🔥 Cursor-based pagination (preferred)
    if (cursor) {
      const query = { _id: { $lt: cursor } };

      posts = await Post.find(query)
        .sort({ _id: -1 })
        .limit(limit)
        .populate("user", "name username");

      hasMore = posts.length === limit;
      nextCursor = posts.length
        ? posts[posts.length - 1]._id
        : null;
    }

    // 🔄 Fallback: page-based pagination (your existing logic)
    else {
      const currentPage = Math.max(page || 1, 1);
      const skip = (currentPage - 1) * limit;

      const [result, total] = await Promise.all([
        Post.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("user", "name username"),
        Post.countDocuments(),
      ]);

      posts = result;
      hasMore = skip + posts.length < total;
      nextCursor = posts.length
        ? posts[posts.length - 1]._id
        : null;
    }

    res.json({
      posts,
      hasMore,
      nextCursor, // 🔥 ready for future frontend upgrade
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   ➕ CREATE POST
========================= */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!text?.trim() && !imageUrl) {
      return res.status(400).json({
        message: "Post must contain text or an image",
      });
    }

    const user = req.user;

    const post = await Post.create({
      user: user.id,
      username: user.username,
      text: text?.trim() || "",
      imageUrl,
    });

    const populated = await Post.findById(post._id).populate(
      "user",
      "name username"
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   ❤️ LIKE / UNLIKE POST
========================= */
router.put("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLikeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    // Toggle like
    if (existingLikeIndex >= 0) {
      post.likes.splice(existingLikeIndex, 1);
    } else {
      post.likes.push({
        user: req.user.id,
        username: req.user.username,
      });
    }

    await post.save();

    const updated = await Post.findById(post._id).populate(
      "user",
      "name username"
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   💬 ADD COMMENT
========================= */
router.post("/:id/comments", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res
        .status(400)
        .json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user.id,
      username: req.user.username,
      text: text.trim(),
    });

    await post.save();

    const updated = await Post.findById(post._id).populate(
      "user",
      "name username"
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;