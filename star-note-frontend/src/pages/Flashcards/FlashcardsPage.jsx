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
} from "react-icons/fi";
import Flashcard from "../../components/Flashcard/Flashcard";
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

  // Mock data fetch - in a real app, this would come from an API
  useEffect(() => {
    // Mock data
    const mockFlashcards = [
      {
        id: "1",
        question: "What is React?",
        answer: "A JavaScript library for building user interfaces",
        category: "Programming",
      },
      {
        id: "2",
        question: "What is the capital of France?",
        answer: "Paris",
        category: "History",
      },
      {
        id: "3",
        question: "What is the formula for the area of a circle?",
        answer: "A = πr²",
        category: "Math",
      },
      {
        id: "4",
        question: "What is the difference between let and const in JavaScript?",
        answer: "let allows reassignment, const does not allow reassignment",
        category: "Programming",
      },
      {
        id: "5",
        question: "What are the first 10 digits of Pi?",
        answer: "3.1415926535",
        category: "Math",
      },
      {
        id: "6",
        question: 'What is the meaning of "bonjour"?',
        answer: "Hello (in French)",
        category: "Language",
      },
    ];

    setFlashcards(mockFlashcards);
    setFilteredCards(mockFlashcards);
  }, []);

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
      id: Date.now().toString(),
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

  const handleDeleteCard = (id) => {
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  const handleSaveCard = () => {
    if (!currentCard.question.trim() || !currentCard.answer.trim()) {
      alert("Please provide both a question and an answer");
      return;
    }

    const updatedCards = currentCard.id
      ? flashcards.map((card) =>
          card.id === currentCard.id ? currentCard : card
        )
      : [...flashcards, { ...currentCard, id: Date.now().toString() }];

    setFlashcards(updatedCards);
    setIsEditing(false);
    setCurrentCard(null);
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

  const nextCard = () => {
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
                  key={card.id}
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
