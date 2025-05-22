const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cover_image: {
    type: String,
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

// Middleware to update the updatedAt field on save
noteSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
