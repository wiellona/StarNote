const mongoose = require("mongoose");

const noteFileSchema = new mongoose.Schema({
  note_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
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

const NoteFile = mongoose.model("NoteFile", noteFileSchema);
module.exports = NoteFile;
