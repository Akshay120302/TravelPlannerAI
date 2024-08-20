import express from "express"
import { getTopReviews, tripReview } from "../controllers/Review.controller.js";

const router = express.Router();

router.post('/postReview', tripReview);

router.get('/top-reviews', getTopReviews);

export default router;