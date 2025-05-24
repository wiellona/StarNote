const mongoose = require("mongoose");

const pomodoroTimerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessions: {
    type: Number,
    required: true,
    default: 4,
  },
  duration_min: {
    type: Number,
    required: true,
    default: 25,
  },
  xp: {
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

pomodoroTimerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PomodoroTimer = mongoose.model("PomodoroTimer", pomodoroTimerSchema);
module.exports = PomodoroTimer;
