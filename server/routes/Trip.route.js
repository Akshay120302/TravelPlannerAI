import express from 'express';
import {sendInvitation, fetchPendingInvitations, respondToInvitation, createTrip, deleteTrip, getListing, getTrip, getTripOptions, updatedTrip } from '../controllers/Trip.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route to create a new trip
router.post('/create', createTrip);

// Dummy routes to fetch trip options
router.get('/accommodations', getTripOptions('accommodations'));
router.get('/flights', getTripOptions('flights'));
router.get('/restaurants', getTripOptions('restaurants'));
router.get('/get/', getListing);
router.get('/get/:_id', getTrip);
router.get('/update/:_id', updatedTrip);
router.delete('/delete/:_id', verifyToken, deleteTrip);

// Send an invitation
router.post('/send', verifyToken, sendInvitation);

// Fetch pending invitations for the logged-in user
router.get('/pending', verifyToken, fetchPendingInvitations);

// Respond to an invitation (accept/reject)
router.post('/respond/:id', verifyToken, respondToInvitation);

export default router;
