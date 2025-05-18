import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiStar,
  FiTrash2,
  FiX,
  FiSave,
} from "react-icons/fi";
import NoteCard from "../../components/NoteCard/NoteCard";
import "./NotesPage.css";

const NotesPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [categories, setCategories] = useState([
    "Personal",
    "Work",
    "Ideas",
    "Programming",
    "Study",
  ]);

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
      {
        id: "4",
        title: "Project Ideas",
        content:
          "- Personal website redesign\n- Productivity app\n- Recipe manager",
        category: "Ideas",
        isFavorite: true,
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: "5",
        title: "CSS Grid Reference",
        content:
          "grid-template-columns, grid-template-rows, grid-column, grid-row, grid-area, grid-gap",
        category: "Programming",
        isFavorite: false,
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: "6",
        title: "Grocery List",
        content: "- Apples\n- Bread\n- Milk\n- Eggs\n- Chicken\n- Rice",
        category: "Personal",
        isFavorite: false,
        updatedAt: new Date(Date.now() - 432000000).toISOString(),
      },
    ];

    setNotes(mockNotes);
    setFilteredNotes(mockNotes);
  }, []);

  useEffect(() => {
    let result = [...notes];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeFilter === "favorites") {
      result = result.filter((note) => note.isFavorite);
    } else if (activeFilter === "trash") {
      // In a real app, you'd have a separate array for trash
      result = [];
    }

    setFilteredNotes(result);
  }, [notes, searchTerm, activeFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "",
      content: "",
      category: "Personal",
      isFavorite: false,
      updatedAt: new Date().toISOString(),
    };

    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const handleEditNote = (note) => {
    setCurrentNote({ ...note });
    setIsEditing(true);
  };

  const handleDeleteNote = (id) => {
    // In a real app, this might move the note to trash first
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleToggleFavorite = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  const handleSaveNote = () => {
    if (!currentNote.title.trim()) {
      alert("Please add a title to your note");
      return;
    }

    const updatedNotes = currentNote.id
      ? notes.map((note) =>
          note.id === currentNote.id
            ? { ...currentNote, updatedAt: new Date().toISOString() }
            : note
        )
      : [
          ...notes,
          {
            ...currentNote,
            id: Date.now().toString(),
            updatedAt: new Date().toISOString(),
          },
        ];

    setNotes(updatedNotes);
    setIsEditing(false);
    setCurrentNote(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentNote(null);
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote({ ...currentNote, [name]: value });
  };

  return (
    <div className="notes-page page">
      <div className="container">
        <div className="notes-header">
          <h1>Notes</h1>
          <button
            className="btn-primary add-note-btn"
            onClick={handleCreateNote}
          >
            <FiPlus /> New Note
          </button>
        </div>

        <div className="notes-filters">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              All notes
            </button>
            <button
              className={`filter-tab ${
                activeFilter === "favorites" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("favorites")}
            >
              <FiStar /> Favorites
            </button>
            <button
              className={`filter-tab ${
                activeFilter === "trash" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("trash")}
            >
              <FiTrash2 /> Trash
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="note-editor">
            <div className="editor-header">
              <h2>{currentNote.id ? "Edit Note" : "New Note"}</h2>
              <div className="editor-actions">
                <button className="btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveNote}>
                  <FiSave /> Save
                </button>
              </div>
            </div>

            <div className="editor-form">
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  placeholder="Note Title"
                  value={currentNote.title}
                  onChange={handleNoteChange}
                  className="note-title-input"
                />
              </div>

              <div className="form-group">
                <select
                  name="category"
                  value={currentNote.category}
                  onChange={handleNoteChange}
                  className="category-select"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <textarea
                  name="content"
                  placeholder="Start typing your note..."
                  value={currentNote.content}
                  onChange={handleNoteChange}
                  className="note-content-input"
                  rows="12"
                ></textarea>
              </div>
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEditNote}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>
                  {searchTerm
                    ? `No notes found matching "${searchTerm}"`
                    : activeFilter === "trash"
                    ? "Trash is empty"
                    : activeFilter === "favorites"
                    ? "No favorite notes yet"
                    : "No notes yet. Create your first note!"}
                </p>
                {!searchTerm && activeFilter === "all" && (
                  <button className="btn-primary" onClick={handleCreateNote}>
                    <FiPlus /> Create Note
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
