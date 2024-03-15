import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { checkAuth } from "../middlewares/authMiddleware.js"; // Example authentication middleware

const router = express.Router();

router.post("/", checkAuth, reviewController.createReview);
router.get("/", reviewController.getAllReviews); // Might not need protect here if viewing all reviews is allowed
router.get("/product/:productId", reviewController.getReviewsForProduct);

router.get("/:id",reviewController.getReviewById);
router.put("/:id", checkAuth, reviewController.updateReview);
router.delete("/:id", checkAuth, reviewController.deleteReview);

export default router;
