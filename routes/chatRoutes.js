import express from "express";
const router = express.Router();
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js"; // Import your authentication middleware
import { Message, Chat } from "../models/chatModel.js"; // Import your chat models

// 1. Create a new chat (Admin Only)
router.post("/api/chats/new", checkAuth, isAdmin, async (req, res) => {
  try {
    const { userId } = req.body;

    // Check for existing chat between admin and the user
    const existingChat = await Chat.findOne({
      admin: req.user._id,
      user: userId,
    });

    if (existingChat) {
      return res.status(400).json({ error: "Chat already exists" });
    }

    const newChat = new Chat({
      admin: req.user._id,
      user: userId,
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Get a specific chat
router.get("/api/chats/:chatId", checkAuth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("admin", "name")
      .populate("user", "name");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Authorization check (User or Admin in the chat only)
    if (
      chat.user.toString() !== req.user._id.toString() &&
      chat.admin.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Send a message in a chat
router.post("/api/chats/:chatId/messages", checkAuth, async (req, res) => {
  /* ... (Implementation from previous example) ... */
});

// 4. Get list of chats for a user
router.get("/api/chats", checkAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ admin: req.user._id }, { user: req.user._id }],
    })
      .populate("admin", "name")
      .populate("user", "name");

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
