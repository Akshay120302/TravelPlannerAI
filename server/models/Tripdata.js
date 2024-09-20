import mongoose from 'mongoose';

const { Schema } = mongoose;

const DestinationSchema = new Schema({
  location: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true }
});

const TripSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip_name: { type: String, required: true },
  destinations: { type: [DestinationSchema], required: true },
  activities: { type: [String], required: true },
  peopleCount: { type: Number, required: true },
  travelType: { type: String, required: true },
  status: {type : Boolean, default: true}
});

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;
