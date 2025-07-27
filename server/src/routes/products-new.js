import express from 'express';

const router = express.Router();

// Mock suppliers data
const mockSuppliers = [
  {
    id: '1',
    name: 'Green Valley Farm',
    location: 'Chennai, Tamil Nadu',
    rating: 4.8,
    verified: true,
    phone: '+91 98765 43210',
    email: 'contact@greenvalley.com',
    specialties: ['Organic Vegetables', 'Fresh Fruits'],
    established_year: 2015
  },
  {
    id: '2',
    name: 'Sunrise Dairy',
    location: 'Coimbatore, Tamil Nadu',
    rating: 4.6,
    verified: true,
    phone: '+91 87654 32109',
    email: 'info@sunrisedairy.com',
    specialties: ['Dairy Products', 'Organic Milk'],
    established_year: 2010
  },
  {
    id: '3',
    name: 'Spice Garden',
    location: 'Madurai, Tamil Nadu',
    rating: 4.9,
    verified: true,
    phone: '+91 76543 21098',
    email: 'orders@spicegarden.com',
    specialties: ['Traditional Spices', 'Herbs'],
    established_year: 2008
  },
  {
    id: '4',
    name: 'Ocean Fresh Seafood',
    location: 'Kanyakumari, Tamil Nadu',
    rating: 4.7,
    verified: true,
    phone: '+91 65432 10987',
    email: 'fresh@oceanseafood.com',
    specialties: ['Fresh Fish', 'Seafood'],
    established_year: 2012
  }
];

