import express from 'express';
import { getSupabase } from '../config/database.js';

const router = express.Router();

/**
 * @route   GET /api/suppliers
 * @desc    Get all suppliers
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data: suppliers, error } = await supabase
      .from('suppliers')
      .select('id, name, image_url, location, description, rating, reviews_count, verified, specialties, certifications, established_year, delivery_time');
    if (error) {
      console.error('Error fetching suppliers:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch suppliers',
        error: error.message
      });
    }
    res.status(200).json({
      status: 'success',
      data: suppliers
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch suppliers',
      error: error.message
    });
  }
});

export default router;
