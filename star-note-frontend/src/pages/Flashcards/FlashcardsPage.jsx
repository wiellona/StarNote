import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiX,
  FiSave,
  FiPlay,
  FiPause,
  FiTrash,
  FiEdit,
} from "react-icons/fi";
import Flashcard from "../../components/Flashcard/Flashcard";
import { flashcardService } from "../../utils/api";
import { toast } from "react-hot-toast";
import "./FlashcardsPage.css";

const FlashcardsPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [categories, setCategories] = useState([
    "All",
    "Math",
    "Science",
    "History",
    "Language",
    "Programming",
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Fetch flashcards from API
  const fetchFlashcards = async () => {
    try {
      const data = await flashcardService.getAllFlashcards(
        activeCategory !== "All" ? activeCategory : null,
        searchTerm || null
      );
      setFlashcards(data);
      setFilteredCards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      toast.error("Failed to load flashcards");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await flashcardService.getCategories();
      setCategories(["All", ...data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Keep default categories if API call fails
    }
  };

  // Initial data loading
  useEffect(() => {
    if (isAuthenticated) {
      fetchFlashcards();
      fetchCategories();
    }
  }, [isAuthenticated]);

  // Re-fetch when search or category changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchFlashcards();
    }
  }, [activeCategory, searchTerm, isAuthenticated]);

  useEffect(() => {
    let result = [...flashcards];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (card) =>
          card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (activeCategory !== "All") {
      result = result.filter((card) => card.category === activeCategory);
    }

    setFilteredCards(result);
  }, [flashcards, searchTerm, activeCategory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  const handleCreateCard = () => {
    const newCard = {
      question: "",
      answer: "",
      category: "Programming",
    };

    setCurrentCard(newCard);
    setIsEditing(true);
    setIsStudyMode(false);
  };

  const handleEditCard = (card) => {
    setCurrentCard({ ...card });
    setIsEditing(true);
    setIsStudyMode(false);
  };
  const handleDeleteCard = async (id) => {
    try {
      await flashcardService.deleteFlashcard(id);
      setFlashcards(flashcards.filter((card) => card._id !== id));
      setFilteredCards(filteredCards.filter((card) => card._id !== id));
      toast.success("Flashcard deleted successfully");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      toast.error("Failed to delete flashcard");
    }
  };
  const handleSaveCard = async () => {
    if (!currentCard.question.trim() || !currentCard.answer.trim()) {
      toast.error("Please provide both a question and an answer");
      return;
    }

    try {
      let savedCard;

      if (currentCard._id) {
        // Update existing card
        savedCard = await flashcardService.updateFlashcard(currentCard._id, {
          question: currentCard.question,
          answer: currentCard.answer,
          category: currentCard.category,
        });

        setFlashcards(
          flashcards.map((card) =>
            card._id === currentCard._id ? savedCard : card
          )
        );
        toast.success("Flashcard updated successfully");
      } else {
        // Create new card
        savedCard = await flashcardService.createFlashcard({
          question: currentCard.question,
          answer: currentCard.answer,
          category: currentCard.category,
        });

        setFlashcards([...flashcards, savedCard]);
        toast.success("Flashcard created successfully");
      }

      setIsEditing(false);
      setCurrentCard(null);

      // Refresh the list to ensure we have the latest data
      fetchFlashcards();
    } catch (error) {
      console.error("Error saving flashcard:", error);
      toast.error("Failed to save flashcard");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentCard(null);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCurrentCard({ ...currentCard, [name]: value });
  };

  const startStudyMode = () => {
    if (filteredCards.length === 0) return;

    setIsStudyMode(true);
    setIsEditing(false);
    setCurrentStudyIndex(0);
  };

  const stopStudyMode = () => {
    setIsStudyMode(false);
    setCurrentStudyIndex(0);
  };
  const nextCard = async () => {
    const currentCardId = filteredCards[currentStudyIndex]._id;
    try {
      // Track that the card has been reviewed
      await flashcardService.trackReview(currentCardId);
    } catch (error) {
      console.error("Error tracking flashcard review:", error);
    }

    // Move to the next card
    setCurrentStudyIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const prevCard = () => {
    setCurrentStudyIndex(
      (prev) => (prev - 1 + filteredCards.length) % filteredCards.length
    );
  };

  return (
    <div className="flashcards-page page">
      <div className="container">
        <div className="flashcards-header">
          <h1>Flashcards</h1>
          <div className="header-actions">
            {filteredCards.length > 0 && !isEditing && !isStudyMode && (
              <button
                className="btn-secondary study-btn"
                onClick={startStudyMode}
              >
                <FiPlay /> Study Mode
              </button>
            )}
            {isStudyMode && (
              <button
                className="btn-secondary exit-study-btn"
                onClick={stopStudyMode}
              >
                <FiPause /> Exit Study
              </button>
            )}
            <button
              className="btn-primary add-card-btn"
              onClick={handleCreateCard}
            >
              <FiPlus /> New Card
            </button>
          </div>
        </div>

        {!isStudyMode && (
          <div className="flashcards-filters">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search flashcards..."
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

            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-filter ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="card-editor">
            <div className="editor-header">
              <h2>{currentCard.id ? "Edit Flashcard" : "New Flashcard"}</h2>
              <div className="editor-actions">
                <button className="btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveCard}>
                  <FiSave /> Save
                </button>
              </div>
            </div>

            <div className="editor-form">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={currentCard.category}
                  onChange={handleCardChange}
                  className="category-select"
                >
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="question">Question</label>
                <textarea
                  id="question"
                  name="question"
                  placeholder="Enter the question"
                  value={currentCard.question}
                  onChange={handleCardChange}
                  className="card-textarea"
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="answer">Answer</label>
                <textarea
                  id="answer"
                  name="answer"
                  placeholder="Enter the answer"
                  value={currentCard.answer}
                  onChange={handleCardChange}
                  className="card-textarea"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>
        ) : isStudyMode ? (
          <div className="study-mode">
            <div className="study-progress">
              <div className="progress-text">
                Card {currentStudyIndex + 1} of {filteredCards.length}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((currentStudyIndex + 1) / filteredCards.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {filteredCards.length > 0 && (
              <div className="study-card-container">
                <Flashcard
                  flashcard={filteredCards[currentStudyIndex]}
                  onDelete={handleDeleteCard}
                  onEdit={handleEditCard}
                />

                <div className="study-controls">
                  <button className="study-btn prev-btn" onClick={prevCard}>
                    Previous
                  </button>
                  <button className="study-btn next-btn" onClick={nextCard}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flashcards-grid">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <Flashcard
                  key={card._id}
                  flashcard={card}
                  onDelete={handleDeleteCard}
                  onEdit={handleEditCard}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>
                  {searchTerm
                    ? `No flashcards found matching "${searchTerm}"`
                    : activeCategory !== "All"
                    ? `No flashcards in the "${activeCategory}" category`
                    : "No flashcards yet. Create your first flashcard!"}
                </p>
                <button className="btn-primary" onClick={handleCreateCard}>
                  <FiPlus /> Create Flashcard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardsPage;
