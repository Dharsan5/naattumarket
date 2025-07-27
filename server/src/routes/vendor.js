import express from 'express';
import { authenticateUser, requireSupplier } from '../middleware/auth.js';
import { getSupabase } from '../config/database.js';

const router = express.Router();

// Get vendor dashboard stats
router.get('/stats', authenticateUser, requireSupplier, async (req, res) => {
  try {
    const userId = req.user.id;
    const supabase = getSupabase();
    
    // Get vendor stats (simplified for now)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('supplier_id', userId);
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('supplier_id', userId);
    
    // Get recent orders (last 10)
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        created_at,
        customer:users!orders_user_id_fkey(id, name, email)
      `)
      .eq('supplier_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Get top products (simplified)
    const { data: topProducts, error: topProductsError } = await supabase
      .from('products')
      .select('id, name, price, avg_rating')
      .eq('supplier_id', userId)
      .order('avg_rating', { ascending: false })
      .limit(5);
    
    // Calculate total revenue
    const { data: allOrders, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('supplier_id', userId);
    
    const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    
    // Construct the response
    const dashboardData = {
      stats: {
        total_products: products || 0,
        total_orders: orders || 0,
        total_revenue: totalRevenue,
        avg_rating: 0 // Will be calculated from products
      },
      recentOrders: recentOrders || [],
      topProducts: topProducts || []
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching vendor dashboard:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// Get vendor products
router.get('/products', authenticateUser, requireSupplier, async (req, res) => {
  try {
    const userId = req.user.id;
    const supabase = getSupabase();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('supplier_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching vendor products:', error);
      return res.status(500).json({ message: 'Server error while fetching products' });
    }
    
    res.json(products || []);
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Create new product
router.post('/products', authenticateUser, requireSupplier, async (req, res) => {
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
    const supabase = getSupabase();
    
    // Create the product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        supplier_id: supplierId,
        name,
        description,
        price,
        discount_price: discount_price || null,
        stock_quantity,
        category,
        subcategory: subcategory || null,
        images: images || [],
        is_organic: is_organic || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Server error while creating product' });
    }
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// Update product
router.put('/products/:id', authenticateUser, requireSupplier, async (req, res) => {
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
router.delete('/products/:id', authenticateUser, requireSupplier, async (req, res) => {
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
router.get('/orders', authenticateUser, requireSupplier, async (req, res) => {
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
router.get('/orders/:id', authenticateUser, requireSupplier, async (req, res) => {
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
router.get('/categories', authenticateUser, async (req, res) => {
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

export default router;
