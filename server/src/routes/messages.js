import express from 'express';
import { getSupabase } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const supabase = getSupabase();

/**
 * @route   GET /api/messages
 * @desc    Get messages for a conversation
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { supplierId, orderId = 'general' } = req.query;
    const userId = req.user.id;
    
    if (!supplierId) {
      return res.status(400).json({
        status: 'error',
        message: 'Supplier ID is required'
      });
    }

    // Query messages from Supabase
    let query = supabase
      .from('messages')
      .select('*')
      .eq('supplier_id', supplierId)
      .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: true });
    
    // If orderId is provided and not 'general', filter by orderId
    if (orderId && orderId !== 'general') {
      query = query.eq('order_id', orderId);
    } else if (orderId === 'general') {
      query = query.is('order_id', null);
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch messages',
        error: error.message
      });
    }

    // Format messages to match frontend expected structure
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      text: msg.content,
      sender: msg.user_id === userId ? 'vendor' : 'supplier',
      timestamp: msg.created_at,
      read: msg.is_read
    }));

    // Mark unread messages as read if the current user is the recipient
    const unreadMessageIds = messages
      .filter(msg => !msg.is_read && msg.recipient_id === userId)
      .map(msg => msg.id);

    if (unreadMessageIds.length > 0) {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadMessageIds);

      if (updateError) {
        console.error('Error marking messages as read:', updateError);
      }
    }

    res.status(200).json({
      status: 'success',
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/messages
 * @desc    Send a new message
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { supplierId, orderId, text } = req.body;
    const userId = req.user.id;
    
    if (!supplierId || !text) {
      return res.status(400).json({
        status: 'error',
        message: 'Supplier ID and message text are required'
      });
    }

    // Create message in Supabase
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        content: text,
        user_id: userId,
        supplier_id: supplierId,
        order_id: orderId !== 'general' ? orderId : null,
        recipient_id: supplierId, // Assuming supplier ID is also the recipient ID
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send message',
        error: error.message
      });
    }

    // Format message to match frontend expected structure
    const formattedMessage = {
      id: message.id,
      text: message.content,
      sender: 'vendor',
      timestamp: message.created_at,
      read: message.is_read
    };

    res.status(201).json({
      status: 'success',
      message: formattedMessage
    });
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/messages/read
 * @desc    Mark messages as read
 * @access  Private
 */
router.put('/read', authMiddleware, async (req, res) => {
  try {
    const { supplierId } = req.body;
    const userId = req.user.id;
    
    if (!supplierId) {
      return res.status(400).json({
        status: 'error',
        message: 'Supplier ID is required'
      });
    }

    // Mark all unread messages from the supplier as read
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('supplier_id', supplierId)
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to mark messages as read',
        error: error.message
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error in PUT /api/messages/read:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
