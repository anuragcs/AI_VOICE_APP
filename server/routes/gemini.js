const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini');

// Add this middleware to handle preflight requests
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

router.post('/start', async (req, res) => {
  try {
    const result = await geminiService.startConversation();
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json(result);
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to start conversation with Gemini'
    });
  }
});

router.post('/process', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  try {
    console.log('Process request received:', {
      hasBody: !!req.body,
      hasFiles: !!req.files,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      fileKeys: req.files ? Object.keys(req.files) : []
    });
    
    // Check if it's a text message or audio file
    if (req.body && req.body.text) {
      console.log('Processing text input:', req.body.text);
      // Handle text input
      const result = await geminiService.processText(req.body.text);
      res.json(result);
    } else if (req.files && req.files.audio) {
      console.log('Processing audio file:', {
        name: req.files.audio.name,
        size: req.files.audio.size,
        mimetype: req.files.audio.mimetype
      });
      // Handle audio file
      const result = await geminiService.processAudio(req.files.audio);
      res.json(result);
    } else {
      console.log('No valid input found');
      return res.status(400).json({ 
        error: "No audio file or text provided",
        received: {
          hasBody: !!req.body,
          hasFiles: !!req.files,
          bodyKeys: req.body ? Object.keys(req.body) : [],
          fileKeys: req.files ? Object.keys(req.files) : []
        }
      });
    }
  } catch (error) {
    console.error('Process error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to process input with Gemini',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/interrupt', async (req, res) => {
  try {
    const result = await geminiService.interrupt();
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json(result);
  } catch (error) {
    console.error('Interrupt error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to interrupt conversation'
    });
  }
});

// Test endpoint for audio processing
router.post('/test-audio', async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: "No audio file provided" });
    }
    
    const audioFile = req.files.audio;
    console.log('Test audio file:', {
      name: audioFile.name,
      size: audioFile.size,
      mimetype: audioFile.mimetype
    });
    
    // Just return file info for testing
    res.json({
      status: "audio_received",
      fileInfo: {
        name: audioFile.name,
        size: audioFile.size,
        mimetype: audioFile.mimetype,
        dataLength: audioFile.data ? audioFile.data.length : 0
      }
    });
  } catch (error) {
    console.error('Test audio error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;