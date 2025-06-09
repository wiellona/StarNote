import { useState, useEffect, useRef } from "react";
import { FiUser, FiX, FiSave, FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";
import { useUser } from "../../contexts/UserContext";
import { userService } from "../../utils/api";
import "./UserProfile.css";

const UserProfile = ({ isOpen, onClose }) => {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Initialize with user data or default values
  const [userData, setUserData] = useState({
    name: user?.username || "User",
    email: user?.email || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || null,
  });

  const [formData, setFormData] = useState({ ...userData });
  const modalRef = useRef();
  const fileInputRef = useRef();

  // Fetch fresh user data from database when modal opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (isOpen && user?.id) {
        setLoading(true);
        try {
          const freshUserData = await userService.getCurrentUser();
          const mappedData = {
            name: freshUserData.username || "User",
            email: freshUserData.email || "",
            bio: freshUserData.bio || "",
            profilePicture: freshUserData.profilePicture || null,
          };
          setUserData(mappedData);
          setFormData(mappedData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user data");
          // Fallback to existing user data
          const fallbackData = {
            name: user.username || "User",
            email: user.email || "",
            bio: user.bio || "",
            profilePicture: user.profilePicture || null,
          };
          setUserData(fallbackData);
          setFormData(fallbackData);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isOpen, user?.id]);

  // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile in database
      const response = await userService.updateProfile({
        username: formData.name,
        email: formData.email,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
      });

      // Update local state
      setUserData({ ...formData });

      // Update user in context with the response data
      const updatedUser = {
        ...user,
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        bio: response.user.bio,
        profilePicture: response.user.profilePicture,
      };

      updateUser(updatedUser);
      onClose();

      // Show success toast
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setUploadingImage(true);
      try {
        const response = await userService.uploadProfilePicture(file);

        // Update form data with new profile picture URL
        const newFormData = {
          ...formData,
          profilePicture: response.profilePicture,
        };
        setFormData(newFormData);
        setUserData(newFormData);

        // Update user in context
        const updatedUser = {
          ...user,
          ...response.user,
        };
        updateUser(updatedUser);

        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error(
          error.response?.data?.message || "Failed to upload profile picture"
        );
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Trigger file input click
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        <div className="profile-modal-header">
          <h2>
            <FiUser /> Edit Profile
          </h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>{" "}
        <form onSubmit={handleSubmit} className="profile-form">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner">Loading...</div>
            </div>
          )}

          <div className="profile-picture-container">
            <div
              className="profile-picture"
              style={{
                backgroundImage: formData.profilePicture
                  ? `url(${formData.profilePicture})`
                  : "none",
              }}
            >
              {!formData.profilePicture && (
                <FiUser className="default-profile-icon" />
              )}
            </div>
            <label className="upload-button">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-actions">
            {" "}
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary save-btn"
              disabled={loading}
            >
              <FiSave /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
