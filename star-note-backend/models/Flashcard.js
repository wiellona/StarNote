const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Math", "Science", "History", "Language", "Programming", "Other"],
    default: "Other",
  },
  status: {
    type: String,
    enum: ["active", "favorite", "trash"],
    default: "active",
  },
  lastReviewed: {
    type: Date,
    default: null,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

flashcardSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
module.exports = Flashcard;