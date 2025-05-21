import { useState } from "react";
import { FiTrash, FiStar, FiEdit, FiMoreVertical, FiImage } from "react-icons/fi";
import { formatText, stripFormatting } from "../../utils/formatText";
import "./NoteCard.css";

const NoteCard = ({ note, onDelete, onToggleFavorite, onEdit }) => {
  const [showActions, setShowActions] = useState(false);

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions((prev) => !prev);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowActions(false);
    onEdit(note);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowActions(false);
    onDelete(note.id);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setShowActions(false);
    onToggleFavorite(note.id);
  };
  // Function to limit text length
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    // First strip formatting for accurate length calculation
    const plainText = stripFormatting(text);
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };
  return (
    <div className="note-card" onClick={handleEdit}>
      {note.coverImage && (
        <div className="note-cover-image">
          <img src={note.coverImage} alt={note.title} />
        </div>
      )}
      
      {note.category && <div className="note-category">{note.category}</div>}

      <h3 className="note-title">{truncateText(note.title, 50)}</h3>

      <div 
        className="note-content formatted-content"
        dangerouslySetInnerHTML={{ 
          __html: formatText(truncateText(note.content, 150)) 
        }}
      ></div>

      <div className="note-footer">
        <div className="note-date">
          {new Date(note.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>

        <div className="note-actions">
          <button
            className={`favorite-btn ${note.isFavorite ? "active" : ""}`}
            onClick={handleToggleFavorite}
            aria-label={
              note.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <FiStar />
          </button>

          <button
            className="edit-btn"
            onClick={handleEdit}
            aria-label="Edit note"
          >
            <FiEdit />
          </button>

          <button
            className="delete-btn"
            onClick={handleDelete}
            aria-label="Delete note"
          >
            <FiTrash />
          </button>

          <button
            className="more-btn"
            onClick={toggleActions}
            aria-label="More actions"
          >
            <FiMoreVertical />
          </button>

          {showActions && (
            <div className="dropdown-actions">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleToggleFavorite}>
                {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
              </button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
