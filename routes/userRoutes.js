import express from "express";

import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  signup,
  login,
  logout,
  profile,
  getAllUsers,
  updatePassword,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/profile", checkAuth, profile);

// Admin-only route
router.get(
  "/all-users",
  checkAuth,
  isAdmin,
  getAllUsers
  // Controller function for fetching all users
);

router.put("/update/:id", checkAuth, updatePassword);
export default router;
