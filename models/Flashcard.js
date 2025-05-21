const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "favorite", "trash"],
    default: "active",
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
