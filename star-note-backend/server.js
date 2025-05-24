const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");

const app = express();
app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/pomodoro", pomodoroRoutes);

// Add a health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Test endpoint to verify our changes
app.get("/api/test", (req, res) => {
  res
    .status(200)
    .json({
      message: "Test endpoint working",
      env: process.env.JWT_SECRET
        ? "JWT_SECRET is set"
        : "JWT_SECRET is missing",
    });
});

// Connect to MongoDB
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000, // Increase timeout to 60 seconds
    socketTimeoutMS: 60000, // Socket timeout
    serverSelectionTimeoutMS: 60000, // Server selection timeout
    heartbeatFrequencyMS: 30000, // Check server status every 30 seconds
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error details:", {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
