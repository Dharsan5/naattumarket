import express from 'express';

const router = express.Router();

// Mock suppliers data (same as in products)
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
    established_year: 2015,
    description: 'Leading organic farm in Tamil Nadu, committed to sustainable farming practices.',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400',
    delivery_time: '2-4 hours',
    certifications: ['Organic Certified', 'ISO 9001'],
    reviews_count: 456
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
    established_year: 2010,
    description: 'Fresh dairy products from grass-fed cows in the Western Ghats.',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    delivery_time: '1-3 hours',
    certifications: ['FSSAI Certified', 'A2 Milk Certified'],
    reviews_count: 324
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
    established_year: 2008,
    description: 'Authentic spice blends and herbs from traditional recipes.',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a86a1b2b4aa0?w=400',
    delivery_time: '3-5 hours',
    certifications: ['Spice Board Certified', 'Export Quality'],
    reviews_count: 567
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
    established_year: 2012,
    description: 'Daily fresh catch from the pristine waters of Kanyakumari.',
    image_url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    delivery_time: '4-6 hours',
    certifications: ['Marine Products Certified', 'HACCP Certified'],
    reviews_count: 289
  },
  {
    id: '5',
    name: 'Hill Station Organics',
    location: 'Ooty, Tamil Nadu',
    rating: 4.5,
    verified: true,
    phone: '+91 54321 09876',
    email: 'hello@hillorganics.com',
    specialties: ['Hill Vegetables', 'Tea Products'],
    established_year: 2018,
    description: 'Premium vegetables and tea from the Nilgiri hills.',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    delivery_time: '6-8 hours',
    certifications: ['Organic Certified', 'Fair Trade'],
    reviews_count: 145
  }
];

// GET /api/suppliers - Get all suppliers
router.get('/', async (req, res) => {
  try {
    const { search, location, specialty, sort = 'rating', order = 'desc' } = req.query;
    
    let filteredSuppliers = [...mockSuppliers];
    
    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredSuppliers = filteredSuppliers.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm) ||
        s.specialties.some(spec => spec.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply location filter
    if (location) {
      filteredSuppliers = filteredSuppliers.filter(s => 
        s.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Apply specialty filter
    if (specialty) {
      filteredSuppliers = filteredSuppliers.filter(s => 
        s.specialties.some(spec => spec.toLowerCase().includes(specialty.toLowerCase()))
      );
    }
    
    // Apply sorting
    filteredSuppliers.sort((a, b) => {
      let aVal = a[sort];
      let bVal = b[sort];
      
      if (sort === 'rating' || sort === 'established_year') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    res.status(200).json({
      status: 'success',
      data: filteredSuppliers
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch suppliers',
      error: error.message
    });
  }
});

// GET /api/suppliers/:id - Get supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = mockSuppliers.find(s => s.id === id);
    
    if (!supplier) {
      return res.status(404).json({
        status: 'error',
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch supplier',
      error: error.message
    });
  }
});

// GET /api/suppliers/featured - Get featured suppliers
router.get('/featured', async (req, res) => {
  try {
    const featuredSuppliers = mockSuppliers
      .filter(s => s.verified && s.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    
    res.status(200).json({
      status: 'success',
      data: featuredSuppliers
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured suppliers',
      error: error.message
    });
  }
});

export default router;
