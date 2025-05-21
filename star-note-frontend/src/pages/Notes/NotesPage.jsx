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
} from "react-icons/fi";
import NoteCard from "../../components/NoteCard/NoteCard";
import TextFormatToolbar from "../../components/TextFormatToolbar/TextFormatToolbar";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import { formatText } from "../../utils/formatText";
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
  useEffect(() => {    // Mock data
    const mockNotes = [
      {
        id: "1",
        title: "Meeting Notes: Project Kickoff",
        content:
          "**Project Timeline Discussion:**\n\n1. Design phase - 2 weeks\n2. Development - 6 weeks\n3. Testing - 2 weeks\n4. Review and launch - 1 week\n\n**Team Assignments:**\n- Sarah: UI/UX design\n- Mike: Backend development\n- Lisa: Frontend implementation\n- Alex: QA testing",
        category: "Work",
        isFavorite: true,
        updatedAt: new Date().toISOString(),
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      },
      {
        id: "2",
        title: "React Hooks Cheatsheet",
        content:
          "**Basic Hooks:**\n- *useState* - State management\n- *useEffect* - Side effects\n- *useContext* - Context API\n\n**Additional Hooks:**\n- *useReducer* - Complex state logic\n- *useMemo* - Memoize values\n- *useCallback* - Memoize functions\n- *useRef* - Persist values between renders",
        category: "Programming",
        isFavorite: false,
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        coverImage: "https://res.cloudinary.com/demo/image/upload/v1312461204/code-sample.jpg",
      },
      {
        id: "3",
        title: "Books to Read",
        content: "1. *Atomic Habits* by James Clear\n2. *Deep Work* by Cal Newport\n3. *The Psychology of Money* by Morgan Housel\n4. *Thinking, Fast and Slow* by Daniel Kahneman",
        category: "Personal",
        isFavorite: false,
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "4",
        title: "Project Ideas",
        content:
          "**Website Projects:**\n- Personal portfolio redesign\n- Blog with CMS integration\n\n**App Concepts:**\n- Productivity tracker with analytics\n- Recipe manager with meal planning\n- Budgeting tool with visual reports",
        category: "Ideas",
        isFavorite: true,
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: "5",
        title: "CSS Grid Reference",
        content:
          "**Container Properties:**\n- *grid-template-columns*\n- *grid-template-rows*\n- *grid-template-areas*\n- *grid-gap*\n\n**Item Properties:**\n- *grid-column*\n- *grid-row*\n- *grid-area*",
        category: "Programming",
        isFavorite: false,
        updatedAt: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: "6",
        title: "Grocery List",
        content: "**Fruits & Vegetables:**\n- Apples\n- Spinach\n- Carrots\n\n**Dairy & Proteins:**\n- Milk\n- Eggs\n- Chicken\n\n**Grains:**\n- Rice\n- Bread\n- Pasta",
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
      coverImage: null,
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
    setPreviewMode(prevMode => !prevMode);
  };

  // Handle keydown events in the textarea
  const handleKeyDown = (e) => {
    // Only process Enter key
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      const content = currentNote.content;
      const cursorPos = textarea.selectionStart;

      // Find the start of the current line
      let lineStart = content.lastIndexOf('\n', cursorPos - 1) + 1;
      const currentLine = content.substring(lineStart, cursorPos);

      // Check if the current line is a list item
      const numberedListMatch = currentLine.match(/^(\d+)\.\s(.*)/);
      const bulletListMatch = currentLine.match(/^[-*]\s(.*)/);

      if (numberedListMatch) {
        // It's a numbered list item
        const currentNumber = parseInt(numberedListMatch[1], 10);
        const nextNumber = currentNumber + 1;

        // If the line is empty except for the number, remove the list marker
        if (numberedListMatch[2].trim() === '') {
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
          const indent = ' '.repeat(nextNumber > 9 ? 0 : 1); // Align text for single/double digits
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
        if (bulletListMatch[1].trim() === '') {
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
          const insertText = '\n- ';

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
            .map(line => `- ${line}`)
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
  };

  // Add new handler for cover image upload
  const handleCoverImageUpload = (imageUrl) => {
    setCurrentNote({ ...currentNote, coverImage: imageUrl });
  };

  // Add new handler for cover image removal
  const handleCoverImageRemove = () => {
    setCurrentNote({ ...currentNote, coverImage: null });
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
              className={`filter-tab ${activeFilter === "favorites" ? "active" : ""
                }`}
              onClick={() => handleFilterChange("favorites")}
            >
              <FiStar /> Favorites
            </button>
            <button
              className={`filter-tab ${activeFilter === "trash" ? "active" : ""
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
            </div>            <div className="editor-form">
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
                <ImageUploader 
                  currentCoverImage={currentNote.coverImage}
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
              </div><div className="form-group">
                <TextFormatToolbar
                  onFormat={handleFormatText}
                  previewMode={previewMode}
                  onTogglePreview={handleTogglePreview}
                  content={currentNote?.content || ""}
                  cursorPosition={cursorPosition}
                />
                {previewMode ? (
                  <div
                    className="note-content-preview"
                    dangerouslySetInnerHTML={{ __html: formatText(currentNote.content) }}
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
