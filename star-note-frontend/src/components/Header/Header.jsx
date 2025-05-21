import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import "./Header.css";

const Header = ({ isAuthenticated, onLogout }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = () => {
    navigate("/auth");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">✦</span>
          StarNote
        </Link>

        <div className={`nav-container ${menuOpen ? "active" : ""}`}>
          <nav className="nav">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/notes" onClick={() => setMenuOpen(false)}>
                  Notes
                </Link>
                <Link to="/flashcards" onClick={() => setMenuOpen(false)}>
                  Flashcards
                </Link>
                <Link to="/pomodoro" onClick={() => setMenuOpen(false)}>
                  Pomodoro
                </Link>
              </>
            )}
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            {isAuthenticated ? (
              <button className="btn-primary auth-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="btn-primary auth-btn" onClick={handleLogin}>
                Login
              </button>
            )}
          </div>
        </div>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
