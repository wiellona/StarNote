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

const PomodoroPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("focus"); // 'focus', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    roundsBeforeLongBreak: 4,
  });
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete project proposal", completed: false },
    { id: 2, text: "Research new technologies", completed: false },
    { id: 3, text: "Update portfolio website", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  // Refs for audio sounds
  const tickSound = useRef(null);
  const alarmSound = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Set initial time based on mode
  useEffect(() => {
    switch (mode) {
      case "focus":
        setTimeLeft(settings.focusTime * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreakTime * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreakTime * 60);
        break;
      default:
        setTimeLeft(settings.focusTime * 60);
    }
    // Stop timer when mode changes
    setIsActive(false);
  }, [mode, settings]);

  // Timer logic
  useEffect(() => {
    let interval;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);

        // Play tick sound at specific intervals
        if (timeLeft <= 10 && tickSound.current) {
          // Would play tick sound in production
          // tickSound.current.play()
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      if (alarmSound.current) {
        // Would play alarm sound in production
        // alarmSound.current.play()
      }

      // Change mode based on current mode
      if (mode === "focus") {
        // Increment round counter
        const newRounds = rounds + 1;
        setRounds(newRounds);

        // Check if it's time for a long break
        if (newRounds % settings.roundsBeforeLongBreak === 0) {
          setMode("longBreak");
        } else {
          setMode("shortBreak");
        }
      } else {
        // After any break, go back to focus mode
        setMode("focus");
      }

      // Stop the timer
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, rounds, settings.roundsBeforeLongBreak]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case "focus":
        setTimeLeft(settings.focusTime * 60);
        break;
      case "shortBreak":
        setTimeLeft(settings.shortBreakTime * 60);
        break;
      case "longBreak":
        setTimeLeft(settings.longBreakTime * 60);
        break;
      default:
        setTimeLeft(settings.focusTime * 60);
    }
  };

  const skipToNext = () => {
    if (mode === "focus") {
      const newRounds = rounds + 1;
      setRounds(newRounds);

      if (newRounds % settings.roundsBeforeLongBreak === 0) {
        setMode("longBreak");
      } else {
        setMode("shortBreak");
      }
    } else {
      setMode("focus");
    }
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value, 10),
    });
  };

  const saveSettings = () => {
    setShowSettings(false);
    resetTimer();
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
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

  // Calculate progress percentage
  const calculateProgress = () => {
    let totalTime;
    switch (mode) {
      case "focus":
        totalTime = settings.focusTime * 60;
        break;
      case "shortBreak":
        totalTime = settings.shortBreakTime * 60;
        break;
      case "longBreak":
        totalTime = settings.longBreakTime * 60;
        break;
      default:
        totalTime = settings.focusTime * 60;
    }

    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="pomodoro-page page">
      <div className="container">
        <h1 className="pomodoro-title">Pomodoro Timer</h1>

        <div className="pomodoro-container">
          <div className="timer-section">
            <div className="timer-modes">
              <button
                className={`mode-btn ${mode === "focus" ? "active" : ""}`}
                onClick={() => setMode("focus")}
              >
                Focus
              </button>
              <button
                className={`mode-btn ${mode === "shortBreak" ? "active" : ""}`}
                onClick={() => setMode("shortBreak")}
              >
                Short Break
              </button>
              <button
                className={`mode-btn ${mode === "longBreak" ? "active" : ""}`}
                onClick={() => setMode("longBreak")}
              >
                Long Break
              </button>
            </div>

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
                    stroke={
                      mode === "focus"
                        ? "var(--accent)"
                        : mode === "shortBreak"
                        ? "#4CAF50"
                        : "#FF9800"
                    }
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

            <div className="timer-controls">
              <button
                className="control-btn reset-btn"
                onClick={resetTimer}
                aria-label="Reset timer"
              >
                <FiClock />
              </button>

              <button
                className="control-btn play-btn"
                onClick={toggleTimer}
                aria-label={isActive ? "Pause timer" : "Start timer"}
              >
                {isActive ? <FiPause /> : <FiPlay />}
              </button>

              <button
                className="control-btn skip-btn"
                onClick={skipToNext}
                aria-label="Skip to next"
              >
                <FiSkipForward />
              </button>

              <button
                className="control-btn settings-btn"
                onClick={() => setShowSettings(true)}
                aria-label="Settings"
              >
                <FiSettings />
              </button>
            </div>

            <div className="rounds-counter">
              <span>
                Round{" "}
                {rounds % settings.roundsBeforeLongBreak ||
                  settings.roundsBeforeLongBreak}{" "}
                of {settings.roundsBeforeLongBreak}
              </span>
              <span className="total-rounds">Total: {rounds}</span>
            </div>
          </div>

          <div className="tasks-section">
            <h3>Focus Tasks</h3>

            <form className="add-task-form" onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
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
                      aria-label={
                        task.completed
                          ? "Mark as incomplete"
                          : "Mark as complete"
                      }
                    >
                      {task.completed ? (
                        <FiCheck className="check-icon" />
                      ) : null}
                    </button>
                    <span className="task-text">{task.text}</span>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
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
