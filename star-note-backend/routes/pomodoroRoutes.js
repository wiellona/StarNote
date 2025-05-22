const express = require("express");
const router = express.Router();
const PomodoroTimer = require("../models/PomodoroTimer");

// Create or update pomodoro timer settings for a user
router.post("/", async (req, res) => {
  try {
    const { user_id, sessions, duration_min } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let pomodoro = await PomodoroTimer.findOne({ user_id });

    if (pomodoro) {
      // Update existing
      pomodoro.sessions = sessions || pomodoro.sessions;
      pomodoro.duration_min = duration_min || pomodoro.duration_min;
      await pomodoro.save();
      res.json(pomodoro);
    } else {
      // Create new
      pomodoro = new PomodoroTimer({
        user_id,
        sessions: sessions || 4,
        duration_min: duration_min || 25,
        xp: 0,
      });
      await pomodoro.save();
      res.status(201).json(pomodoro);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pomodoro timer settings for a user
router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const pomodoro = await PomodoroTimer.findOne({ user_id: userId });
    if (!pomodoro) {
      return res.status(404).json({ message: "Pomodoro timer not found" });
    }
    res.json(pomodoro);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment XP when a pomodoro session is finished
router.put("/:id/xp", async (req, res) => {
  try {
    const userId = req.body.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const pomodoro = await PomodoroTimer.findOne({
      _id: req.params.id,
      user_id: userId,
    });
    if (!pomodoro) {
      return res.status(404).json({ message: "Pomodoro timer not found" });
    }

    pomodoro.xp = (pomodoro.xp || 0) + 1;
    await pomodoro.save();

    res.json({ message: "XP incremented", xp: pomodoro.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
