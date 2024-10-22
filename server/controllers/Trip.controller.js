import Trip from '../models/Tripdata.js';
import Invitation from '../models/AddUserNotification.js';
import User from '../models/User.model.js';
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

export const sendInvitation = async (req, res) => {
  const { tripId, email } = req.body;
  const senderId = req.user.id; // Assuming the sender is authenticated

  try {
    // Check if the recipient is a registered user
    const recipient = await User.findOne({ email });

    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if an invitation already exists
    const existingInvitation = await Invitation.findOne({ tripId, recipientEmail: email });
    if (existingInvitation) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }

    // Create a new invitation
    const newInvitation = new Invitation({
      tripId,
      senderId,
      recipientEmail: email,
    });

    await newInvitation.save();
    
    // (Optional) Send an email to notify the user of the invitation
    // await sendInvitationEmail(email); // Define this function for email service

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const fetchPendingInvitations = async (req, res) => {
  try {
    // Fetch the user from the database using the ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Now use the user's email to find invitations
    const invitations = await Invitation.find({
      recipientEmail: new RegExp(`^${user.email}$`, 'i'), // Case-insensitive email match
      status: 'pending'
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching invitations' });
  }
};

export const respondToInvitation = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'

  try {
    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    invitation.status = status;
    await invitation.save();
    res.status(200).json({ message: `Invitation ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to invitation' });
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

export const updatedTrip = async (req, res, next) => {
  try {
    // Find and update the trip based on the ID
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,  // Use req.params.id, not req.params._id
      { $set: { status: req.body.status } },  // Setting status to false
      { new: true }  // Return the updated document
    );

    // If no trip is found, return a 404 error
    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Return the updated trip data
    res.status(200).json({ success: true, data: updatedTrip });
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
