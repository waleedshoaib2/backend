import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", checkAuth, isAdmin, createCategory);

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

router.put("/:id", checkAuth, isAdmin, updateCategory);

router.delete("/:id", checkAuth, isAdmin, deleteCategory);

export default router;
