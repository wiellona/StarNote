import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiClock, FiLayers, FiPlus } from "react-icons/fi";
import NoteCard from "../../components/NoteCard/NoteCard";
import "./DashboardPage.css";
import { noteService, flashcardService } from "../../utils/api";
import { toast } from "react-hot-toast";

const DashboardPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [recentNotes, setRecentNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalFlashcards, setTotalFlashcards] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Fetch note and flashcard stats from backend for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all notes for the user (like NotesPage)
        const allNotes = await noteService.getAllNotes();
        setTotalNotes(allNotes.length);
        setRecentNotes(
          allNotes.slice(0, 3).map((note) => ({
            id: note._id,
            title: note.title,
            content: note.content,
            category: note.category,
            isFavorite: note.status === "favorite",
            updatedAt: note.updatedAt,
          }))
        );
        // Fetch all flashcards for the user (like FlashcardsPage)
        const allFlashcards = await flashcardService.getAllFlashcards();
        setTotalFlashcards(allFlashcards.length);
      } catch (error) {
        setTotalNotes(0);
        setRecentNotes([]);
        setTotalFlashcards(0);
        console.error("Dashboard fetch error:", error);
      }
    };
    if (isAuthenticated) fetchDashboardData();
  }, [isAuthenticated]);

  const handleCreateNote = () => {
    navigate("/notes");
  };

  const handleCreateFlashcard = () => {
    navigate("/flashcards");
  };
  const handleStartPomodoro = () => {
    navigate("/pomodoro");
  };

  const handleEditNote = async (note) => {
    // Navigate to Notes page and pass the note data for editing
    navigate("/notes", { state: { editNote: note } });
  };

  const handleDeleteNote = async (id) => {
    try {
      // Move to trash (soft delete) - dashboard only shows active notes
      await noteService.moveToTrash(id);
      toast.success("Note moved to trash");

      // Remove note from local state
      setRecentNotes(recentNotes.filter((note) => note.id !== id));
      setTotalNotes(totalNotes - 1);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const note = recentNotes.find((note) => note.id === id);
      if (!note) return;

      const newFavoriteStatus = !note.isFavorite;
      await noteService.toggleFavorite(id, newFavoriteStatus);

      // Update local state
      setRecentNotes(
        recentNotes.map((note) =>
          note.id === id ? { ...note, isFavorite: newFavoriteStatus } : note
        )
      );

      toast.success(
        newFavoriteStatus ? "Added to favorites" : "Removed from favorites"
      );
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Failed to update favorite status");
    }
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
          </div>{" "}
          <div className="recent-notes">
            {recentNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onToggleFavorite={handleToggleFavorite}
                onEdit={handleEditNote}
                inTrashView={false}
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
