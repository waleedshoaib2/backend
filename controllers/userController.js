import mongoose from "mongoose";
import User from "../models/userModel.js"; // Import your user model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config(); // Add this at the top of your controller file
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};
export const signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phoneNumber,
      address,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created!" });
  } catch (error) {
    next(error);
  }
};
export const logout = (req, res) => {
  // Client-side token clearing is a common approach
  res.json({ message: "Logout successful (client-side)" });
};

export const profile = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found bhai jaan" });
    }

    // Omit password hash
    const { password, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    // Check if the current user is an admin (you'll need middleware to authorize this)
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const users = await User.find({}, { password: 0 }); // Exclude the password field

    res.json(users);
  } catch (error) {
    next(error);
  }
};
export const updatePassword = async (req, res, next) => {
  try {
    const { userId } = req.user; // Get user ID from authenticated request
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
