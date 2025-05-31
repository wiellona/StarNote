import { useState } from "react";
import { FiTrash, FiEdit } from "react-icons/fi";
import "./Flashcard.css";

const Flashcard = ({ flashcard, onDelete, onEdit }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(flashcard._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(flashcard);
  };
  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={handleFlip}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="flashcard-content">{flashcard.question}</div>
          <div className="flashcard-actions">
            <button
              className="edit-btn"
              onClick={handleEdit}
              aria-label="Edit flashcard"
              type="button"
            >
              <FiEdit size={16} />
            </button>
            <button
              className="delete-btn"
              onClick={handleDelete}
              aria-label="Delete flashcard"
              type="button"
            >
              <FiTrash size={16} />
            </button>
          </div>{" "}
          <div className="flashcard-footer">
            <div className="flashcard-category">{flashcard.category}</div>
            <div className="flashcard-indicator">Click to flip</div>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-content">{flashcard.answer}</div>

          <div className="flashcard-actions">
            <button
              className="edit-btn"
              onClick={handleEdit}
              aria-label="Edit flashcard"
              type="button"
            >
              <FiEdit size={16} />
            </button>
            <button
              className="delete-btn"
              onClick={handleDelete}
              aria-label="Delete flashcard"
              type="button"
            >
              <FiTrash size={16} />
            </button>
          </div>

          <div className="flashcard-footer">
            <div className="flashcard-category">{flashcard.category}</div>
            <div className="flashcard-indicator">Click to flip</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
