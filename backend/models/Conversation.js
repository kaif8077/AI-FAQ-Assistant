const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true }, 
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: {
    model: String,
    processingTime: Number,
  },
});


conversationSchema.index({ question: 'text', answer: 'text' });

module.exports = mongoose.model('Conversation', conversationSchema);