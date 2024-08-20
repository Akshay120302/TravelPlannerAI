import Review from "../models/Review.model.js";
import { errorHandler } from '../utils/error.js';

export const tripReview = async (req, res, next) => {
    const { rating, description, avatar, username, destinations } = req.body;
    try {
        const newReview = new Review({rating, description, avatar, username, destinations });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error saving review:", error); 
        res.status(500).json({ success: false, message: "Failed to post review" });
    }
};


export const getTopReviews = async (req, res) => {
    try {
      const topReviews = await Review.find().sort({ rating: -1 }).limit(3);
      res.status(200).json(topReviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  };