import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { getSupabase } from '../config/database.js';

const router = express.Router();

/**
 * @route GET /api/vendors/profile
 * @desc Get vendor profile for authenticated user
 * @access Private
 */
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    // Ensure the user is authorized to access vendor profile
    if (!req.userProfile || req.userProfile.user_type !== 'supplier') {
      return res.status(403).json({ 
        success: false, 
        error: 'You do not have permission to access vendor profile' 
      });
    }

    // Get vendor profile from database
    const supabase = getSupabase();
    const { data: vendorProfile, error } = await supabase
      .from('suppliers')
      .select(`
        business_name,
        business_description,
        business_category,
        business_phone,
        business_address
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error || !vendorProfile) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vendor profile not found' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        businessName: vendorProfile.business_name,
        businessDescription: vendorProfile.business_description,
        businessCategory: vendorProfile.business_category,
        businessPhone: vendorProfile.business_phone,
        businessAddress: vendorProfile.business_address
      }
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
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    // Ensure the user is authorized to update vendor profile
    if (!req.userProfile || req.userProfile.user_type !== 'supplier') {
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

    // Check if vendor profile exists and update/create accordingly
    const supabase = getSupabase();
    const { data: existingVendor, error: checkError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking vendor profile:', checkError);
      return res.status(500).json({ 
        success: false, 
        error: 'Server error while checking vendor profile' 
      });
    }

    if (!existingVendor) {
      // Create new vendor profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('suppliers')
        .insert({
          user_id: req.user.id,
          business_name: businessName,
          business_description: businessDescription,
          business_category: businessCategory,
          business_phone: businessPhone,
          business_address: businessAddress
        });

      if (insertError) {
        console.error('Error creating vendor profile:', insertError);
        return res.status(500).json({ 
          success: false, 
          error: 'Server error while creating vendor profile' 
        });
      }
    } else {
      // Update existing vendor profile
      const { error: updateError } = await supabase
        .from('suppliers')
        .update({
          business_name: businessName,
          business_description: businessDescription,
          business_category: businessCategory,
          business_phone: businessPhone,
          business_address: businessAddress
        })
        .eq('user_id', req.user.id);

      if (updateError) {
        console.error('Error updating vendor profile:', updateError);
        return res.status(500).json({ 
          success: false, 
          error: 'Server error while updating vendor profile' 
        });
      }
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
router.post('/register', authenticateUser, async (req, res) => {
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

export default router;
