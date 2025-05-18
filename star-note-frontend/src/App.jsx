import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./pages/Landing/LandingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AuthPage from "./pages/Auth/AuthPage";
import NotesPage from "./pages/Notes/NotesPage";
import PomodoroPage from "./pages/Pomodoro/PomodoroPage";
import FlashcardsPage from "./pages/Flashcards/FlashcardsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication - in a real app, this would be handled via a proper auth system
  useEffect(() => {
    const user = localStorage.getItem("starnote-user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("starnote-user", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("starnote-user");
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <div className="app">
        <div className="star-bg"></div>
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={<DashboardPage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/auth"
            element={
              <AuthPage
                onLogin={handleLogin}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/notes"
            element={<NotesPage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/pomodoro"
            element={<PomodoroPage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/flashcards"
            element={<FlashcardsPage isAuthenticated={isAuthenticated} />}
          />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
