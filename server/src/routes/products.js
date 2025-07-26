import express from 'express';
import { getSupabase } from '../config/database.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    
    let query = supabase
      .from('products')
      .select(`
        *,
        suppliers (
          name,
          location,
          rating
        )
      `);
    
    // Filter by category
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Sort products
    if (sort) {
      switch (sort) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Get total count for pagination
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    
    const { data: products, error } = await query;
    
    if (error) {
      throw error;
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        products: products || [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil((count || 0) / limit),
          totalProducts: count || 0,
          hasNext: offset + limit < (count || 0),
          hasPrev: offset > 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        suppliers (
          name,
          location,
          rating,
          phone,
          email
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }
      throw error;
    }
    
    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// GET /api/products/meta/categories - Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);
    
    if (error) {
      throw error;
    }
    
    const categories = [...new Set(data.map(item => item.category))];
    
    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// POST /api/products - Create new product (for suppliers)
router.post('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    
    const {
      name,
      description,
      price,
      original_price,
      category,
      image_url,
      supplier_id,
      in_stock = true
    } = req.body;
    
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        price,
        original_price,
        category,
        image_url,
        supplier_id,
        in_stock
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json({
      status: 'success',
      data: { product },
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: error.message
    });
  }
});

export default router;
