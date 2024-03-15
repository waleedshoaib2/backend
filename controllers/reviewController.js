import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const createReview = async (req, res) => {
  try {
    // Authentication check (Placeholder)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { product_id, content, rating } = req.body;

    // Ensure product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = new Review({
      user_id: req.user._id, // User ID from authenticated request
      product_id,
      content,
      rating,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user_id", "name") // Select only the 'name' from the User
      .populate("product_id", "name");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product_id: productId }).populate(
      "user_id",
      "name"
    );

    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ... Add other CRUD operations (getReviewById, updateReview, deleteReview) if needed.
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user_id", "name")
      .populate("product_id", "name");
    res.status(200).json(review);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    // Authentication (Placeholder)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Authorization check: Ensure user owns the review
    if (review.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this review" });
    }

    // Update the review
    for (const field in req.body) {
      review[field] = req.body[field];
    }

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    // Authentication (Placeholder)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Authorization check - User ownership or admin
    if (
      review.user_id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.remove();
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
