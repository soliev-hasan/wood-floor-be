import { Request, Response } from "express";
import Review from "../models/Review";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user?.id;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if user is admin
    const user = await User.findById(userId);
    if (user?.role === "admin") {
      return res.status(403).json({ message: "Admins cannot leave reviews" });
    }

    // Check if user already has a review
    const existingReview = await Review.findOne({ userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already submitted a review" });
    }

    const review = new Review({
      userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

export const getReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email") // Populate user details
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

export const getUserReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const review = await Review.findOne({ userId });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user review", error });
  }
};
