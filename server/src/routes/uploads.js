import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { getSupabase } from '../config/database.js';

const router = express.Router();

/**
 * @route POST /api/uploads/profile-image
 * @desc Update user profile with image URL
 * @access Private
 */
router.post('/profile-image', authenticateUser, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      });
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid image URL format' 
      });
    }

    const supabase = getSupabase();
    
    // Update the user's profile with the new image URL
    const { error } = await supabase
      .from('users')
      .update({ avatar_url: imageUrl })
      .eq('id', req.user.id);

    if (error) {
      console.error('Error updating user avatar:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to update user profile' 
      });
    }

    res.json({ 
      success: true, 
      data: { secure_url: imageUrl, public_id: null }
    });
  } catch (error) {
    console.error('Profile image update error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating image' 
    });
  }
});

/**
 * @route POST /api/uploads/product-image
 * @desc Add product image URL
 * @access Private
 */
router.post('/product-image', authenticateUser, async (req, res) => {
  try {
    const { imageUrl, productId } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      });
    }

    // Ensure the user is a vendor
    if (!req.userProfile || req.userProfile.user_type !== 'supplier') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only vendors can upload product images' 
      });
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid image URL format' 
      });
    }

    const supabase = getSupabase();

    // If productId is provided, update the product's image
    if (productId) {
      const { error } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', productId)
        .eq('supplier_id', req.user.id);

      if (error) {
        console.error('Error updating product image:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to update product image' 
        });
      }
    }

    res.json({ 
      success: true, 
      data: { secure_url: imageUrl, public_id: null }
    });
  } catch (error) {
    console.error('Product image update error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while updating product image' 
    });
  }
});

/**
 * @route DELETE /api/uploads/image/:imageId
 * @desc Remove image URL from database
 * @access Private
 */
router.delete('/image/:imageId', authenticateUser, async (req, res) => {
  try {
    const { imageId } = req.params;
    const { type, entityId } = req.body; // type: 'profile' | 'product', entityId: user_id or product_id
    
    const supabase = getSupabase();
    
    if (type === 'profile') {
      // Remove profile image
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', req.user.id);

      if (error) {
        console.error('Error removing profile image:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to remove profile image' 
        });
      }
    } else if (type === 'product' && entityId) {
      // Remove product image
      const { error } = await supabase
        .from('products')
        .update({ image_url: null })
        .eq('id', entityId)
        .eq('supplier_id', req.user.id);

      if (error) {
        console.error('Error removing product image:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to remove product image' 
        });
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid image type or missing entity ID' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Image removed successfully' 
    });
  } catch (error) {
    console.error('Image removal error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while removing image' 
    });
  }
});

export default router;
