import mongoose from "mongoose"

const TripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    places: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Place'
    }],
});

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;