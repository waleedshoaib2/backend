import express from "express";
import {
  updateProduct,
  getProductById,
  createProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js"; // Import upload

const router = express.Router();

router.post("/products", upload.single("image"), createProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", upload.single("image"), updateProduct);

export default router;
