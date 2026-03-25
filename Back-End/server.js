// ==============================
// 📦 Core Dependencies
// ==============================
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// ==============================
// 🔧 Config & Services
// ==============================
const connectDB = require("./config/db");

// ==============================
// 📌 Routes
// ==============================
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// ==============================
// 🌱 Load Environment Variables
// ==============================
dotenv.config();

// ==============================
// 🚀 Initialize App
// ==============================
const app = express();

// ==============================
// 🗄️ Connect Database
// ==============================
connectDB();

// ==============================
// ⚙️ Middleware
// ==============================

// Enable CORS (allow frontend access)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Parse incoming JSON & form data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// ❤️ Health Check Route
// ==============================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ==============================
// 🔗 API Routes
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ==============================
// 🚀 Start Server
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});