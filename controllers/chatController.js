import { Message, Chat } from "../models/chatModel.js";
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";

async function createChat(req, res) {
  try {
    const userId = req.user._id;
    console.log(userId);

    // Find an admin user
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      return res.status(500).json({ error: "No admin found" });
    }

    let chat = await Chat.findOne({ user: userId });

    if (!chat) {
      // Fetch user data based on userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      chat = new Chat({
        admin: admin, // Assign the admin found earlier
        user: user,
        messages: [],
      });

      await chat.save();
    }

    res.status(200).json({ chatId: chat._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create chat" });
  }
}

// Function to send a message
async function sendMessage(req, res) {
  try {
    console.log("flhkdflhkdlklkhdsflkhsdflhksdlkhncklsdlkcklsdlkd");

    const { chatId } = req.params; // Extract chatId from params
    const { content } = req.body;
    const userId = req.user._id;

    const message = new Message({
      sender: userId,
      content,
    });

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
}

// Function to fetch chat messages
async function getMessages(req, res) {
  try {
    const { chatId } = req.params;
    console.log(chatId);

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get messages" });
  }
}

// Function to get a single chat for a user
async function getChatForUser(req, res) {
  try {
    const userId = req.user._id;
    console.log("goodie", userId);

    const chat = await Chat.findOne({ user: userId }).populate(
      "messages.sender"
    );

    console.log(chat);

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get chat" });
  }
}

// Function to get all chats (admin only)
async function getAllChats(req, res) {
  try {
    const chats = await Chat.find().populate("messages.sender");
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get chats" });
  }
}

export { createChat, sendMessage, getMessages, getChatForUser, getAllChats };
