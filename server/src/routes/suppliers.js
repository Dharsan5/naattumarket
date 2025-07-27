import express from 'express';
import { getSupabase } from '../config/database.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/suppliers
 * @desc    Get all suppliers
 * @access  Private
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const supabase = getSupabase();

    // Get all suppliers
    const { data: suppliers, error } = await supabase
      .from('suppliers')
      .select('id, name, image');

    if (error) {
      console.error('Error fetching suppliers:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch suppliers',
        error: error.message
      });
    }

    // For each supplier, get the last message with this user (if any)
    const suppliersWithMessages = await Promise.all(
      suppliers.map(async (supplier) => {
        // Get last message
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('supplier_id', supplier.id)
          .or(`user_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (messagesError) {
          console.error(`Error fetching messages for supplier ${supplier.id}:`, messagesError);
          return {
            ...supplier,
            lastMessage: null,
            lastMessageTime: null,
            unreadCount: 0
          };
        }

        // Count unread messages
        const { count: unreadCount, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('supplier_id', supplier.id)
          .eq('recipient_id', userId)
          .eq('is_read', false);

        if (countError) {
          console.error(`Error counting unread messages for supplier ${supplier.id}:`, countError);
        }

        // Get orders for this supplier
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, status')
          .eq('supplier_id', supplier.id)
          .eq('user_id', userId);

        if (ordersError) {
          console.error(`Error fetching orders for supplier ${supplier.id}:`, ordersError);
        }

        const formattedOrders = orders?.map(order => ({
          id: order.id,
          date: order.created_at,
          status: order.status
        })) || [];

        return {
          ...supplier,
          lastMessage: messages?.[0]?.content || null,
          lastMessageTime: messages?.[0]?.created_at || null,
          unreadCount: unreadCount || 0,
          orders: formattedOrders
        };
      })
    );

    res.status(200).json({
      status: 'success',
      suppliers: suppliersWithMessages
    });
  } catch (error) {
    console.error('Error in GET /api/suppliers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/suppliers/:id
 * @desc    Get a single supplier
 * @access  Private
 */
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get supplier details
    const { data: supplier, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching supplier:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch supplier',
        error: error.message
      });
    }

    if (!supplier) {
      return res.status(404).json({
        status: 'error',
        message: 'Supplier not found'
      });
    }

    // Get orders for this supplier
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, status')
      .eq('supplier_id', id)
      .eq('user_id', userId);

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    }

    const formattedOrders = orders?.map(order => ({
      id: order.id,
      date: order.created_at,
      status: order.status
    })) || [];

    res.status(200).json({
      status: 'success',
      supplier: {
        ...supplier,
        orders: formattedOrders
      }
    });
  } catch (error) {
    console.error('Error in GET /api/suppliers/:id:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
