/**
 * GraphQuest - Main Express Backend Server
 * Discrete Mathematics (7MA206) - Gamified Graph Theory System
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const graphRoutes = require('./routes/graph');
const gameRoutes = require('./routes/game');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/graph', graphRoutes);
app.use('/api/game', gameRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'GraphQuest - Discrete Mathematics ISE-2',
    course: '7MA206 Discrete Mathematics',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files if client directory is requested directly
app.use(express.static(path.join(__dirname, '../client')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[GraphQuest Server Error]:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 GraphQuest Server running on http://localhost:${PORT}`);
    console.log(`📊 Discrete Mathematics (7MA206) ISE-2 System Ready`);
    console.log(`====================================================`);
  });
}

module.exports = app;
