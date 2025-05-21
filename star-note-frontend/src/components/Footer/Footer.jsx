import { FiGithub, FiTwitter, FiInstagram } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <span className="footer-logo-icon">✦</span>
            StarNote
          </div>
          <p className="footer-tagline">
            Organize your thoughts among the stars!
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright">
            © {currentYear} StarNote. K2 Group 6 Sistem Basis Data.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/wiellona/StarNote"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
