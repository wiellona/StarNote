const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");

// Configure multer storage to memory for manual upload to Cloudinary
const storage = multer.memoryStorage();
const parser = multer({ storage: storage });

// Helper function to upload buffer to Cloudinary
const streamifier = require("streamifier");

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "note_cover_images" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create a new note with optional image upload
router.post("/", parser.single("cover_image"), async (req, res) => {
  try {
    let coverImageUrl = req.body.cover_image || null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      coverImageUrl = result.secure_url;
    }
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      user_id: req.body.user_id, // Get user ID from request body
      cover_image: coverImageUrl,
      category: (req.body.category || "personal").toLowerCase(),
      status: req.body.status || "active",
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all notes for the user
router.get("/", async (req, res) => {
  try {
    // Get user_id from query parameter
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    } // Build filter criteria
    const filter = { user_id: userId };
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      // If no status specified, show all notes except trash
      filter.status = { $ne: "trash" };
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 }); // Sort by most recently updated

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single note by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const note = await Note.findOne({
      _id: req.params.id,
      user_id: userId, // Ensure user can only access their own notes
    });

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", parser.single("cover_image"), async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // First check if note exists and belongs to user
    const note = await Note.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    let coverImageUrl = req.body.cover_image || note.cover_image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      coverImageUrl = result.secure_url;
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        cover_image: coverImageUrl,
        updatedAt: Date.now(), // Force updatedAt to current time
      },
      { new: true }
    );

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Move note to trash (soft delete)
router.put("/:id/trash", async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.status = "trash";
    note.updatedAt = Date.now();
    await note.save();

    res.json({ message: "Note moved to trash" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Restore note from trash
router.put("/:id/restore", async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user_id: userId,
      status: "trash",
    });

    if (!note)
      return res.status(404).json({ message: "Note not found in trash" });

    note.status = "active";
    note.updatedAt = Date.now();
    await note.save();

    res.json({ message: "Note restored from trash" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle favorite status
router.put("/:id/favorite", async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.status = note.status === "favorite" ? "active" : "favorite";
    note.updatedAt = Date.now();
    await note.save();

    res.json({
      message:
        note.status === "favorite"
          ? "Note marked as favorite"
          : "Note removed from favorites",
      status: note.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Permanently delete a note by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Ensure note belongs to user
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user_id: userId,
    });

    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Empty trash (delete all notes in trash)
router.delete("/trash/empty", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await Note.deleteMany({
      user_id: userId,
      status: "trash",
    });

    res.json({
      message: "Trash emptied",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get note statistics for the user dashboard
router.get("/stats", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const totalCount = await Note.countDocuments({
      user_id: userId,
      status: { $ne: "trash" },
    });
    const recentNotes = await Note.find({
      user_id: userId,
      status: { $ne: "trash" },
    })
      .sort({ updatedAt: -1 })
      .limit(3);
    res.json({
      totalCount,
      recentNotes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
