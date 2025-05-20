import express from "express";
import {
  createReview,
  getReviews,
  getUserReview,
} from "../controllers/reviewController";
import { auth } from "../middleware/auth";

const router = express.Router();

// Create a review (authenticated users only)
router.post("/", auth, createReview);

// Get all reviews (public)
router.get("/", getReviews);

// Get user's own review (authenticated users only)
router.get("/my-review", auth, getUserReview);

export default router;
