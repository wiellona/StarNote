const express = require("express");
const router = express.Router();
const Flashcard = require("../models/Flashcard");

// Create a new flashcard
router.post("/", async (req, res) => {
  try {
    const newFlashcard = new Flashcard({
      content: req.body.content,
      user_id: req.body.user_id,
      status: req.body.status || "active",
    });

    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all flashcards for the user
router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const filter = { user_id: userId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const flashcards = await Flashcard.find(filter).sort({ updatedAt: -1 });

    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single flashcard by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found" });
    res.json(flashcard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a flashcard by ID
router.put("/:id", async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found" });
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json(updatedFlashcard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Move flashcard to trash (soft delete)
router.put("/:id/trash", async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found" });

    flashcard.status = "trash";
    flashcard.updatedAt = Date.now();
    await flashcard.save();

    res.json({ message: "Flashcard moved to trash" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Restore flashcard from trash
router.put("/:id/restore", async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: userId,
      status: "trash",
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found in trash" });

    flashcard.status = "active";
    flashcard.updatedAt = Date.now();
    await flashcard.save();

    res.json({ message: "Flashcard restored from trash" });
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

    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: userId,
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found" });

    flashcard.status = flashcard.status === "favorite" ? "active" : "favorite";
    flashcard.updatedAt = Date.now();
    await flashcard.save();

    res.json({
      message:
        flashcard.status === "favorite"
          ? "Flashcard marked as favorite"
          : "Flashcard removed from favorites",
      status: flashcard.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Permanently delete a flashcard by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedFlashcard = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      user_id: userId,
    });

    if (!deletedFlashcard)
      return res.status(404).json({ message: "Flashcard not found" });

    res.json({ message: "Flashcard permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Empty trash (delete all flashcards in trash)
router.delete("/trash/empty", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await Flashcard.deleteMany({
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

module.exports = router;
