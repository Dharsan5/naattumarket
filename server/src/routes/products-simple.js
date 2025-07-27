import express from 'express';
import { getSupabase } from '../config/database.js';

const router = express.Router();

// Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const supabase = getSupabase();
    
    // Get total count
    const { count: total, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting products:', countError);
      return res.status(500).json({ message: 'Server error while fetching products' });
    }
    
    // Get products with supplier info
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:users!products_supplier_id_fkey(id, name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Server error while fetching products' });
    }
    
    res.json({
      products: products || [],
      pagination: {
        total: total || 0,
        page,
        limit,
        pages: Math.ceil((total || 0) / limit)
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
    const supabase = getSupabase();
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:users!products_supplier_id_fkey(id, name)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(products || []);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const supabase = getSupabase();
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        supplier:users!products_supplier_id_fkey(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error || !product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
