const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const User = require("../models/User");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save(); // Return success message and user info (without password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      username: user.username,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user - no auth middleware, user id passed as query param
router.get("/me", async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const { user_id, username, email, bio, profilePicture } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user_id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Check if username is being changed and if it's already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: user_id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    user.updatedAt = Date.now();
    await user.save();

    // Return updated user info (without password)
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile picture
router.post(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Check if user exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "star-note/profile-pictures",
              public_id: `user_${user_id}_${Date.now()}`,
              transformation: [
                { width: 300, height: 300, crop: "fill", gravity: "face" },
                { quality: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // Delete old profile picture from Cloudinary if exists
      if (user.profilePicture) {
        try {
          const publicId = user.profilePicture.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `star-note/profile-pictures/${publicId}`
          );
        } catch (deleteError) {
          console.log("Error deleting old profile picture:", deleteError);
        }
      }

      // Update user profile picture URL
      user.profilePicture = uploadResult.secure_url;
      user.updatedAt = Date.now();
      await user.save();

      res.json({
        message: "Profile picture uploaded successfully",
        profilePicture: uploadResult.secure_url,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Server error during upload" });
    }
  }
);

module.exports = router;
