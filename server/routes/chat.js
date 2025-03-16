
import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get chat history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [messages] = await pool.query(
      'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear chat history for a user
router.delete('/clear/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Ensure the authenticated user can only clear their own history
    if (req.user.id != userId) {
      return res.status(403).json({ message: 'Not authorized to clear this chat history' });
    }
    
    await pool.query(
      'DELETE FROM chat_messages WHERE user_id = ?',
      [userId]
    );
    
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a new message
router.post('/send', async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    // Mock AI response - in a real app, you would call an AI service
    const responses = [
      "I understand your question. Based on the information provided, I'd recommend focusing on improving your customer engagement strategy.",
      "That's a great point. Let me suggest a few approaches that have worked well for similar businesses.",
      "I can help with that! Here's a step-by-step process you might want to follow.",
      "Thanks for sharing that information. Have you considered looking at this from a different perspective?",
      "I see what you're trying to accomplish. Let me provide some insights that might be useful for your specific case."
    ];
    
    const aiResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Save the message and response to the database
    const [result] = await pool.query(
      'INSERT INTO chat_messages (user_id, message, response) VALUES (?, ?, ?)',
      [userId, message, aiResponse]
    );
    
    const newMessageId = result.insertId;
    
    // Get the created message
    const [messages] = await pool.query(
      'SELECT * FROM chat_messages WHERE id = ?',
      [newMessageId]
    );
    
    res.status(201).json(messages[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
