import mongoose from 'mongoose';

const chatItemSchema = new mongoose.Schema({
  role: { type: String, required: true },
  parts: { type: [String], required: true },
}, { _id: false }); // Avoids generating a separate _id for each chat item

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatHistory: { type: [chatItemSchema], required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatHistory', chatHistorySchema);
