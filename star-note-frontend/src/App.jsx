import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { authService } from "./utils/authService";
import { Toaster } from "react-hot-toast";
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

  // Check authentication status when app loads
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };
  return (
    <ThemeProvider>
      <UserProvider>
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
          <Toaster position="top-right" />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
