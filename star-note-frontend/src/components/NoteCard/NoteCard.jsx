import { useState } from "react";
import {
  FiTrash,
  FiStar,
  FiEdit,
  FiMoreVertical,
  FiImage,
  FiRefreshCw, // Added refresh icon for restore function
} from "react-icons/fi";
import { formatText, stripFormatting } from "../../utils/formatText";
import "./NoteCard.css";

const NoteCard = ({
  note,
  onDelete,
  onToggleFavorite,
  onEdit,
  onRestore,
  inTrashView,
}) => {
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

  const handleRestore = (e) => {
    e.stopPropagation();
    setShowActions(false);
    onRestore(note.id);
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
    <div
      className={`note-card ${note.cover_image ? "with-cover" : ""}`}
      onClick={handleEdit}
    >
      {/* Cover image container */}
      {note.cover_image && (
        <div className="note-cover-image">
          <img src={note.cover_image} alt={note.title} />
        </div>
      )}

      {/* Card content with overlay for better readability */}
      <div className="note-card-content">
        {/* Top section with category */}
        <div className="note-card-top">
          {note.category && (
            <div className="note-category" data-category={note.category}>
              {note.category}
            </div>
          )}
        </div>

        {/* Middle section with title and content */}
        <div className="note-card-middle">
          <h3 className="note-title">{truncateText(note.title, 50)}</h3>
          <div
            className="note-content formatted-content"
            dangerouslySetInnerHTML={{
              __html: formatText(truncateText(note.content, 100)),
            }}
          ></div>
        </div>

        {/* Bottom section with date and actions */}
        <div className="note-footer">
          <div className="note-date">
            {new Date(note.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>{" "}
          <div className="note-actions">
            {!inTrashView && (
              <button
                className={`favorite-btn ${note.isFavorite ? "active" : ""}`}
                onClick={handleToggleFavorite}
                aria-label={
                  note.isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <FiStar />
              </button>
            )}
            {!inTrashView && (
              <button
                className="edit-btn"
                onClick={handleEdit}
                aria-label="Edit note"
              >
                <FiEdit />
              </button>
            )}
            {inTrashView && (
              <button
                className="restore-btn"
                onClick={handleRestore}
                aria-label="Restore note"
              >
                <FiRefreshCw />
              </button>
            )}
            <button
              className={`delete-btn ${inTrashView ? "permanent" : ""}`}
              onClick={handleDelete}
              aria-label={inTrashView ? "Delete permanently" : "Move to trash"}
              title={inTrashView ? "Delete permanently" : "Move to trash"}
            >
              <FiTrash />
            </button>
            <button
              className="more-btn"
              onClick={toggleActions}
              aria-label="More actions"
            >
              <FiMoreVertical />
            </button>{" "}
            {showActions && (
              <div className="dropdown-actions">
                {!inTrashView ? (
                  <>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleToggleFavorite}>
                      {note.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </button>
                    <button onClick={handleDelete}>Move to trash</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleRestore}>Restore</button>
                    <button onClick={handleDelete}>Delete permanently</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
