// ==============================
// 📦 Dependencies
// ==============================
const mongoose = require("mongoose");

// ==============================
// 👤 User Schema
// ==============================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true, // 🔥 faster lookup
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true, // 🔥 faster login queries
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// 🚀 Export Model
// ==============================
module.exports = mongoose.model("User", userSchema);