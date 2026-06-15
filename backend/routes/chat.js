const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { getAIResponse } = require('../services/aiService');

router.post('/', async (req, res) => {
  try {
    const { question, sessionId } = req.body;
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const { answer, processingTime, model } = await getAIResponse(question);
    
    const conversation = new Conversation({
      sessionId: sessionId || 'default',
      question: question.trim(),
      answer,
      metadata: { model, processingTime },
    });
    await conversation.save();

    res.status(201).json({
      success: true,
      conversation: {
        id: conversation._id,
        question,
        answer,
        timestamp: conversation.timestamp,
        sessionId: conversation.sessionId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;