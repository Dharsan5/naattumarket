import express from 'express';
import { getSupabase } from '../config/database.js';

const router = express.Router();

// GET /api/suppliers - Get all suppliers for map
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: suppliers, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        phone,
        location,
        user_type,
        created_at
      `)
      .eq('user_type', 'supplier')
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching suppliers:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch suppliers',
        error: error.message
      });
    }

    // Transform data to match frontend expectations
    const transformedSuppliers = suppliers?.map(supplier => ({
      id: supplier.id,
      name: supplier.full_name,
      location: supplier.location,
      verified: true, // Default to true for now
      rating: 4.5, // Default rating
      phone: supplier.phone,
      created_at: supplier.created_at
    })) || [];

    res.status(200).json({
      status: 'success',
      data: transformedSuppliers
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

// GET /api/suppliers/nearby - Get suppliers near a location
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        status: 'error',
        message: 'Latitude and longitude are required'
      });
    }

    const supabase = getSupabase();
    
    // For now, return all suppliers since Supabase doesn't have built-in geospatial queries
    const { data: suppliers, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        phone,
        location,
        user_type,
        created_at
      `)
      .eq('user_type', 'supplier')
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching nearby suppliers:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch nearby suppliers',
        error: error.message
      });
    }

    // Transform and filter suppliers (simplified distance calculation)
    const transformedSuppliers = suppliers?.map(supplier => ({
      id: supplier.id,
      name: supplier.full_name,
      location: supplier.location,
      verified: true,
      rating: 4.5,
      phone: supplier.phone,
      created_at: supplier.created_at
    })) || [];

    res.status(200).json({
      status: 'success',
      data: transformedSuppliers
    });
  } catch (error) {
    console.error('Error in GET /api/suppliers/nearby:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

export default router; 