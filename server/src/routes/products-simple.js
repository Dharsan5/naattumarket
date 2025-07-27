const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const pool = require('../db');

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM products';
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    
    const query = `
      SELECT p.*, json_build_object('id', u.id, 'name', u.name) as supplier
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    
    res.json({
      products: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const query = `
      SELECT p.*, json_build_object('id', u.id, 'name', u.name) as supplier
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      WHERE p.is_featured = true
      ORDER BY p.created_at DESC
      LIMIT 8
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT p.*, 
             json_build_object('id', u.id, 'name', u.name) as supplier
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
