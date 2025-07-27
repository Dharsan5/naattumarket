const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const pool = require('../db');

// Get vendor dashboard stats
router.get('/stats', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const statsQuery = `
      SELECT * FROM vendor_stats WHERE vendor_id = $1
    `;
    
    const statsResult = await pool.query(statsQuery, [userId]);
    
    // Get recent orders (last 10)
    const recentOrdersQuery = `
      SELECT o.id, o.status, o.total_amount, o.created_at, 
             json_build_object('id', u.id, 'name', u.name, 'email', u.email) as customer
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.id IN (
        SELECT DISTINCT order_id 
        FROM order_items 
        WHERE supplier_id = $1
      )
      ORDER BY o.created_at DESC
      LIMIT 10
    `;
    
    const recentOrdersResult = await pool.query(recentOrdersQuery, [userId]);
    
    // Get top products
    const topProductsQuery = `
      SELECT p.id, p.name, p.price, 
             COALESCE(SUM(oi.quantity), 0) as total_sold,
             COALESCE(p.avg_rating, 0) as rating
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      WHERE p.supplier_id = $1
      GROUP BY p.id, p.name, p.price, p.avg_rating
      ORDER BY total_sold DESC
      LIMIT 5
    `;
    
    const topProductsResult = await pool.query(topProductsQuery, [userId]);
    
    // Construct the response
    const dashboardData = {
      stats: statsResult.rows[0] || {
        total_products: 0,
        total_orders: 0,
        total_revenue: 0,
        avg_rating: 0
      },
      recentOrders: recentOrdersResult.rows,
      topProducts: topProductsResult.rows
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching vendor dashboard:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// Get vendor products
router.get('/products', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT p.*, 
             json_build_object('id', pc.id, 'name', pc.name) as category_data,
             json_build_object('id', ps.id, 'name', ps.name) as subcategory_data
      FROM products p
      LEFT JOIN product_categories pc ON p.category = pc.name
      LEFT JOIN product_subcategories ps ON p.subcategory = ps.name
      WHERE p.supplier_id = $1
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Create new product
router.post('/products', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      category,
      subcategory,
      images,
      is_organic
    } = req.body;
    
    const supplierId = req.user.id;
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if category exists
    const categoryCheck = await client.query(
      'SELECT id FROM product_categories WHERE name = $1',
      [category]
    );
    
    if (categoryCheck.rows.length === 0) {
      // Create new category if it doesn't exist
      await client.query(
        'INSERT INTO product_categories (name) VALUES ($1)',
        [category]
      );
    }
    
    // Check if subcategory exists
    if (subcategory) {
      const categoryId = categoryCheck.rows[0]?.id || 
                         (await client.query('SELECT id FROM product_categories WHERE name = $1', [category])).rows[0].id;
                         
      const subcategoryCheck = await client.query(
        'SELECT id FROM product_subcategories WHERE category_id = $1 AND name = $2',
        [categoryId, subcategory]
      );
      
      if (subcategoryCheck.rows.length === 0) {
        // Create new subcategory if it doesn't exist
        await client.query(
          'INSERT INTO product_subcategories (category_id, name) VALUES ($1, $2)',
          [categoryId, subcategory]
        );
      }
    }
    
    // Create the product
    const insertProductQuery = `
      INSERT INTO products (
        supplier_id, name, description, price, discount_price,
        stock_quantity, category, subcategory, images, is_organic
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const productValues = [
      supplierId, name, description, price, discount_price || null,
      stock_quantity, category, subcategory || null, 
      JSON.stringify(images || []), is_organic || false
    ];
    
    const result = await client.query(insertProductQuery, productValues);
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  } finally {
    client.release();
  }
});

// Update product
router.put('/products/:id', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    const productId = req.params.id;
    const supplierId = req.user.id;
    
    // Check if product exists and belongs to the vendor
    const checkProduct = await client.query(
      'SELECT id FROM products WHERE id = $1 AND supplier_id = $2',
      [productId, supplierId]
    );
    
    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }
    
    const {
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      category,
      subcategory,
      images,
      is_organic,
      is_featured
    } = req.body;
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if category exists
    const categoryCheck = await client.query(
      'SELECT id FROM product_categories WHERE name = $1',
      [category]
    );
    
    if (categoryCheck.rows.length === 0) {
      // Create new category if it doesn't exist
      await client.query(
        'INSERT INTO product_categories (name) VALUES ($1)',
        [category]
      );
    }
    
    // Check if subcategory exists
    if (subcategory) {
      const categoryId = categoryCheck.rows[0]?.id || 
                         (await client.query('SELECT id FROM product_categories WHERE name = $1', [category])).rows[0].id;
                         
      const subcategoryCheck = await client.query(
        'SELECT id FROM product_subcategories WHERE category_id = $1 AND name = $2',
        [categoryId, subcategory]
      );
      
      if (subcategoryCheck.rows.length === 0) {
        // Create new subcategory if it doesn't exist
        await client.query(
          'INSERT INTO product_subcategories (category_id, name) VALUES ($1, $2)',
          [categoryId, subcategory]
        );
      }
    }
    
    // Update the product
    const updateProductQuery = `
      UPDATE products
      SET name = $1, description = $2, price = $3, discount_price = $4,
          stock_quantity = $5, category = $6, subcategory = $7, 
          images = $8, is_organic = $9, is_featured = $10,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 AND supplier_id = $12
      RETURNING *
    `;
    
    const productValues = [
      name, description, price, discount_price || null,
      stock_quantity, category, subcategory || null, 
      JSON.stringify(images || []), is_organic || false, 
      is_featured || false, productId, supplierId
    ];
    
    const result = await client.query(updateProductQuery, productValues);
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.json(result.rows[0]);
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  } finally {
    client.release();
  }
});

// Delete product
router.delete('/products/:id', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const productId = req.params.id;
    const supplierId = req.user.id;
    
    // Check if product exists and belongs to the vendor
    const checkProduct = await pool.query(
      'SELECT id FROM products WHERE id = $1 AND supplier_id = $2',
      [productId, supplierId]
    );
    
    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found or not authorized' });
    }
    
    // Delete the product
    await pool.query(
      'DELETE FROM products WHERE id = $1 AND supplier_id = $2',
      [productId, supplierId]
    );
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// Get vendor orders
router.get('/orders', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all orders where this vendor has items
    const query = `
      SELECT DISTINCT o.id, o.status, o.total_amount, o.created_at, 
             json_build_object('id', u.id, 'name', u.name, 'email', u.email) as customer,
             (
               SELECT json_agg(
                 json_build_object(
                   'id', oi.id,
                   'product_id', oi.product_id,
                   'product_name', p.name,
                   'quantity', oi.quantity,
                   'price', oi.price
                 )
               )
               FROM order_items oi
               JOIN products p ON oi.product_id = p.id
               WHERE oi.order_id = o.id AND oi.supplier_id = $1
             ) as items,
             (
               SELECT SUM(oi.price * oi.quantity)
               FROM order_items oi
               WHERE oi.order_id = o.id AND oi.supplier_id = $1
             ) as vendor_total
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id IN (
        SELECT DISTINCT order_id 
        FROM order_items 
        WHERE supplier_id = $1
      )
      ORDER BY o.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get order details
router.get('/orders/:id', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    // First check if vendor has any items in this order
    const checkAccess = await pool.query(
      'SELECT 1 FROM order_items WHERE order_id = $1 AND supplier_id = $2 LIMIT 1',
      [orderId, userId]
    );
    
    if (checkAccess.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found or not authorized' });
    }
    
    // Get detailed order information
    const orderQuery = `
      SELECT o.*, 
             json_build_object('id', u.id, 'name', u.name, 'email', u.email) as customer
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;
    
    const orderResult = await pool.query(orderQuery, [orderId]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Get items from this vendor in the order
    const itemsQuery = `
      SELECT oi.*,
             json_build_object(
               'id', p.id,
               'name', p.name,
               'price', p.price,
               'images', p.images
             ) as product
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1 AND oi.supplier_id = $2
    `;
    
    const itemsResult = await pool.query(itemsQuery, [orderId, userId]);
    
    // Calculate vendor's total for this order
    const vendorTotal = itemsResult.rows.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity, 
      0
    );
    
    const orderDetails = {
      ...orderResult.rows[0],
      items: itemsResult.rows,
      vendor_total: vendorTotal
    };
    
    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error while fetching order details' });
  }
});

// Get product categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT pc.*, 
             (
               SELECT json_agg(
                 json_build_object('id', ps.id, 'name', ps.name)
               )
               FROM product_subcategories ps
               WHERE ps.category_id = pc.id
             ) as subcategories
      FROM product_categories pc
      ORDER BY pc.name
    `;
    
    const result = await pool.query(query);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

module.exports = router;
