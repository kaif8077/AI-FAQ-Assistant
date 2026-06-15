require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const chatRoutes = require('./routes/chat');
const conversationRoutes = require('./routes/conversations');

const app = express();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(limiter);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// These are the lines that cause the error if the imports are wrong
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend on http://localhost:${PORT}`)); 