const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const pool = require('../db');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer storage for Cloudinary
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'naattu_market_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'naattu_market_products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

// Create multer upload instances
const uploadProfileImage = multer({ storage: profileStorage });
const uploadProductImage = multer({ storage: productStorage });

/**
 * @route POST /api/uploads/profile-image
 * @desc Upload user profile image
 * @access Private
 */
router.post('/profile-image', authenticateToken, uploadProfileImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    // Get the Cloudinary upload result
    const result = {
      secure_url: req.file.path,
      public_id: req.file.filename
    };
    
    // Update the user's profile with the new image URL
    await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2',
      [result.secure_url, req.user.id]
    );

    res.json({ 
      success: true, 
      data: result
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while uploading image' 
    });
  }
});

/**
 * @route POST /api/uploads/product-image
 * @desc Upload product image
 * @access Private
 */
router.post('/product-image', authenticateToken, uploadProductImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    // Ensure the user is a vendor
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only vendors can upload product images' 
      });
    }

    // Get the Cloudinary upload result
    const result = {
      secure_url: req.file.path,
      public_id: req.file.filename
    };

    res.json({ 
      success: true, 
      data: result
    });
  } catch (error) {
    console.error('Product image upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while uploading product image' 
    });
  }
});

/**
 * @route DELETE /api/uploads/image/:public_id
 * @desc Delete an image from Cloudinary
 * @access Private
 */
router.delete('/image/:public_id', authenticateToken, async (req, res) => {
  try {
    const { public_id } = req.params;
    
    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result !== 'ok') {
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to delete image' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error while deleting image' 
    });
  }
});

module.exports = router;
