import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlay,
  FiPause,
  FiSkipForward,
  FiSettings,
  FiX,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import "./PomodoroPage.css";

// Constants for timer modes
const TIMER_MODES = {
  FOCUS: "focus",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
};

// Default tasks for new users
const DEFAULT_TASKS = [
  { id: 1, text: "Complete project proposal", completed: false },
  { id: 2, text: "Research new technologies", completed: false },
  { id: 3, text: "Update portfolio website", completed: false },
];

const PomodoroPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  // Timer state
  const [mode, setMode] = useState(TIMER_MODES.FOCUS);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    roundsBeforeLongBreak: 4,
  });
  
  // Task management
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [newTask, setNewTask] = useState("");

  // Audio refs
  const tickSound = useRef(null);
  const alarmSound = useRef(null);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Update timer when mode changes
  useEffect(() => {
    resetTimer();
  }, [mode, settings]);

  // Timer countdown logic
  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);

        // Play tick sound for last 10 seconds
        if (timeLeft <= 10 && tickSound.current) {
          // In production: tickSound.current.play()
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Handle timer completion
  const handleTimerComplete = () => {
    // Play alarm sound
    if (alarmSound.current) {
      // In production: alarmSound.current.play()
    }

    if (mode === TIMER_MODES.FOCUS) {
      const newRounds = rounds + 1;
      setRounds(newRounds);

      // Determine break type
      if (newRounds % settings.roundsBeforeLongBreak === 0) {
        setMode(TIMER_MODES.LONG_BREAK);
      } else {
        setMode(TIMER_MODES.SHORT_BREAK);
      }
    } else {
      // After any break, return to focus mode
      setMode(TIMER_MODES.FOCUS);
    }

    setIsActive(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer controls
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    
    // Set time based on current mode
    switch (mode) {
      case TIMER_MODES.FOCUS:
        setTimeLeft(settings.focusTime * 60);
        break;
      case TIMER_MODES.SHORT_BREAK:
        setTimeLeft(settings.shortBreakTime * 60);
        break;
      case TIMER_MODES.LONG_BREAK:
        setTimeLeft(settings.longBreakTime * 60);
        break;
      default:
        setTimeLeft(settings.focusTime * 60);
    }
  };

  const skipToNext = () => {
    if (mode === TIMER_MODES.FOCUS) {
      const newRounds = rounds + 1;
      setRounds(newRounds);

      if (newRounds % settings.roundsBeforeLongBreak === 0) {
        setMode(TIMER_MODES.LONG_BREAK);
      } else {
        setMode(TIMER_MODES.SHORT_BREAK);
      }
    } else {
      setMode(TIMER_MODES.FOCUS);
    }
  };

  // Settings management
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value, 10) || 1, // Default to 1 if invalid
    });
  };

  const saveSettings = () => {
    setShowSettings(false);
    resetTimer();
  };

  // Task management
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Calculate progress percentage for circular timer
  const calculateProgress = () => {
    let totalTime;
    switch (mode) {
      case TIMER_MODES.FOCUS:
        totalTime = settings.focusTime * 60;
        break;
      case TIMER_MODES.SHORT_BREAK:
        totalTime = settings.shortBreakTime * 60;
        break;
      case TIMER_MODES.LONG_BREAK:
        totalTime = settings.longBreakTime * 60;
        break;
      default:
        totalTime = settings.focusTime * 60;
    }

    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // Get color based on current mode
  const getModeColor = () => {
    switch (mode) {
      case TIMER_MODES.FOCUS:
        return "var(--accent)";
      case TIMER_MODES.SHORT_BREAK:
        return "#4CAF50";
      case TIMER_MODES.LONG_BREAK:
        return "#FF9800";
      default:
        return "var(--accent)";
    }
  };

  return (
    <div className="pomodoro-page page">
      <div className="container">
        <h1 className="pomodoro-title">Pomodoro Timer</h1>

        <div className="pomodoro-container">
          {/* Timer Section */}
          <div className="timer-section">
            {/* Mode Selection */}
            <div className="timer-modes">
              <button
                className={`mode-btn ${mode === TIMER_MODES.FOCUS ? "active" : ""}`}
                onClick={() => setMode(TIMER_MODES.FOCUS)}
              >
                Focus
              </button>
              <button
                className={`mode-btn ${mode === TIMER_MODES.SHORT_BREAK ? "active" : ""}`}
                onClick={() => setMode(TIMER_MODES.SHORT_BREAK)}
              >
                Short Break
              </button>
              <button
                className={`mode-btn ${mode === TIMER_MODES.LONG_BREAK ? "active" : ""}`}
                onClick={() => setMode(TIMER_MODES.LONG_BREAK)}
              >
                Long Break
              </button>
            </div>

            {/* Timer Display */}
            <div className="timer-display">
              <div className="progress-ring-container">
                <div className="time-remaining">{formatTime(timeLeft)}</div>
                <svg className="progress-ring" width="300" height="300">
                  <circle
                    className="progress-ring-circle-bg"
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth="8"
                    fill="transparent"
                    r="120"
                    cx="150"
                    cy="150"
                  />
                  <circle
                    className="progress-ring-circle"
                    stroke={getModeColor()}
                    strokeWidth="8"
                    fill="transparent"
                    r="120"
                    cx="150"
                    cy="150"
                    style={{
                      strokeDasharray: 2 * Math.PI * 120,
                      strokeDashoffset:
                        2 * Math.PI * 120 * (1 - calculateProgress() / 100),
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="timer-controls">
              <button
                className="control-btn reset-btn"
                onClick={resetTimer}
                aria-label="Reset timer"
                title="Reset timer"
              >
                <FiClock />
              </button>

              <button
                className="control-btn play-btn"
                onClick={toggleTimer}
                aria-label={isActive ? "Pause timer" : "Start timer"}
                title={isActive ? "Pause timer" : "Start timer"}
              >
                {isActive ? <FiPause /> : <FiPlay />}
              </button>

              <button
                className="control-btn skip-btn"
                onClick={skipToNext}
                aria-label="Skip to next"
                title="Skip to next"
              >
                <FiSkipForward />
              </button>

              <button
                className="control-btn settings-btn"
                onClick={() => setShowSettings(true)}
                aria-label="Settings"
                title="Settings"
              >
                <FiSettings />
              </button>
            </div>

            {/* Round Counter */}
            <div className="rounds-counter">
              <span>
                Round {rounds % settings.roundsBeforeLongBreak || settings.roundsBeforeLongBreak}{" "}
                of {settings.roundsBeforeLongBreak}
              </span>
              <span className="total-rounds">Total: {rounds}</span>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="tasks-section">
            <h3>Focus Tasks</h3>

            <form className="add-task-form" onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                maxLength={100}
              />
              <button type="submit">Add</button>
            </form>

            <ul className="tasks-list">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`task-item ${task.completed ? "completed" : ""}`}
                  >
                    <button
                      className="complete-btn"
                      onClick={() => toggleTaskCompletion(task.id)}
                      aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {task.completed && <FiCheck className="check-icon" />}
                    </button>
                    <span className="task-text">{task.text}</span>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                      title="Delete task"
                    >
                      <FiX />
                    </button>
                  </li>
                ))
              ) : (
                <li className="empty-tasks">No tasks added yet</li>
              )}
            </ul>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="settings-modal">
            <div className="settings-content">
              <div className="settings-header">
                <h3>Timer Settings</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowSettings(false)}
                  aria-label="Close settings"
                >
                  <FiX />
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-group">
                  <label htmlFor="focusTime">Focus Time (minutes)</label>
                  <input
                    type="number"
                    id="focusTime"
                    name="focusTime"
                    min="1"
                    max="60"
                    value={settings.focusTime}
                    onChange={handleSettingChange}
                  />
                </div>

                <div className="setting-group">
                  <label htmlFor="shortBreakTime">Short Break (minutes)</label>
                  <input
                    type="number"
                    id="shortBreakTime"
                    name="shortBreakTime"
                    min="1"
                    max="30"
                    value={settings.shortBreakTime}
                    onChange={handleSettingChange}
                  />
                </div>

                <div className="setting-group">
                  <label htmlFor="longBreakTime">Long Break (minutes)</label>
                  <input
                    type="number"
                    id="longBreakTime"
                    name="longBreakTime"
                    min="1"
                    max="60"
                    value={settings.longBreakTime}
                    onChange={handleSettingChange}
                  />
                </div>

                <div className="setting-group">
                  <label htmlFor="roundsBeforeLongBreak">
                    Rounds Before Long Break
                  </label>
                  <input
                    type="number"
                    id="roundsBeforeLongBreak"
                    name="roundsBeforeLongBreak"
                    min="1"
                    max="10"
                    value={settings.roundsBeforeLongBreak}
                    onChange={handleSettingChange}
                  />
                </div>

                <button
                  className="btn-primary save-settings-btn"
                  onClick={saveSettings}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audio elements for sounds */}
        <audio ref={tickSound} preload="auto">
          <source src="/sounds/tick.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={alarmSound} preload="auto">
          <source src="/sounds/alarm.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};

export default PomodoroPage;