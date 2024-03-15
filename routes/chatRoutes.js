import express from "express";
import {
  createChat,
  sendMessage,
  getMessages,
  getChatForUser,
  getAllChats,
} from "../controllers/chatController.js";
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Create a new chat
router.post("/chats", checkAuth, createChat);

router.post("/chats/:chatId/messages", checkAuth, sendMessage);

router.get("/chats/:chatId/messages", checkAuth, getMessages);

router.get("/chats/me", checkAuth, getChatForUser);

router.get("/chats", checkAuth, isAdmin, getAllChats);

export default router;
