// ==============================
// 📦 Dependencies
// ==============================
const mongoose = require("mongoose");

// ==============================
// 💬 Comment Schema
// ==============================
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// ==============================
// ❤️ Like Schema
// ==============================
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false } // prevent unnecessary IDs for likes
);

// ==============================
// 📝 Post Schema
// ==============================
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 improves query performance
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    likes: {
      type: [likeSchema],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// 🚀 Export Model
// ==============================
module.exports = mongoose.model("Post", postSchema);