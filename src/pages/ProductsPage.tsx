import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star,
  ShoppingCart,
  Heart,
  SlidersHorizontal
} from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    {
      id: 1,
      name: "Organic Turmeric Powder",
      price: "₹299",
      originalPrice: "₹399",
      image: "🌿",
      rating: 4.8,
      reviews: 156,
      badge: "Bestseller",
      category: "Spices",
      description: "Pure organic turmeric powder with high curcumin content",
      inStock: true,
      supplier: "Green Valley Farms"
    },
    {
      id: 2,
      name: "Fresh Curry Leaves",
      price: "₹89",
      originalPrice: "₹120",
      image: "🍃",
      rating: 4.9,
      reviews: 203,
      badge: "Fresh",
      category: "Herbs",
      description: "Fresh curry leaves picked daily from organic gardens",
      inStock: true,
      supplier: "Nature's Best"
    },
    {
      id: 3,
      name: "Traditional Coconut Oil",
      price: "₹450",
      originalPrice: "₹550",
      image: "🥥",
      rating: 4.7,
      reviews: 89,
      badge: "Premium",
      category: "Oils",
      description: "Cold-pressed coconut oil from traditional methods",
      inStock: false,
      supplier: "Coastal Farms"
    },
    {
      id: 4,
      name: "Red Chili Powder",
      price: "₹199",
      originalPrice: "₹250",
      image: "🌶️",
      rating: 4.6,
      reviews: 134,
      badge: "Hot",
      category: "Spices",
      description: "Premium quality red chili powder with perfect heat",
      inStock: true,
      supplier: "Spice Masters"
    },
    {
      id: 5,
      name: "Organic Basil Leaves",
      price: "₹120",
      originalPrice: "₹150",
      image: "🌿",
      rating: 4.8,
      reviews: 98,
      badge: "Organic",
      category: "Herbs",
      description: "Fresh organic basil leaves for aromatic cooking",
      inStock: true,
      supplier: "Herb Garden Co."
    },
    {
      id: 6,
      name: "Premium Basmati Rice",
      price: "₹680",
      originalPrice: "₹750",
      image: "🌾",
      rating: 4.9,
      reviews: 267,
      badge: "Premium",
      category: "Grains",
      description: "Long grain premium basmati rice with authentic aroma",
      inStock: true,
      supplier: "Golden Harvest"
    }
  ];

  const categories = ["All", "Spices", "Herbs", "Oils", "Grains", "Vegetables"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ProductCard = ({ product, isListView = false }: { product: typeof products[0], isListView?: boolean }) => (
    <div className={`metal-glass-card hover-lift ${isListView ? 'flex gap-lg' : ''}`}>
      <div className={`relative ${isListView ? 'w-32 h-32 flex-shrink-0' : 'mb-md'}`}>
        <div className={`text-center bg-gradient-to-br from-sage-silver-light to-sage-silver rounded-lg ${isListView ? 'w-full h-full flex items-center justify-center text-4xl' : 'text-6xl py-8'}`}>
          {product.image}
        </div>
        <div className="absolute top-2 right-2">
          <span className="badge-metal badge-metal-accent">
            {product.badge}
          </span>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <span className="badge-metal">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className={isListView ? 'flex-1' : ''}>
        <div className={`${isListView ? 'flex justify-between items-start' : ''}`}>
          <div className={isListView ? 'flex-1 pr-4' : ''}>
            <h3 className="heading-metal heading-metal-sm mb-sm">{product.name}</h3>
            <p className="text-metal mb-md text-sm">{product.description}</p>
            <p className="text-metal-accent text-sm mb-md">by {product.supplier}</p>
          </div>
          
          <div className={isListView ? 'text-right' : ''}>
            <div className="flex items-center gap-sm mb-md">
              <div className="flex items-center gap-xs">
                <Star size={14} className="text-metal-accent fill-current" />
                <span className="text-metal-accent font-medium">{product.rating}</span>
              </div>
              <span className="text-metal">({product.reviews})</span>
            </div>
            
            <div className={`flex items-center ${isListView ? 'justify-end' : 'justify-between'} gap-md`}>
              <div className="flex items-center gap-sm">
                <span className="heading-metal heading-metal-sm text-metal-accent">
                  {product.price}
                </span>
                <span className="text-metal line-through text-sm">
                  {product.originalPrice}
                </span>
              </div>
              
              <div className="flex gap-sm">
                <button className="btn-metal p-sm" disabled={!product.inStock}>
                  <Heart size={16} />
                </button>
                <button className="btn-metal btn-metal-primary" disabled={!product.inStock}>
                  <ShoppingCart size={16} />
                  {isListView ? 'Add to Cart' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-xl">
        <h1 className="heading-metal heading-metal-xl mb-md">Products</h1>
        <p className="text-metal">Discover fresh, organic products from local suppliers</p>
      </div>

      {/* Search and Filters */}
      <div className="metal-glass-card mb-xl">
        <div className="flex flex-col md:flex-row gap-lg items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metal-accent" />
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
            {/* Category Filter */}
            <div className="flex gap-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn-metal ${selectedCategory === category ? 'btn-metal-primary' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`btn-metal ${viewMode === 'grid' ? 'btn-metal-primary' : ''}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn-metal ${viewMode === 'list' ? 'btn-metal-primary' : ''}`}
              >
                <List size={16} />
              </button>
            </div>
            
            <button className="btn-metal">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-lg">
        <p className="text-metal">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <select className="input-metal w-auto">
          <option>Sort by: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating: High to Low</option>
          <option>Newest First</option>
        </select>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid-metal">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} isListView />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="metal-glass-card text-center py-16">
          <Search size={48} className="text-metal-accent mx-auto mb-lg" />
          <h3 className="heading-metal heading-metal-md mb-md">No products found</h3>
          <p className="text-metal mb-lg">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="btn-metal btn-metal-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
