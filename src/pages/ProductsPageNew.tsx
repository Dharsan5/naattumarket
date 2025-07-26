import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Package
} from 'lucide-react';
import { ProductService, Product, ProductFilters } from '../services/productService';
import toast from 'react-hot-toast';

const ProductsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [productCategories, setProductCategories] = useState<string[]>([]);

  // Fetch products on component mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getProducts(filters);
      
      if (response.success && response.data) {
        setProducts(response.data.products);
      } else {
        // Fallback to mock data if API fails
        setProducts(mockProducts);
        if (response.error) {
          toast.error(response.error);
        }
      }
    } catch (err) {
      // Fallback to mock data
      setProducts(mockProducts);
      setError('Failed to load products. Showing demo data.');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ProductService.getCategories();
      if (response.success && response.data) {
        setProductCategories(response.data);
      }
    } catch (err) {
      // Use default categories if API fails
      setProductCategories(['Spices', 'Herbs', 'Oil', 'Rice', 'Pulses', 'Vegetables']);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category,
      page: 1
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
      page: 1
    }));
  };

  // Mock products as fallback
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Organic Turmeric Powder",
      price: 299,
      original_price: 399,
      image_url: "🌿",
      rating: 4.8,
      reviews_count: 156,
      category: "Spices",
      description: "Pure organic turmeric powder with high curcumin content",
      in_stock: true,
      supplier_name: "Green Valley Farms",
      supplier_id: "sup1",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Fresh Curry Leaves",
      price: 89,
      original_price: 120,
      image_url: "🍃",
      rating: 4.9,
      reviews_count: 203,
      category: "Herbs",
      description: "Fresh curry leaves picked daily from organic gardens",
      in_stock: true,
      supplier_name: "Nature's Best",
      supplier_id: "sup2",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      name: "Traditional Coconut Oil",
      price: 450,
      original_price: 550,
      image_url: "🥥",
      rating: 4.7,
      reviews_count: 89,
      category: "Oil",
      description: "Cold-pressed coconut oil from traditional methods",
      in_stock: false,
      supplier_name: "Coastal Farms",
      supplier_id: "sup3",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "4",
      name: "Red Chili Powder",
      price: 199,
      original_price: 250,
      image_url: "🌶️",
      rating: 4.6,
      reviews_count: 124,
      category: "Spices",
      description: "Spicy red chili powder with authentic flavor",
      in_stock: true,
      supplier_name: "Spice Masters",
      supplier_id: "sup4",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "5",
      name: "Organic Basmati Rice",
      price: 120,
      original_price: 150,
      image_url: "🍚",
      rating: 4.5,
      reviews_count: 78,
      category: "Rice",
      description: "Premium organic basmati rice with long grains",
      in_stock: true,
      supplier_name: "Rice Valley",
      supplier_id: "sup5",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "6",
      name: "Raw Honey",
      price: 680,
      original_price: 800,
      image_url: "🍯",
      rating: 4.8,
      reviews_count: 167,
      category: "Natural Products",
      description: "Pure raw honey directly from beehives",
      in_stock: true,
      supplier_name: "Bee Farm Co.",
      supplier_id: "sup6",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];

  const allCategories = ["All", ...productCategories];

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="metal-glass-card hover-lift">
      <div className="relative mb-lg">
        <div className="text-4xl mb-md text-center">
          {product.image_url || "📦"}
        </div>
        {product.original_price && product.original_price > product.price && (
          <div className="badge-metal-accent absolute top-2 right-2">
            Sale
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-glass-metal-dark bg-opacity-50 flex items-center justify-center rounded-lg">
            <span className="badge-metal">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="mb-lg">
        <h3 className="font-semibold text-text-primary mb-sm">{product.name}</h3>
        <p className="text-metal-accent text-sm mb-md">by {product.supplier_name}</p>
        <p className="text-sm text-text-muted mb-md">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-md">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-earth-gold fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-metal">({product.reviews_count})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-text-primary">₹{product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-text-muted line-through">
                ₹{product.original_price}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn-metal-primary flex-1" disabled={!product.in_stock}>
            <ShoppingCart size={16} />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button className="btn-metal p-sm">
            <Heart size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-5xl">
        <div className="text-center">
          <div className="loading-metal mx-auto mb-md" style={{ width: '40px', height: '40px' }} />
          <p className="text-metal">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5xl">
      {/* Header */}
      <div className="mb-4xl">
        <h1 className="heading-metal-xl mb-lg">Products</h1>
        <p className="text-metal">Discover fresh, organic products from local suppliers</p>
        {error && (
          <div className="mt-md p-md bg-glass-metal-medium border border-border-accent rounded-lg">
            <p className="text-sm text-text-accent">{error}</p>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="metal-glass-card mb-3xl">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-lg items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-metal pl-12"
              />
            </div>
          </div>
          
          <div className="flex gap-md items-center">
            {/* View Mode Toggle */}
            <div className="flex bg-glass-metal-light rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-glass-metal-medium text-text-accent' : 'text-text-muted'}`}
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-glass-metal-medium text-text-accent' : 'text-text-muted'}`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input-metal"
            >
              <option value="created_at">Newest</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>

            <button type="submit" className="btn-metal-primary">
              <Search size={16} />
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Category Filter */}
      <div className="mb-3xl">
        <div className="flex flex-wrap gap-sm">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category === 'All' ? '' : category)}
              className={`btn-metal ${filters.category === category || (category === 'All' && !filters.category) ? 'btn-metal-primary' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className={viewMode === 'grid' ? 'grid-metal' : 'space-y-lg'}>
        {products.length > 0 ? (
          products.map(renderProductCard)
        ) : (
          <div className="col-span-full text-center py-5xl">
            <Package size={64} className="mx-auto mb-lg text-text-muted" />
            <h3 className="heading-metal-md mb-md">No products found</h3>
            <p className="text-metal">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {products.length > 0 && (
        <div className="text-center mt-4xl">
          <button className="btn-metal-primary">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