// Mock products data with comprehensive details
const mockProducts = [
  // Vegetables
  {
    id: '1',
    name: 'Fresh Organic Tomatoes',
    price: 45.00,
    original_price: 55.00,
    category: 'Vegetables',
    image_url: 'https://images.unsplash.com/photo-1546470427-e26264be0b4b?w=400',
    rating: 4.5,
    reviews_count: 124,
    badge: 'Organic',
    in_stock: true,
    supplier_id: '1',
    supplier: mockSuppliers[0],
    description: 'Fresh organic tomatoes grown without pesticides. Perfect for cooking and salads.'
  },
  {
    id: '2',
    name: 'Green Leafy Spinach',
    price: 25.00,
    original_price: 30.00,
    category: 'Vegetables',
    image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    rating: 4.3,
    reviews_count: 89,
    badge: 'Fresh',
    in_stock: true,
    supplier_id: '1',
    supplier: mockSuppliers[0],
    description: 'Nutrient-rich spinach leaves, freshly harvested from organic farms.'
  },
  {
    id: '3',
    name: 'Red Onions',
    price: 35.00,
    original_price: 40.00,
    category: 'Vegetables',
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    rating: 4.2,
    reviews_count: 67,
    badge: null,
    in_stock: true,
    supplier_id: '1',
    supplier: mockSuppliers[0],
    description: 'Premium quality red onions with strong flavor and long shelf life.'
  },

  // Dairy Products
  {
    id: '4',
    name: 'Farm Fresh Milk',
    price: 60.00,
    original_price: 65.00,
    category: 'Dairy',
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    rating: 4.8,
    reviews_count: 203,
    badge: 'A2 Milk',
    in_stock: true,
    supplier_id: '2',
    supplier: mockSuppliers[1],
    description: 'Pure A2 milk from grass-fed cows, rich in nutrients and taste.'
  },
  {
    id: '5',
    name: 'Organic Curd',
    price: 45.00,
    original_price: 50.00,
    category: 'Dairy',
    image_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
    rating: 4.6,
    reviews_count: 156,
    badge: 'Organic',
    in_stock: true,
    supplier_id: '2',
    supplier: mockSuppliers[1],
    description: 'Creamy organic curd made from fresh milk, perfect for breakfast.'
  },
  {
    id: '6',
    name: 'Fresh Paneer',
    price: 180.00,
    original_price: 200.00,
    category: 'Dairy',
    image_url: 'https://images.unsplash.com/photo-1631788442849-ec8d01c7d4de?w=400',
    rating: 4.7,
    reviews_count: 134,
    badge: 'Handmade',
    in_stock: true,
    supplier_id: '2',
    supplier: mockSuppliers[1],
    description: 'Soft and fresh paneer made daily from pure milk.'
  },

  // Spices & Herbs
  {
    id: '7',
    name: 'Turmeric Powder',
    price: 120.00,
    original_price: 140.00,
    category: 'Spices',
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
    rating: 4.9,
    reviews_count: 289,
    badge: 'Premium',
    in_stock: true,
    supplier_id: '3',
    supplier: mockSuppliers[2],
    description: 'High-quality turmeric powder with rich color and aroma.'
  },
  {
    id: '8',
    name: 'Red Chili Powder',
    price: 150.00,
    original_price: 170.00,
    category: 'Spices',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a86a1b2b4aa0?w=400',
    rating: 4.8,
    reviews_count: 198,
    badge: 'Hot',
    in_stock: true,
    supplier_id: '3',
    supplier: mockSuppliers[2],
    description: 'Spicy red chili powder perfect for authentic Indian cuisine.'
  },
  {
    id: '9',
    name: 'Garam Masala',
    price: 200.00,
    original_price: 220.00,
    category: 'Spices',
    image_url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400',
    rating: 4.7,
    reviews_count: 167,
    badge: 'Traditional',
    in_stock: true,
    supplier_id: '3',
    supplier: mockSuppliers[2],
    description: 'Authentic garam masala blend with traditional spices.'
  },

  // Seafood
  {
    id: '10',
    name: 'Fresh Pomfret',
    price: 450.00,
    original_price: 500.00,
    category: 'Seafood',
    image_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    rating: 4.6,
    reviews_count: 89,
    badge: 'Fresh Catch',
    in_stock: true,
    supplier_id: '4',
    supplier: mockSuppliers[3],
    description: 'Fresh pomfret fish caught daily from clean waters.'
  },
  {
    id: '11',
    name: 'Tiger Prawns',
    price: 650.00,
    original_price: 700.00,
    category: 'Seafood',
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400',
    rating: 4.8,
    reviews_count: 112,
    badge: 'Premium',
    in_stock: true,
    supplier_id: '4',
    supplier: mockSuppliers[3],
    description: 'Large tiger prawns, perfect for grilling and curries.'
  },

  // Fruits
  {
    id: '12',
    name: 'Alphonso Mangoes',
    price: 280.00,
    original_price: 320.00,
    category: 'Fruits',
    image_url: 'https://images.unsplash.com/photo-1553279768-865429fe76b0?w=400',
    rating: 4.9,
    reviews_count: 245,
    badge: 'Seasonal',
    in_stock: true,
    supplier_id: '1',
    supplier: mockSuppliers[0],
    description: 'Sweet and juicy Alphonso mangoes, the king of fruits.'
  },
  {
    id: '13',
    name: 'Fresh Bananas',
    price: 40.00,
    original_price: 45.00,
    category: 'Fruits',
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    rating: 4.4,
    reviews_count: 178,
    badge: 'Energy',
    in_stock: true,
    supplier_id: '1',
    supplier: mockSuppliers[0],
    description: 'Ripe and sweet bananas, rich in potassium and vitamins.'
  },

  // Grains & Pulses
  {
    id: '14',
    name: 'Basmati Rice',
    price: 180.00,
    original_price: 200.00,
    category: 'Grains',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    rating: 4.7,
    reviews_count: 234,
    badge: 'Premium',
    in_stock: true,
    supplier_id: '1',
    supplier: mockSuppliers[0],
    description: 'Long grain basmati rice with excellent aroma and taste.'
  },
  {
    id: '15',
    name: 'Toor Dal',
    price: 140.00,
    original_price: 160.00,
    category: 'Pulses',
    image_url: 'https://images.unsplash.com/photo-1599909929085-dcb1b2904ed0?w=400',
    rating: 4.5,
    reviews_count: 156,
    badge: 'Protein Rich',
    in_stock: true,
    supplier_id: '1',
    supplier: mockSuppliers[0],
    description: 'High-quality toor dal, rich in protein and nutrients.'
  }
];

// Categories data
const categories = [
  'Vegetables',
  'Dairy', 
  'Spices',
  'Seafood',
  'Fruits',
  'Grains',
  'Pulses'
];

// GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'created_at', order = 'desc', limit = 20, offset = 0 } = req.query;
    
    let filteredProducts = [...mockProducts];
    
    // Apply category filter
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aVal = a[sort];
      let bVal = b[sort];
      
      if (sort === 'price') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: 'success',
      data: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: endIndex < filteredProducts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET /api/products/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = mockProducts
      .filter(p => p.rating >= 4.5 || p.badge)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    
    res.status(200).json({
      status: 'success',
      data: featuredProducts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get product by ID  
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;
    
    const categoryProducts = mockProducts
      .filter(p => p.category.toLowerCase() === category.toLowerCase())
      .slice(0, parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      data: categoryProducts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
});

export default router;
