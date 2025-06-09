const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Set up logging directory
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom logger function
const logger = (message, type = "info") => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}]: ${message}\n`;

  // Log to console
  console.log(logMessage);

  // Log to file if in production
  if (process.env.NODE_ENV === "production") {
    const logFile = path.join(
      logsDir,
      `${new Date().toISOString().split("T")[0]}.log`
    );
    fs.appendFileSync(logFile, logMessage);
  }
};

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

// Add a comprehensive health check endpoint for Docker
app.get("/api/health", (req, res) => {
  // Check MongoDB connection
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  // System information
  const systemInfo = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  };

  // Check if essential environment variables are set
  const envVarsCheck = {
    mongoUri: !!process.env.MONGO_URI,
    jwtSecret: !!process.env.JWT_SECRET,
    cloudinaryConfig: !!process.env.CLOUDINARY_URL,
  };

  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    mongoStatus,
    systemInfo,
    envVarsCheck,
  });

  // Log health check request
  logger(`Health check performed: MongoDB ${mongoStatus}`, "info");
});

// Test endpoint to verify our changes
app.get("/api/test", (req, res) => {
  logger("Test endpoint accessed", "info");
  res.status(200).json({
    message: "Test endpoint working",
    env: process.env.JWT_SECRET ? "JWT_SECRET is set" : "JWT_SECRET is missing",
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB
logger("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000, // Increase timeout to 60 seconds
    socketTimeoutMS: 60000, // Socket timeout
    serverSelectionTimeoutMS: 60000, // Server selection timeout
    heartbeatFrequencyMS: 30000, // Check server status every 30 seconds
  })
  .then(() => logger("MongoDB connected successfully"))
  .catch((err) => {
    logger(
      `MongoDB connection error: ${err.message} (Code: ${err.code})`,
      "error"
    );
    logger(err.stack, "error");
  });

mongoose.connection.on("connected", () => {
  logger("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  logger(`Mongoose connection error: ${err}`, "error");
});

mongoose.connection.on("disconnected", () => {
  logger("Mongoose disconnected", "warn");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger(`Error: ${err.message}`, "error");
  logger(err.stack, "error");
  res.status(500).json({ error: "Internal Server Error" });
});

// Handle 404 routes
app.use((req, res) => {
  logger(`404 Not Found: ${req.method} ${req.url}`, "warn");
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown function
const gracefulShutdown = () => {
  logger("Received shutdown signal, closing connections...", "warn");
  mongoose.connection.close(false, () => {
    logger("MongoDB connection closed", "info");
    process.exit(0);
  });

  // Force close if it takes too long
  setTimeout(() => {
    logger(
      "Could not close connections in time, forcefully shutting down",
      "error"
    );
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger(`Server running on port ${PORT}`, "info"));
