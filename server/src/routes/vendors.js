const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const pool = require('../db');

/**
 * @route GET /api/vendors/profile
 * @desc Get vendor profile for authenticated user
 * @access Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Ensure the user is authorized to access vendor profile
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ 
        success: false, 
        error: 'You do not have permission to access vendor profile' 
      });
    }

    // Get vendor profile from database
    const vendorResult = await pool.query(
      `SELECT 
        business_name as "businessName", 
        business_description as "businessDescription",
        business_category as "businessCategory", 
        business_phone as "businessPhone",
        business_address as "businessAddress"
      FROM suppliers
      WHERE user_id = $1`,
      [req.user.id]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor profile not found' 
      });
    }

    res.json({ 
      success: true, 
      data: vendorResult.rows[0]
    });
  } catch (error) {
    console.error('Get vendor profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while fetching vendor profile' 
    });
  }
});

/**
 * @route PUT /api/vendors/profile
 * @desc Update vendor profile for authenticated user
 * @access Private
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    // Ensure the user is authorized to update vendor profile
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ 
        success: false, 
        error: 'You do not have permission to update vendor profile' 
      });
    }

    const { 
      businessName,
      businessDescription,
      businessCategory,
      businessPhone,
      businessAddress 
    } = req.body;

    // Check if vendor profile exists
    const existingVendor = await pool.query(
      'SELECT * FROM suppliers WHERE user_id = $1',
      [req.user.id]
    );

    if (existingVendor.rows.length === 0) {
      // Create new vendor profile if it doesn't exist
      await pool.query(
        `INSERT INTO suppliers 
          (user_id, business_name, business_description, business_category, business_phone, business_address)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [req.user.id, businessName, businessDescription, businessCategory, businessPhone, businessAddress]
      );
    } else {
      // Update existing vendor profile
      await pool.query(
        `UPDATE suppliers 
        SET 
          business_name = $1, 
          business_description = $2,
          business_category = $3,
          business_phone = $4,
          business_address = $5
        WHERE user_id = $6`,
        [businessName, businessDescription, businessCategory, businessPhone, businessAddress, req.user.id]
      );
    }

    res.json({ 
      success: true, 
      message: 'Vendor profile updated successfully' 
    });
  } catch (error) {
    console.error('Update vendor profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating vendor profile' 
    });
  }
});

/**
 * @route POST /api/vendors/register
 * @desc Register as a vendor (convert user to supplier role)
 * @access Private
 */
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { 
      businessName,
      businessDescription,
      businessCategory,
      businessPhone,
      businessAddress,
      isVendor
    } = req.body;

    // Validate required fields
    if (!businessName || !businessCategory || !businessPhone || !businessAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required vendor information' 
      });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update user role to supplier
      await client.query(
        'UPDATE users SET role = $1 WHERE id = $2',
        ['supplier', req.user.id]
      );

      // Create vendor profile
      await client.query(
        `INSERT INTO suppliers 
          (user_id, business_name, business_description, business_category, business_phone, business_address)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [req.user.id, businessName, businessDescription, businessCategory, businessPhone, businessAddress]
      );

      await client.query('COMMIT');
      
      res.json({ 
        success: true, 
        message: 'Successfully registered as a vendor' 
      });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Register vendor error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while registering as vendor' 
    });
  }
});

module.exports = router;
