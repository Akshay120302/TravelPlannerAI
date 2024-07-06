import Trip from '../models/Tripdata.js';
import { errorHandler } from '../utils/error.js';

// Create a new trip
export const createTrip = async (req, res, next) => {
  const { user_id, trip_name, destinations, activities, peopleCount, travelType } = req.body;

  try {
    // Create a new trip document
    const newTrip = new Trip({
      user_id,
      trip_name,
      destinations,
      activities,
      peopleCount,
      travelType
    });

    // Save the trip to the database
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error(error); // Log the error
    next(errorHandler(500, "Failed to create trip"));
  }
};

// Dummy function for trip options
export const getTripOptions = (optionType) => (req, res, next) => {
  // Implement logic for fetching trip options based on optionType
  res.json({ message: `Fetching ${optionType} options...` });
};
