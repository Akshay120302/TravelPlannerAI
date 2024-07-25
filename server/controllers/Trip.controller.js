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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Trip.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getTrip = async (req, res, next) => {
  try {
    console.log(`Fetching trip with ID: ${req.params._id}`);
    const listing = await Trip.findById(req.params._id);
    if (!listing) {
      console.log('Listing not found!');
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching trip:', error);
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const listing = await Trip.findById(req.params._id);  // Changed _id to id
    console.log(listing.user_id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // if (req.user.id !== listing.user_id) {
    //   return next(errorHandler(401, 'You can only delete your own listings!'));
    // }

    await Trip.findByIdAndDelete(req.params._id);  // Changed _id to id
    res.status(200).json({ success: true, message: 'Listing has been deleted!' });
  } catch (error) {
    next(error);
  }
};
