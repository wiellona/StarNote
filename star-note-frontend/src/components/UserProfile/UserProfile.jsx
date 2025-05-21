import { useState, useEffect, useRef } from "react";
import { FiUser, FiX, FiSave } from "react-icons/fi";
import { useUser } from "../../contexts/UserContext";
import "./UserProfile.css";

const UserProfile = ({ isOpen, onClose }) => {
    const { user, updateUser } = useUser();

    // Initialize with user data or default values
    const [userData, setUserData] = useState({
        name: user?.name || "User",
        email: user?.email || "",
        bio: user?.bio || "I'm a productivity enthusiast who loves taking notes and organizing information.",
        profilePicture: user?.profilePicture || null
    });

    const [formData, setFormData] = useState({ ...userData });
    const modalRef = useRef();

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
    // Update userData when user changes
    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || "User",
                email: user.email || "",
                bio: user.bio || "I'm a productivity enthusiast who loves taking notes and organizing information.",
                profilePicture: user.profilePicture || null
            });
        }
    }, [user]);

    // Reset form data when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ ...userData });
        }
    }, [isOpen, userData]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Update local state
        setUserData({ ...formData });

        // Update user in context and localStorage
        const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email,
            bio: formData.bio,
            profilePicture: formData.profilePicture
        };

        updateUser(updatedUser);
        onClose();

        // Show success message
        alert("Profile updated successfully!");
    };

    // Handle profile picture upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="profile-modal-overlay">
            <div className="profile-modal" ref={modalRef}>
                <div className="profile-modal-header">
                    <h2><FiUser /> Edit Profile</h2>
                    <button className="close-button" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-picture-container">
                        <div
                            className="profile-picture"
                            style={{ backgroundImage: formData.profilePicture ? `url(${formData.profilePicture})` : 'none' }}
                        >
                            {!formData.profilePicture && <FiUser className="default-profile-icon" />}
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
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary save-btn">
                            <FiSave /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
