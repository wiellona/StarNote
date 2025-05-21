import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import UserProfile from "../UserProfile/UserProfile";
import "./Header.css";

const Header = ({ isAuthenticated, onLogout }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
  };  return (
    <header className="header">
      <div className={`container header-content ${isAuthenticated ? 'authenticated' : ''}`}>
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="logo">
          <span className="logo-icon">✦</span>
          StarNote
        </Link><div className={`nav-container ${menuOpen ? "active" : ""}`}>          <nav className="nav">
            {!isAuthenticated && (
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            )}

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
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {darkMode ? <FiSun /> : <FiMoon />}
                </button>
              </>
            )}
          </nav>

          <div className="header-actions">
            {!isAuthenticated && (
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
            )}            {isAuthenticated ? (
              <>
                <button 
                  className="profile-btn" 
                  onClick={() => {
                    setProfileOpen(true);
                    setMenuOpen(false);
                  }} 
                  aria-label="Edit profile"
                >
                  <FiUser />
                </button>
                <button className="btn-primary auth-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
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
      
      {/* User Profile Popup */}
      <UserProfile 
        isOpen={profileOpen} 
        onClose={() => setProfileOpen(false)} 
      />
    </header>
  );
};

export default Header;
