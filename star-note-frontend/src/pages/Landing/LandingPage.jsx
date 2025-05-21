import { useNavigate } from "react-router-dom";
import { FiFileText, FiClock, FiLayers, FiStar } from "react-icons/fi";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Organize Your Thoughts Among the Stars</h1>
            <p>
              StarNote is your all-in-one productivity solution for notes,
              flashcards, and time management. Beautifully designed for clarity
              and focus.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate("/auth")}>
                Get Started — It's Free
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-container">
              <span className="star star-1">✦</span>
              <span className="star star-2">✧</span>
              <span className="star star-3">✦</span>
              <img
                src="https://images.pexels.com/photos/6956903/pexels-photo-6956903.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="StarNote App"
                className="screenshot"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">
            <span className="highlight">Features</span> that make a difference
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiFileText />
              </div>
              <h3>Smart Notes</h3>
              <p>
                Create, edit, and organize your notes with our intuitive editor.
                Add tags, categories, and favorites for easy retrieval.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiLayers />
              </div>
              <h3>Flashcards</h3>
              <p>
                Transform your notes into interactive flashcards. Perfect for
                studying and memorization with spaced repetition.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiClock />
              </div>
              <h3>Pomodoro Timer</h3>
              <p>
                Stay focused and manage your time effectively with our built-in
                Pomodoro timer. Track your productivity streaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">
            Loved by <span className="highlight">thousands</span> students
          </h2>

          <div className="testimonials-carousel">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "I use the Pomodoro timer daily. It's helped me stay focused and
                get more done in less time."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <div className="avatar-placeholder">WD</div>
                </div>
                <div className="testimonial-info">
                  <h4>Wiellona Darlene</h4>
                  <p>Software Developer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "StarNote has completely changed how I study. The flashcard
                feature is perfect for my exams!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <div className="avatar-placeholder">LF</div>
                </div>
                <div className="testimonial-info">
                  <h4>Laura Fawzia</h4>
                  <p>Computer Engineering Student</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★</div>
              <p className="testimonial-text">
                "The clean design and organization features make StarNote stand
                out. I can finally keep all my research in one place."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <div className="avatar-placeholder">KM</div>
                </div>
                <div className="testimonial-info">
                  <h4>Kim Minji</h4>
                  <p>PhD Researcher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-content">
          <h2>Ready to organize your thoughts?</h2>
          <p>
            Join thousands of users who boost their productivity with StarNote
          </p>
          <button className="btn-primary" onClick={() => navigate("/auth")}>
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
