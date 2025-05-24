const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Flashcard = require("../models/Flashcard");
const auth = require("../middleware/auth");

// ==== STATIC ROUTES FIRST (NO PARAMS) ====

// Get all flashcards for the user
router.get("/", auth, async (req, res) => {
  try {
    const filter = { user_id: req.user.id };

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by category if provided
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }

    // Text search if provided
    if (req.query.search) {
      filter.$or = [
        { question: { $regex: req.query.search, $options: "i" } },
        { answer: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const flashcards = await Flashcard.find(filter).sort({ updatedAt: -1 });

    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new flashcard
router.post("/", auth, async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    // Validation
    if (!question || !answer || !category) {
      return res
        .status(400)
        .json({ message: "Question, answer, and category are required" });
    }

    const newFlashcard = new Flashcard({
      question,
      answer,
      category,
      user_id: req.user.id,
      status: req.body.status || "active",
    });

    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all categories for a user
router.get("/categories/list", auth, async (req, res) => {
  try {
    const categories = await Flashcard.distinct("category", {
      user_id: req.user.id,
    });

    // Always include default categories even if user hasn't used them yet
    const defaultCategories = [
      "Math",
      "Science",
      "History",
      "Language",
      "Programming",
      "Other",
    ];

    // Merge and remove duplicates
    const allCategories = [...new Set([...defaultCategories, ...categories])];

    res.json(allCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get flashcard statistics for the user dashboard
router.get("/stats", auth, async (req, res) => {
  try {
    const totalCount = await Flashcard.countDocuments({
      user_id: req.user.id,
      status: { $ne: "trash" },
    });

    const categoryStats = await Flashcard.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.user.id),
          status: { $ne: "trash" },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const reviewedLast7Days = await Flashcard.countDocuments({
      user_id: req.user.id,
      lastReviewed: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const favoriteCount = await Flashcard.countDocuments({
      user_id: req.user.id,
      status: "favorite",
    });

    res.json({
      totalCount,
      categoryStats,
      reviewedLast7Days,
      favoriteCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Empty trash (delete all flashcards in trash)
router.delete("/trash/empty", auth, async (req, res) => {
  try {
    const result = await Flashcard.deleteMany({
      user_id: req.user.id,
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

// Export all user's flashcards
router.get("/export", auth, async (req, res) => {
  try {
    // Get all active and favorite flashcards
    const flashcards = await Flashcard.find(
      {
        user_id: req.user.id,
        status: { $ne: "trash" },
      },
      {
        question: 1,
        answer: 1,
        category: 1,
        _id: 0,
      }
    );

    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Batch import flashcards
router.post("/batch", auth, async (req, res) => {
  try {
    const { flashcards } = req.body;

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return res.status(400).json({ message: "Invalid flashcards data" });
    }

    // Prepare flashcards with user ID
    const flashcardsToInsert = flashcards.map((card) => ({
      question: card.question,
      answer: card.answer,
      category: card.category || "Other",
      user_id: req.user.id,
      status: "active",
    }));

    // Validate all flashcards
    for (const card of flashcardsToInsert) {
      if (!card.question || !card.answer) {
        return res.status(400).json({
          message: "All flashcards must have question and answer fields",
        });
      }

      // Ensure category is valid
      if (
        ![
          "Math",
          "Science",
          "History",
          "Language",
          "Programming",
          "Other",
        ].includes(card.category)
      ) {
        card.category = "Other";
      }
    }

    // Insert all flashcards
    const insertedFlashcards = await Flashcard.insertMany(flashcardsToInsert);

    res.status(201).json({
      message: `Successfully imported ${insertedFlashcards.length} flashcards`,
      flashcards: insertedFlashcards,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== ROUTES WITH PARAMETERS AFTER STATIC ROUTES ====

// Get a single flashcard by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found" });
    res.json(flashcard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a flashcard by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    // Validation
    if (!question && !answer && !category) {
      return res
        .status(400)
        .json({ message: "Please provide fields to update" });
    }

    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found" });

    // Only update the fields that are provided
    const updateFields = {};
    if (question) updateFields.question = question;
    if (answer) updateFields.answer = answer;
    if (category) updateFields.category = category;

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      {
        ...updateFields,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json(updatedFlashcard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Permanently delete a flashcard by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedFlashcard = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!deletedFlashcard)
      return res.status(404).json({ message: "Flashcard not found" });

    res.json({ message: "Flashcard permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Move flashcard to trash (soft delete)
router.put("/:id/trash", auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
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
router.put("/:id/restore", auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
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
router.put("/:id/favorite", auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
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

// Track flashcard review (for study mode)
router.put("/:id/review", auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!flashcard)
      return res.status(404).json({ message: "Flashcard not found" });

    // Increment the review counter and update the last reviewed timestamp
    flashcard.reviewCount += 1;
    flashcard.lastReviewed = Date.now();
    await flashcard.save();

    res.json({
      message: "Flashcard review tracked",
      reviewCount: flashcard.reviewCount,
      lastReviewed: flashcard.lastReviewed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add image to flashcard
router.post("/:id/image", auth, async (req, res) => {
  try {
    const { file_url } = req.body;

    if (!file_url) {
      return res.status(400).json({ message: "File URL is required" });
    }

    // Check if flashcard exists and belongs to user
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    // Create new flashcard file
    const FlashcardFile = require("../models/FlashcardFile");
    const newFile = new FlashcardFile({
      flashcard_id: req.params.id,
      file_url,
    });

    await newFile.save();

    res.status(201).json({
      message: "Image added to flashcard",
      file: newFile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all images for a flashcard
router.get("/:id/images", auth, async (req, res) => {
  try {
    // Check if flashcard exists and belongs to user
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    const FlashcardFile = require("../models/FlashcardFile");
    const files = await FlashcardFile.find({ flashcard_id: req.params.id });

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
