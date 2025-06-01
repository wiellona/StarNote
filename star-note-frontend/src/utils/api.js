import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flashcard API services
export const flashcardService = {
  // Get all flashcards with optional filters
  getAllFlashcards: async (category, search) => {
    const params = {};
    if (category && category !== "All") params.category = category;
    if (search) params.search = search;

    const response = await api.get("/flashcards", { params });
    return response.data;
  },

  // Get a single flashcard
  getFlashcard: async (id) => {
    const response = await api.get(`/flashcards/${id}`);
    return response.data;
  },

  // Create a new flashcard
  createFlashcard: async (flashcardData) => {
    const response = await api.post("/flashcards", flashcardData);
    return response.data;
  },

  // Update a flashcard
  updateFlashcard: async (id, flashcardData) => {
    const response = await api.put(`/flashcards/${id}`, flashcardData);
    return response.data;
  },

  // Delete a flashcard
  deleteFlashcard: async (id) => {
    const response = await api.delete(`/flashcards/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get("/flashcards/categories/list");
    return response.data;
  },

  // Toggle favorite status
  toggleFavorite: async (id) => {
    const response = await api.put(`/flashcards/${id}/favorite`);
    return response.data;
  },

  // Move to trash
  moveToTrash: async (id) => {
    const response = await api.put(`/flashcards/${id}/trash`);
    return response.data;
  },

  // Restore from trash
  restoreFromTrash: async (id) => {
    const response = await api.put(`/flashcards/${id}/restore`);
    return response.data;
  },

  // Empty trash
  emptyTrash: async () => {
    const response = await api.delete("/flashcards/trash/empty");
    return response.data;
  },
  // Track flashcard review
  trackReview: async (id) => {
    const response = await api.put(`/flashcards/${id}/review`);
    return response.data;
  },

  // Add image to flashcard
  addImage: async (id, fileUrl) => {
    const response = await api.post(`/flashcards/${id}/image`, {
      file_url: fileUrl,
    });
    return response.data;
  },
  // Get all images for a flashcard
  getImages: async (id) => {
    const response = await api.get(`/flashcards/${id}/images`);
    return response.data;
  },
  // Get flashcard statistics for dashboard
  getFlashcardStats: async () => {
    const response = await api.get("/flashcards/stats");
    return response.data;
  },

  // Batch import flashcards
  importFlashcards: async (flashcardsData) => {
    const response = await api.post("/flashcards/batch", {
      flashcards: flashcardsData,
    });
    return response.data;
  },
  // Export all flashcards
  exportFlashcards: async () => {
    const response = await api.get("/flashcards/export");
    return response.data;
  },
};

// Note API services
export const noteService = {
  // Get all notes with optional filters
  getAllNotes: async (status, search) => {
    const params = {
      user_id: localStorage.getItem("userId"), // Always include user_id
    };
    if (status) params.status = status;
    if (search) params.search = search;

    const response = await api.get("/notes", { params });
    return response.data;
  },
  // Get a single note
  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`, {
      params: { user_id: localStorage.getItem("userId") },
    });
    return response.data;
  },
  // Create a new note
  createNote: async (noteData) => {
    // Include user_id in the note data
    const noteWithUser = {
      ...noteData,
      user_id: localStorage.getItem("userId"),
    };
    const response = await api.post("/notes", noteWithUser);
    return response.data;
  },
  // Update a note
  updateNote: async (id, noteData) => {
    // Include user_id in the note data
    const noteWithUser = {
      ...noteData,
      user_id: localStorage.getItem("userId"),
    };
    const response = await api.put(`/notes/${id}`, noteWithUser);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`, {
      params: { user_id: localStorage.getItem("userId") },
    });
    return response.data;
  }, // Toggle favorite status
  toggleFavorite: async (id, isFavorite) => {
    // Use the /favorite endpoint which will toggle the favorite status
    const response = await api.put(`/notes/${id}/favorite`, {
      user_id: localStorage.getItem("userId"),
    });
    return response.data;
  },

  // Move to trash
  moveToTrash: async (id) => {
    // Use the /trash endpoint to move to trash
    const response = await api.put(`/notes/${id}/trash`, {
      user_id: localStorage.getItem("userId"),
    });
    return response.data;
  },

  // Restore from trash
  restoreFromTrash: async (id) => {
    // Use the /restore endpoint to restore from trash
    const response = await api.put(`/notes/${id}/restore`, {
      user_id: localStorage.getItem("userId"),
    });
    return response.data;
  },

  // Get note statistics for dashboard
  getNoteStats: async () => {
    const response = await api.get("/notes/stats", {
      params: { user_id: localStorage.getItem("userId") },
    });
    return response.data;
  },
};

export default api;
