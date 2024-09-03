import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatHistory: { type: Array, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('ChatHistory', chatHistorySchema);
