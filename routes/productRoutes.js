import express from "express";
import {
  updateProduct,
  getProductById,
  createProduct,
  getAllProducts,
  getProducts,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js"; // Import upload
import { checkAuth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/products",
  checkAuth,
  isAdmin,
  upload.single("image"),
  createProduct
);
router.get("/products/:id", getProductById);
router.put("/products/:id", upload.single("image"), updateProduct);
router.get("/getall", getAllProducts);
router.delete("/products/:id", deleteProduct);
export default router;
