import mongoose from 'mongoose'

const { Schema } = mongoose;

const DestinationSchema = new Schema({
    location: { type: String, required: true }
  });

const reviewSchema = new mongoose.Schema({
    rating:
    {
        type: Number,
        required: true,
    },
    description:
    {
        type: String,
        required: true,
    },
    avatar:
    {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
    },
    username:
    {
        type: String,
        required: true,
    },
    destinations:
    { type: [DestinationSchema], required: true },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;