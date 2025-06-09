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
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const params = {
      user_id: userId, // Always include user_id
    };
    if (category && category !== "All") params.category = category;
    if (search) params.search = search;

    const response = await api.get("/flashcards", { params });
    return response.data;
  },

  // Get a single flashcard
  getFlashcard: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.get(`/flashcards/${id}`, {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Create a new flashcard
  createFlashcard: async (flashcardData) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    // Include user_id in the flashcard data
    const flashcardWithUser = {
      ...flashcardData,
      user_id: userId,
    };
    const response = await api.post("/flashcards", flashcardWithUser);
    return response.data;
  },

  // Update a flashcard
  updateFlashcard: async (id, flashcardData) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    // Include user_id in the flashcard data
    const flashcardWithUser = {
      ...flashcardData,
      user_id: userId,
    };
    const response = await api.put(`/flashcards/${id}`, flashcardWithUser);
    return response.data;
  },

  // Delete a flashcard
  deleteFlashcard: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.delete(`/flashcards/${id}`, {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.get("/flashcards/categories/list", {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Toggle favorite status
  toggleFavorite: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.put(`/flashcards/${id}/favorite`, {
      user_id: userId,
    });
    return response.data;
  },

  // Move to trash
  moveToTrash: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.put(`/flashcards/${id}/trash`, {
      user_id: userId,
    });
    return response.data;
  },

  // Restore from trash
  restoreFromTrash: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.put(`/flashcards/${id}/restore`, {
      user_id: userId,
    });
    return response.data;
  },

  // Empty trash
  emptyTrash: async () => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.delete("/flashcards/trash/empty", {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Track flashcard review
  trackReview: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.put(`/flashcards/${id}/review`, {
      user_id: userId,
    });
    return response.data;
  },

  // Add image to flashcard
  addImage: async (id, fileUrl) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.post(`/flashcards/${id}/image`, {
      file_url: fileUrl,
      user_id: userId,
    });
    return response.data;
  },

  // Get all images for a flashcard
  getImages: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.get(`/flashcards/${id}/images`, {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Get flashcard statistics for dashboard
  getFlashcardStats: async () => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.get("/flashcards/stats", {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Batch import flashcards
  importFlashcards: async (flashcardsData) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.post("/flashcards/batch", {
      flashcards: flashcardsData,
      user_id: userId,
    });
    return response.data;
  },

  // Export all flashcards
  exportFlashcards: async () => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.get("/flashcards/export", {
      params: { user_id: userId },
    });
    return response.data;
  },
};

// Note API services
export const noteService = {
  // Get all notes with optional filters
  getAllNotes: async (status, search) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const params = {
      user_id: userId, // Always include user_id
    };
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await api.get("/notes", { params });
    return response.data;
  }, // Get a single note
  getNote: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.get(`/notes/${id}`, {
      params: { user_id: userId },
    });
    return response.data;
  }, // Create a new note
  createNote: async (noteData) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    // Include user_id in the note data
    const noteWithUser = {
      ...noteData,
      user_id: userId,
    };
    const response = await api.post("/notes", noteWithUser);
    return response.data;
  }, // Update a note
  updateNote: async (id, noteData) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    // Include user_id in the note data
    const noteWithUser = {
      ...noteData,
      user_id: userId,
    };
    const response = await api.put(`/notes/${id}`, noteWithUser);
    return response.data;
  },
  // Delete a note
  deleteNote: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.delete(`/notes/${id}`, {
      params: { user_id: userId },
    });
    return response.data;
  }, // Toggle favorite status
  toggleFavorite: async (id, isFavorite) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    // Use the /favorite endpoint which will toggle the favorite status
    const response = await api.put(`/notes/${id}/favorite`, {
      user_id: userId,
    });
    return response.data;
  },
  // Move to trash
  moveToTrash: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    // Use the /trash endpoint to move to trash
    const response = await api.put(`/notes/${id}/trash`, {
      user_id: userId,
    });
    return response.data;
  },
  // Restore from trash
  restoreFromTrash: async (id) => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    // Use the /restore endpoint to restore from trash
    const response = await api.put(`/notes/${id}/restore`, {
      user_id: userId,
    });
    return response.data;
  },
  // Get note statistics for dashboard
  getNoteStats: async () => {
    // Get user from starnote-user in localStorage
    const userJson = localStorage.getItem("starnote-user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? user.id : null;

    const response = await api.get("/notes/stats", {
      params: { user_id: userId },
    });
    return response.data;
  },
};

export default api;
