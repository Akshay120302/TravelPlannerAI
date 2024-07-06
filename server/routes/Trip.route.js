import express from 'express';
import { createTrip, getTripOptions } from '../controllers/Trip.controller.js';

const router = express.Router();

// Route to create a new trip
router.post('/create', createTrip);

// Dummy routes to fetch trip options
router.get('/accommodations', getTripOptions('accommodations'));
router.get('/flights', getTripOptions('flights'));
router.get('/restaurants', getTripOptions('restaurants'));

export default router;
