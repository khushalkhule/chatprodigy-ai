
import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all chatbots for a user
router.get('/list/:userId', auth, async (req, res) => {
  try {
    // Ensure the authenticated user can only access their own chatbots
    if (req.user.id != req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to access these chatbots' });
    }

    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.userId]
    );
    
    res.json(chatbots);
  } catch (error) {
    console.error('Fetch chatbots error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific chatbot
router.get('/:chatbotId', auth, async (req, res) => {
  try {
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [req.params.chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Ensure the authenticated user can only access their own chatbots
    if (req.user.id != chatbots[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to access this chatbot' });
    }
    
    res.json(chatbots[0]);
  } catch (error) {
    console.error('Fetch chatbot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new chatbot
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description, welcome_message, user_id } = req.body;
    
    // Ensure the authenticated user can only create chatbots for themselves
    if (req.user.id != user_id) {
      return res.status(403).json({ message: 'Not authorized to create chatbots for other users' });
    }
    
    if (!name) {
      return res.status(400).json({ message: 'Chatbot name is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO chatbots (user_id, name, description, welcome_message) VALUES (?, ?, ?, ?)',
      [user_id, name, description || '', welcome_message || 'Welcome to our chat!']
    );
    
    const newChatbotId = result.insertId;
    
    // Get the created chatbot
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [newChatbotId]
    );
    
    res.status(201).json(chatbots[0]);
  } catch (error) {
    console.error('Create chatbot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a chatbot
router.put('/:chatbotId', auth, async (req, res) => {
  try {
    const { name, description, welcome_message } = req.body;
    const chatbotId = req.params.chatbotId;
    
    // Check if chatbot exists and belongs to the user
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Ensure the authenticated user can only update their own chatbots
    if (req.user.id != chatbots[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to update this chatbot' });
    }
    
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (welcome_message !== undefined) updates.welcome_message = welcome_message;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    // Build the dynamic query
    const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const updateValues = Object.values(updates);
    
    await pool.query(
      `UPDATE chatbots SET ${updateFields} WHERE id = ?`,
      [...updateValues, chatbotId]
    );
    
    // Get the updated chatbot
    const [updatedChatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    res.json(updatedChatbots[0]);
  } catch (error) {
    console.error('Update chatbot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a chatbot
router.delete('/:chatbotId', auth, async (req, res) => {
  try {
    const chatbotId = req.params.chatbotId;
    
    // Check if chatbot exists and belongs to the user
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Ensure the authenticated user can only delete their own chatbots
    if (req.user.id != chatbots[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to delete this chatbot' });
    }
    
    // Delete the chatbot (steps will be deleted by ON DELETE CASCADE)
    await pool.query('DELETE FROM chatbots WHERE id = ?', [chatbotId]);
    
    res.json({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    console.error('Delete chatbot error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all steps for a chatbot
router.get('/:chatbotId/steps', auth, async (req, res) => {
  try {
    const chatbotId = req.params.chatbotId;
    
    // Check if chatbot exists and belongs to the user
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Ensure the authenticated user can only access their own chatbot steps
    if (req.user.id != chatbots[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to access these chatbot steps' });
    }
    
    const [steps] = await pool.query(
      'SELECT * FROM chatbot_steps WHERE chatbot_id = ? ORDER BY step_order ASC',
      [chatbotId]
    );
    
    // Parse the options JSON field
    steps.forEach(step => {
      if (step.options) {
        try {
          step.options = JSON.parse(step.options);
        } catch (error) {
          console.error('Error parsing options:', error);
          step.options = [];
        }
      }
    });
    
    res.json(steps);
  } catch (error) {
    console.error('Fetch chatbot steps error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new step for a chatbot
router.post('/:chatbotId/steps', auth, async (req, res) => {
  try {
    const chatbotId = req.params.chatbotId;
    const { step_order, message, response_type, options, is_required } = req.body;
    
    // Check if chatbot exists and belongs to the user
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Ensure the authenticated user can only create steps for their own chatbots
    if (req.user.id != chatbots[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to create steps for this chatbot' });
    }
    
    // Validate required fields
    if (!message) {
      return res.status(400).json({ message: 'Step message is required' });
    }
    
    // Convert options to JSON string if provided
    const optionsJson = options ? JSON.stringify(options) : null;
    
    // If no step_order provided, get the next available order
    let nextOrder = step_order;
    if (!nextOrder) {
      const [result] = await pool.query(
        'SELECT MAX(step_order) as max_order FROM chatbot_steps WHERE chatbot_id = ?',
        [chatbotId]
      );
      nextOrder = (result[0].max_order || 0) + 1;
    }
    
    const [result] = await pool.query(
      'INSERT INTO chatbot_steps (chatbot_id, step_order, message, response_type, options, is_required) VALUES (?, ?, ?, ?, ?, ?)',
      [chatbotId, nextOrder, message, response_type || 'text', optionsJson, is_required !== undefined ? is_required : true]
    );
    
    const newStepId = result.insertId;
    
    // Get the created step
    const [steps] = await pool.query(
      'SELECT * FROM chatbot_steps WHERE id = ?',
      [newStepId]
    );
    
    // Parse the options JSON field
    if (steps[0].options) {
      try {
        steps[0].options = JSON.parse(steps[0].options);
      } catch (error) {
        console.error('Error parsing options:', error);
        steps[0].options = [];
      }
    }
    
    res.status(201).json(steps[0]);
  } catch (error) {
    console.error('Create chatbot step error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a chatbot step
router.put('/step/:stepId', auth, async (req, res) => {
  try {
    const stepId = req.params.stepId;
    const { step_order, message, response_type, options, is_required } = req.body;
    
    // Check if step exists and belongs to the user's chatbot
    const [steps] = await pool.query(
      'SELECT s.*, c.user_id FROM chatbot_steps s JOIN chatbots c ON s.chatbot_id = c.id WHERE s.id = ?',
      [stepId]
    );
    
    if (steps.length === 0) {
      return res.status(404).json({ message: 'Step not found' });
    }
    
    // Ensure the authenticated user can only update steps for their own chatbots
    if (req.user.id != steps[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to update this step' });
    }
    
    const updates = {};
    if (step_order !== undefined) updates.step_order = step_order;
    if (message !== undefined) updates.message = message;
    if (response_type !== undefined) updates.response_type = response_type;
    if (options !== undefined) updates.options = JSON.stringify(options);
    if (is_required !== undefined) updates.is_required = is_required;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    // Build the dynamic query
    const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const updateValues = Object.values(updates);
    
    await pool.query(
      `UPDATE chatbot_steps SET ${updateFields} WHERE id = ?`,
      [...updateValues, stepId]
    );
    
    // Get the updated step
    const [updatedSteps] = await pool.query(
      'SELECT * FROM chatbot_steps WHERE id = ?',
      [stepId]
    );
    
    // Parse the options JSON field
    if (updatedSteps[0].options) {
      try {
        updatedSteps[0].options = JSON.parse(updatedSteps[0].options);
      } catch (error) {
        console.error('Error parsing options:', error);
        updatedSteps[0].options = [];
      }
    }
    
    res.json(updatedSteps[0]);
  } catch (error) {
    console.error('Update chatbot step error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a chatbot step
router.delete('/step/:stepId', auth, async (req, res) => {
  try {
    const stepId = req.params.stepId;
    
    // Check if step exists and belongs to the user's chatbot
    const [steps] = await pool.query(
      'SELECT s.*, c.user_id FROM chatbot_steps s JOIN chatbots c ON s.chatbot_id = c.id WHERE s.id = ?',
      [stepId]
    );
    
    if (steps.length === 0) {
      return res.status(404).json({ message: 'Step not found' });
    }
    
    // Ensure the authenticated user can only delete steps for their own chatbots
    if (req.user.id != steps[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to delete this step' });
    }
    
    await pool.query('DELETE FROM chatbot_steps WHERE id = ?', [stepId]);
    
    // Reorder remaining steps
    await pool.query(
      `UPDATE chatbot_steps 
       SET step_order = (
         SELECT @row_number:=@row_number+1 
         FROM (SELECT @row_number:=0) AS t
       )
       WHERE chatbot_id = ? 
       ORDER BY step_order ASC`,
      [steps[0].chatbot_id]
    );
    
    res.json({ message: 'Step deleted successfully' });
  } catch (error) {
    console.error('Delete chatbot step error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
