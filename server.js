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

// Routes
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/pomodoro", pomodoroRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
