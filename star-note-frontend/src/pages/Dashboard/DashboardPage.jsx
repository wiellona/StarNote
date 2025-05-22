import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiClock, FiLayers, FiPlus } from "react-icons/fi";
import NoteCard from "../../components/NoteCard/NoteCard";
import "./DashboardPage.css";

const DashboardPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [recentNotes, setRecentNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Mock data fetch - in a real app, this would come from an API
  useEffect(() => {
    // Mock data
    const mockNotes = [
      {
        id: "1",
        title: "Meeting Notes: Project Kickoff",
        content:
          "Discussed project timeline, assigned tasks to team members, and set up weekly check-ins.",
        category: "Work",
        isFavorite: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "React Hooks Cheatsheet",
        content:
          "useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef",
        category: "Programming",
        isFavorite: false,
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        title: "Books to Read",
        content: "1. Atomic Habits\n2. Deep Work\n3. The Psychology of Money",
        category: "Personal",
        isFavorite: false,
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    setRecentNotes(mockNotes);
    setTotalNotes(12);
    setTotalFlashcards(34);
    setPomodoroSessions(27);
  }, []);

  const handleCreateNote = () => {
    navigate("/notes");
  };

  const handleCreateFlashcard = () => {
    navigate("/flashcards");
  };

  const handleStartPomodoro = () => {
    navigate("/pomodoro");
  };

  return (
    <div className="dashboard-page page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome to your Dashboard</h1>
          <p>Here's an overview of your productivity</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon notes-icon">
              <FiFileText />
            </div>
            <div className="stat-content">
              <h3>Notes</h3>
              <p className="stat-number">{totalNotes}</p>
              <p className="stat-label">Total Notes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon flashcards-icon">
              <FiLayers />
            </div>
            <div className="stat-content">
              <h3>Flashcards</h3>
              <p className="stat-number">{totalFlashcards}</p>
              <p className="stat-label">Total Cards</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pomodoro-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <h3>Pomodoro</h3>
              <p className="stat-number">{pomodoroSessions}</p>
              <p className="stat-label">Completed Sessions</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="action-card" onClick={handleCreateNote}>
            <FiFileText className="action-icon" />
            <span className="action-label">New Note</span>
          </button>

          <button className="action-card" onClick={handleCreateFlashcard}>
            <FiLayers className="action-icon" />
            <span className="action-label">New Flashcard</span>
          </button>

          <button className="action-card" onClick={handleStartPomodoro}>
            <FiClock className="action-icon" />
            <span className="action-label">Start Pomodoro</span>
          </button>
        </div>

        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Notes</h2>
            <button className="view-all" onClick={() => navigate("/notes")}>
              View All
            </button>
          </div>

          <div className="recent-notes">
            {recentNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={() => {}}
                onToggleFavorite={() => {}}
                onEdit={() => navigate("/notes")}
              />
            ))}

            <button className="add-card" onClick={handleCreateNote}>
              <FiPlus className="add-icon" />
              <span>Add New Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
