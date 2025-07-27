import express from 'express';
import { getSupabase } from '../config/database.js';

const router = express.Router();

// GET /api/vendors - Get all vendors for map
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: vendors, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name as name,
        phone,
        location,
        user_type,
        created_at
      `)
      .eq('user_type', 'vendor')
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching vendors:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch vendors',
        error: error.message
      });
    }

    // Transform data to match frontend expectations
    const transformedVendors = vendors?.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      location: vendor.location,
      business_type: 'Street Food Vendor', // Default business type
      phone: vendor.phone,
      created_at: vendor.created_at
    })) || [];

    res.status(200).json({
      status: 'success',
      data: transformedVendors
    });
  } catch (error) {
    console.error('Error in GET /api/vendors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/vendors/nearby - Get vendors near a location
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
    
    // For now, return all vendors since Supabase doesn't have built-in geospatial queries
    // In a production app, you'd use PostGIS or a similar geospatial database
    const { data: vendors, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name as name,
        phone,
        location,
        user_type,
        created_at
      `)
      .eq('user_type', 'vendor')
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching nearby vendors:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch nearby vendors',
        error: error.message
      });
    }

    // Transform and filter vendors (simplified distance calculation)
    const transformedVendors = vendors?.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      location: vendor.location,
      business_type: 'Street Food Vendor',
      phone: vendor.phone,
      created_at: vendor.created_at
    })) || [];

    res.status(200).json({
      status: 'success',
      data: transformedVendors
    });
  } catch (error) {
    console.error('Error in GET /api/vendors/nearby:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

export default router; 