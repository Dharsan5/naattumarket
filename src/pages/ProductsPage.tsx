import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star,
  ShoppingCart,
  Heart,
  ArrowUpDown,
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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, [filters]);

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
        setProducts([]); // Clear products on error
        if (response.error) {
          toast.error(response.error);
        }
      }
    } catch (err) {
      setProducts([]); // Clear products on error
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
        setCategories(response.data);
      }
    } catch (err) {
      setCategories(['Spices', 'Herbs', 'Oil', 'Rice', 'Pulses', 'Vegetables']);
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilters(prev => ({
      ...prev,
      category: category || undefined,
      page: 1
    }));
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="card card-elevated group">
      <div className="relative p-6">
        {/* Product Image */}
        <div className="text-4xl text-center mb-4">
          {product.image_url || "📦"}
        </div>
        
        {/* Sale Badge */}
        {product.original_price && product.original_price > product.price && (
          <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Sale
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <span className="text-sm font-medium text-gray-500">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        {/* Product Info */}
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition">{product.name}</h3>
        <p className="text-sm text-secondary mb-3">by {product.supplier_name}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-tertiary">({product.reviews_count})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-semibold">₹{product.price}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-tertiary line-through">
              ₹{product.original_price}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            className="btn btn-primary flex-1"
            disabled={!product.in_stock}
          >
            <ShoppingCart size={16} />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button className="btn btn-secondary">
            <Heart size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-20">
        <div className="text-center">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-secondary">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Products</h1>
          <p className="text-secondary">Discover fresh, organic products from local suppliers</p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}
        </div>

        {/* Search & Filters */}
        <div className="card mb-8">
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Products</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="input"
                >
                  <option value="created_at">Newest</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-secondary'} transition`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-secondary'} transition`}
                >
                  <List size={18} />
                </button>
              </div>

              <button type="submit" className="btn btn-primary">
                <Search size={16} />
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-auto-fit' : 'grid-cols-1'} gap-6`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto mb-4 text-tertiary" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-secondary">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn btn-secondary">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
