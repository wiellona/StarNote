import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { authService } from "../../utils/authService";
import { toast } from "react-hot-toast";
import "./AuthPage.css";

const AuthPage = ({ onLogin, isAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        let userData;

        if (isSignUp) {
          // Register new user
          userData = await authService.register({
            username: formData.name,
            email: formData.email,
            password: formData.password,
          });
          toast.success("Account created successfully");

          // After registration, automatically log in
          await authService.login({
            email: formData.email,
            password: formData.password,
          });
        } else {
          // Login existing user
          userData = await authService.login({
            email: formData.email,
            password: formData.password,
          });
          toast.success("Login successful");
        }

        onLogin(userData.user);
        navigate("/dashboard");
      } catch (error) {
        console.error("Authentication error:", error);
        const errorMessage =
          error.response?.data?.message ||
          (isSignUp ? "Registration failed" : "Login failed");
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isSignUp ? "Create an Account" : "Welcome Back"}</h2>
            <p>
              {isSignUp
                ? "Join StarNote and organize your thoughts"
                : "Sign in to continue to StarNote"}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="name">
                  <FiUser className="input-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock className="input-icon" />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            {!isSignUp && (
              <div className="form-action forgot-password">
                <a href="#reset">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn-primary auth-submit">
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="auth-separator">
            <span>OR</span>
          </div>

          <div className="auth-alternate">
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              type="button"
              className="btn-secondary toggle-auth"
              onClick={toggleAuthMode}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
