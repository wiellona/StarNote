const mongoose = require("mongoose");

const flashcardFileSchema = new mongoose.Schema({
  flashcard_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flashcard",
    required: true,
  },
  file_url: {
    type: String,
    required: true,
    maxlength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FlashcardFile = mongoose.model("FlashcardFile", flashcardFileSchema);
module.exports = FlashcardFile;
