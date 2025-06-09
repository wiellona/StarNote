import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiStar,
  FiTrash2,
  FiX,
  FiSave,
  FiRefreshCw,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import NoteCard from "../../components/NoteCard/NoteCard";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import TextFormatToolbar from "../../components/TextFormatToolbar/TextFormatToolbar";
import { formatText } from "../../utils/formatText";
import { noteService } from "../../utils/api";
import { toast } from "react-hot-toast";
import "./NotesPage.css";

const NotesPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [categories, setCategories] = useState([
    "personal",
    "work",
    "ideas",
    "programming",
    "study",
  ]);
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]); // Fetch notes from API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Verify if user exists in localStorage
        const userJson = localStorage.getItem("starnote-user");
        const user = userJson ? JSON.parse(userJson) : null;
        const userId = user ? user.id : null;

        if (!userId) {
          console.error("No user ID found in localStorage");
          toast.error("User ID not found. Please log in again.");
          return;
        }
        console.log("Fetching notes with user ID:", userId);

        let status = null;
        if (activeFilter === "favorites") {
          status = "favorite";
        } else if (activeFilter === "trash") {
          status = "trash";
        } // For "all" view, don't set any status to get both active and favorite notes

        const fetchedNotes = await noteService.getAllNotes(status, searchTerm);
        console.log("Notes received:", fetchedNotes);

        // Check if we got an array response
        if (!Array.isArray(fetchedNotes)) {
          console.error("Expected array of notes but got:", fetchedNotes);
          toast.error("Invalid notes data received");
          return;
        }

        // Map the backend data structure to our frontend structure
        const formattedNotes = fetchedNotes.map((note) => ({
          id: note._id,
          title: note.title,
          content: note.content,
          category: (note.category || "personal").toLowerCase(),
          isFavorite: note.status === "favorite",
          updatedAt: note.updatedAt,
          coverImage: note.cover_image, // Map to UI field
        }));
        setNotes(formattedNotes);
        setFilteredNotes(formattedNotes);

        // Remove the toast notifications for loaded notes
        if (formattedNotes.length === 0 && searchTerm) {
          toast(`No notes found matching "${searchTerm}"`);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "Unknown error";
        console.error("Error fetching notes:", error);
        toast.error(`Failed to load notes: ${errorMessage}`);
      }
    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, activeFilter, searchTerm]);
  // We don't need additional filtering here since it's handled in the API call
  // Just ensure any changes to notes are reflected in filteredNotes
  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // The useEffect will refetch notes with the new search term
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // The useEffect will refetch notes with the new filter
  };
  const handleCreateNote = () => {
    const newNote = {
      id: null, // Will be assigned by the backend
      title: "",
      content: "",
      category: "personal",
      isFavorite: false,
      coverImage: null,
    };

    setCurrentNote(newNote);
    setIsEditing(true);
  };
  const handleEditNote = async (note) => {
    try {
      // Optionally fetch the latest version of the note from the API
      const latestNote = await noteService.getNote(note.id);

      // Format the note to match our frontend structure
      setCurrentNote({
        id: latestNote._id,
        title: latestNote.title,
        content: latestNote.content,
        category: (latestNote.category || "personal").toLowerCase(),
        isFavorite: latestNote.status === "favorite",
        updatedAt: latestNote.updatedAt,
        coverImage: latestNote.cover_image,
      });

      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching note details:", error);
      toast.error("Failed to load note details");
    }
  };
  const handleDeleteNote = async (id) => {
    try {
      if (activeFilter === "trash") {
        // If in trash view, permanently delete the note - ask for confirmation
        const confirmDelete = window.confirm(
          "Are you sure you want to permanently delete this note? This action cannot be undone."
        );

        if (!confirmDelete) return;

        await noteService.deleteNote(id);
        toast.success("Note deleted permanently");
      } else {
        // Move to trash (soft delete)
        await noteService.moveToTrash(id);
        toast.success("Note moved to trash");
      }

      // Remove note from local state
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleRestoreNote = async (id) => {
    try {
      await noteService.restoreFromTrash(id);
      toast.success("Note restored successfully");

      // Update local state to remove the note from view if in trash view
      if (activeFilter === "trash") {
        setNotes(notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error("Error restoring note:", error);
      toast.error("Failed to restore note");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const note = notes.find((note) => note.id === id);
      if (!note) return;

      const newFavoriteStatus = !note.isFavorite;
      await noteService.toggleFavorite(id, newFavoriteStatus);

      // Update local state
      setNotes(
        notes.map((note) =>
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
  const handleSaveNote = async () => {
    if (!currentNote.title.trim()) {
      toast.error("Please add a title to your note");
      return;
    }

    // Verify the user ID exists
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      navigate("/auth");
      return;
    }
    try {
      // Prepare data for API
      const noteData = {
        title: currentNote.title,
        content: currentNote.content,
        cover_image: currentNote.cover_image, // Use backend field name
        category: currentNote.category,
        status: currentNote.isFavorite ? "favorite" : "active",
      };

      let savedNote;

      if (currentNote.id) {
        // Update existing note
        savedNote = await noteService.updateNote(currentNote.id, noteData);
      } else {
        // Create new note
        savedNote = await noteService.createNote(noteData);
      }

      // Format the saved note to match our frontend structure
      const formattedNote = {
        id: savedNote._id,
        title: savedNote.title,
        content: savedNote.content,
        category: (savedNote.category || "personal").toLowerCase(),
        isFavorite: savedNote.status === "favorite",
        updatedAt: savedNote.updatedAt,
        coverImage: savedNote.cover_image,
      };

      // Update the notes state
      setNotes((prevNotes) => {
        const noteExists = prevNotes.some(
          (note) => note.id === formattedNote.id
        );
        if (noteExists) {
          return prevNotes.map((note) =>
            note.id === formattedNote.id ? formattedNote : note
          );
        } else {
          return [...prevNotes, formattedNote];
        }
      });

      toast.success(
        `Note ${currentNote.id ? "updated" : "created"} successfully!`
      );
      setIsEditing(false);
      setCurrentNote(null);
      setPreviewMode(false);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error(`Failed to ${currentNote.id ? "update" : "create"} note`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentNote(null);
    setPreviewMode(false);
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote({ ...currentNote, [name]: value });
  };

  // Track cursor position for formatting toolbar
  const handleCursorChange = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const handleTogglePreview = () => {
    setPreviewMode((prevMode) => !prevMode);
  };

  // Handle keydown events in the textarea
  const handleKeyDown = (e) => {
    // Only process Enter key
    if (e.key === "Enter") {
      const textarea = textareaRef.current;
      const content = currentNote.content;
      const cursorPos = textarea.selectionStart;

      // Find the start of the current line
      let lineStart = content.lastIndexOf("\n", cursorPos - 1) + 1;
      const currentLine = content.substring(lineStart, cursorPos);

      // Check if the current line is a list item
      const numberedListMatch = currentLine.match(/^(\d+)\.\s(.*)/);
      const bulletListMatch = currentLine.match(/^[-*]\s(.*)/);

      if (numberedListMatch) {
        // It's a numbered list item
        const currentNumber = parseInt(numberedListMatch[1], 10);
        const nextNumber = currentNumber + 1;

        // If the line is empty except for the number, remove the list marker
        if (numberedListMatch[2].trim() === "") {
          // Remove the list marker and don't continue the list
          e.preventDefault();
          const beforeCursor = content.substring(0, lineStart);
          const afterCursor = content.substring(cursorPos);
          const newContent = beforeCursor + afterCursor;

          setCurrentNote({ ...currentNote, content: newContent });

          // Set cursor position after update
          setTimeout(() => {
            textarea.focus();
            const newCursorPos = lineStart;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        } else {
          // Continue the list with the next number
          e.preventDefault();
          const indent = " ".repeat(nextNumber > 9 ? 0 : 1); // Align text for single/double digits
          const insertText = `\n${nextNumber}.${indent}`;

          const beforeCursor = content.substring(0, cursorPos);
          const afterCursor = content.substring(cursorPos);
          const newContent = beforeCursor + insertText + afterCursor;

          setCurrentNote({ ...currentNote, content: newContent });

          // Set cursor position after update
          setTimeout(() => {
            textarea.focus();
            const newCursorPos = cursorPos + insertText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        }
      } else if (bulletListMatch) {
        // It's a bullet list item
        // If the line is empty except for the bullet, remove the list marker
        if (bulletListMatch[1].trim() === "") {
          // Remove the bullet marker and don't continue the list
          e.preventDefault();
          const beforeCursor = content.substring(0, lineStart);
          const afterCursor = content.substring(cursorPos);
          const newContent = beforeCursor + afterCursor;

          setCurrentNote({ ...currentNote, content: newContent });

          // Set cursor position after update
          setTimeout(() => {
            textarea.focus();
            const newCursorPos = lineStart;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        } else {
          // Continue the bullet list
          e.preventDefault();
          const insertText = "\n- ";

          const beforeCursor = content.substring(0, cursorPos);
          const afterCursor = content.substring(cursorPos);
          const newContent = beforeCursor + insertText + afterCursor;

          setCurrentNote({ ...currentNote, content: newContent });

          // Set cursor position after update
          setTimeout(() => {
            textarea.focus();
            const newCursorPos = cursorPos + insertText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        }
      }
    }
  };

  // Text formatting functions
  const handleFormatText = (formatType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentNote.content.substring(start, end);

    if (start === end) {
      // No selection, just place formatting markers for user to type between
      let formattedText = "";

      switch (formatType) {
        case "bold":
          formattedText = "**Bold text**";
          break;
        case "italic":
          formattedText = "*Italic text*";
          break;
        case "numbered-list":
          formattedText = "1. ";
          break;
        case "bullet-list":
          formattedText = "- ";
          break;
        default:
          return;
      }

      const newContent =
        currentNote.content.substring(0, start) +
        formattedText +
        currentNote.content.substring(end);

      setCurrentNote({ ...currentNote, content: newContent });

      // Set cursor position after the formatting marker
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + formattedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // Format the selected text
      let formattedText = "";

      switch (formatType) {
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          break;
        case "numbered-list":
          // Split by newlines and add numbers
          formattedText = selectedText
            .split("\n")
            .map((line, i) => `${i + 1}. ${line}`)
            .join("\n");
          break;
        case "bullet-list":
          // Split by newlines and add bullets
          formattedText = selectedText
            .split("\n")
            .map((line) => `- ${line}`)
            .join("\n");
          break;
        default:
          return;
      }

      const newContent =
        currentNote.content.substring(0, start) +
        formattedText +
        currentNote.content.substring(end);

      setCurrentNote({ ...currentNote, content: newContent });

      // Set selection to include the formatting markers
      setTimeout(() => {
        textarea.focus();
        if (formatType === "bold" || formatType === "italic") {
          textarea.setSelectionRange(start, start + formattedText.length);
        } else {
          // For lists, just place cursor at the end
          const newCursorPos = start + formattedText.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const handleCursorPosition = (e) => {
    setCursorPosition(e.target.selectionStart);
  }; // Handler for cover image upload
  const handleCoverImageUpload = (imageUrl) => {
    // Store the imageUrl in the cover_image field to match backend
    setCurrentNote({ ...currentNote, cover_image: imageUrl });
  };

  // Handler for cover image removal
  const handleCoverImageRemove = () => {
    setCurrentNote({ ...currentNote, cover_image: null });
  };

  const handleToggleSelectAll = () => {
    if (selectedNotes.length === filteredNotes.length) {
      // If all are selected, unselect all
      setSelectedNotes([]);
    } else {
      // Otherwise select all
      setSelectedNotes(filteredNotes.map((note) => note.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedNotes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((noteId) => noteId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const handleDeleteSelected = async () => {
    if (!selectedNotes.length) return;

    try {
      // If in trash view, permanently delete the selected notes
      if (activeFilter === "trash") {
        // Ask for confirmation when permanently deleting multiple notes
        const confirmDelete = window.confirm(
          `Are you sure you want to permanently delete ${selectedNotes.length} notes? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        const promises = selectedNotes.map((id) => noteService.deleteNote(id));
        await Promise.all(promises);
        toast.success(`${selectedNotes.length} notes permanently deleted`);
      } else {
        // Move selected notes to trash
        const promises = selectedNotes.map((id) => noteService.moveToTrash(id));
        await Promise.all(promises);
        toast.success(`${selectedNotes.length} notes moved to trash`);
      }

      // Update local state
      setNotes(notes.filter((note) => !selectedNotes.includes(note.id)));
      setSelectedNotes([]);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Error deleting selected notes:", error);
      toast.error("Failed to delete selected notes");
    }
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedNotes([]);
    }
  };

  // Function to insert image at current cursor position or at the end of content
  const handleInsertImage = (imageUrl) => {
    if (!currentNote) return;

    const textarea = textareaRef.current;
    const imageMarkup = `\n<img src="${imageUrl}" alt="Note image" />\n`;

    let newContent;

    // If textarea is available and focused, insert at cursor position
    if (textarea && document.activeElement === textarea) {
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;

      newContent =
        currentNote.content.substring(0, startPos) +
        imageMarkup +
        currentNote.content.substring(endPos);

      // Update cursor position after insertion
      setCursorPosition(startPos + imageMarkup.length);
    } else {
      // Insert at the end of content
      newContent = currentNote.content
        ? currentNote.content + imageMarkup
        : imageMarkup;
    }

    setCurrentNote({
      ...currentNote,
      content: newContent,
    });

    toast.success("Image inserted into note");
  };

  return (
    <div className="notes-page page">
      <div className="container">
        <div className="notes-header">
          <h1>Notes</h1>
          {!isSelectionMode && (
            <button
              className="btn-primary add-note-btn"
              onClick={handleCreateNote}
            >
              <FiPlus /> New Note
            </button>
          )}
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

          {/* Selection actions below filter bar */}
          {isSelectionMode && (
            <div className="selection-actions-bar">
              <span className="selected-count">
                {selectedNotes.length} selected
              </span>
              <button className="btn-secondary" onClick={handleToggleSelectAll}>
                {selectedNotes.length === filteredNotes.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <button
                className="btn-danger btn-permanent-delete"
                onClick={handleDeleteSelected}
                disabled={selectedNotes.length === 0}
              >
                Delete Permanently
              </button>
              <button
                className="btn-secondary"
                onClick={handleToggleSelectionMode}
              >
                Cancel
              </button>
            </div>
          )}

          {activeFilter === "trash" &&
            filteredNotes.length > 0 &&
            !isSelectionMode && (
              <div className="trash-actions">
                <button
                  className="btn-secondary"
                  onClick={handleToggleSelectionMode}
                >
                  Select Notes
                </button>
              </div>
            )}
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
            </div>{" "}
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
                {" "}
                <ImageUploader
                  currentCoverImage={currentNote.cover_image}
                  onImageUpload={handleCoverImageUpload}
                  onImageRemove={handleCoverImageRemove}
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
                <TextFormatToolbar
                  onFormat={handleFormatText}
                  previewMode={previewMode}
                  onTogglePreview={handleTogglePreview}
                  content={currentNote?.content || ""}
                  cursorPosition={cursorPosition}
                  onImageInsert={handleInsertImage}
                />
                {previewMode ? (
                  <div
                    className="note-content-preview"
                    dangerouslySetInnerHTML={{
                      __html: formatText(currentNote.content),
                    }}
                  ></div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    name="content"
                    placeholder="Start typing your note... Use toolbar above to format text"
                    value={currentNote.content}
                    onChange={handleNoteChange}
                    onSelect={handleCursorChange}
                    onClick={handleCursorChange}
                    onKeyUp={handleCursorChange}
                    className="note-content-input"
                    rows="12"
                    onKeyDown={handleKeyDown}
                  ></textarea>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div key={note.id} className="note-card-wrapper">
                  {isSelectionMode && (
                    <div
                      className="checkbox-wrapper"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(note.id);
                      }}
                    >
                      {selectedNotes.includes(note.id) ? (
                        <FiCheckSquare className="checkbox checked" />
                      ) : (
                        <FiSquare className="checkbox" />
                      )}
                    </div>
                  )}
                  <NoteCard
                    note={note}
                    onDelete={handleDeleteNote}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={handleEditNote}
                    onRestore={handleRestoreNote}
                    inTrashView={activeFilter === "trash"}
                  />
                </div>
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
