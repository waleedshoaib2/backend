import express from "express";
import { getCart, addItemToCart, updateItemInCart, removeItemFromCart } from "../controllers/cartController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/cart", checkAuth, getCart);
router.post("/cart/add", checkAuth, addItemToCart);
router.put("/cart/update", checkAuth, updateItemInCart); 
router.delete("/cart/remove/:itemId", checkAuth, removeItemFromCart);

export default router;
