import api from "./api";

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  // Login a user and store token
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);

    // Store the token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("starnote-user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout a user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("starnote-user");
  },

  // Get current user from local storage
  getCurrentUser: () => {
    const userString = localStorage.getItem("starnote-user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem("token") !== null;
  },
};

export default authService;
