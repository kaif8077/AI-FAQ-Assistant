const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// GET all conversation sessions (list of threads)
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Conversation.aggregate([
      { $group: { _id: '$sessionId', lastUpdated: { $max: '$timestamp' }, count: { $sum: 1 } } },
      { $sort: { lastUpdated: -1 } },
      { $project: { sessionId: '$_id', lastUpdated: 1, count: 1, _id: 0 } }
    ]);
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET conversations for a specific session (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50, skip = 0, sessionId } = req.query;
    let filter = {};
    
    if (sessionId) {
      filter.sessionId = sessionId;
    }
    
    if (search && search.trim()) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }
    
    const conversations = await Conversation.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
      
    const total = await Conversation.countDocuments(filter);
    
    res.json({
      success: true,
      conversations,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: skip + conversations.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;