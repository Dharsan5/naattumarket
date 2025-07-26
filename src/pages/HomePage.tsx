import React from 'react';
import { 
  Leaf, 
  Package, 
  Users, 
  ShoppingCart, 
  Star,
  ArrowRight,
  TrendingUp,
  Heart,
  Clock
} from 'lucide-react';

const HomePage: React.FC = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Organic Turmeric Powder",
      price: "₹299",
      originalPrice: "₹399",
      image: "🌿",
      rating: 4.8,
      reviews: 156,
      badge: "Bestseller"
    },
    {
      id: 2,
      name: "Fresh Curry Leaves",
      price: "₹89",
      originalPrice: "₹120",
      image: "🍃",
      rating: 4.9,
      reviews: 203,
      badge: "Fresh"
    },
    {
      id: 3,
      name: "Traditional Coconut Oil",
      price: "₹450",
      originalPrice: "₹550",
      image: "🥥",
      rating: 4.7,
      reviews: 89,
      badge: "Premium"
    }
  ];

  const categories = [
    { name: "Spices", icon: "🌶️", count: 45 },
    { name: "Vegetables", icon: "🥬", count: 32 },
    { name: "Fruits", icon: "🍎", count: 28 },
    { name: "Herbs", icon: "🌿", count: 19 },
    { name: "Grains", icon: "🌾", count: 24 },
    { name: "Oils", icon: "🛢️", count: 15 }
  ];

  const stats = [
    { label: "Happy Customers", value: "10K+", icon: Heart },
    { label: "Products Sold", value: "50K+", icon: Package },
    { label: "Local Suppliers", value: "200+", icon: Users },
    { label: "Delivery Time", value: "2-4h", icon: Clock }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h1 className="heading-metal heading-metal-xl mb-lg">
            Welcome to <span className="text-metal-accent">NaattuMarket</span>
          </h1>
          <p className="text-metal text-lg max-w-2xl mx-auto mb-xl">
            Discover fresh, organic, and locally sourced products directly from farmers and suppliers. 
            Experience the authentic taste of nature with our premium quality ingredients.
          </p>
          <div className="flex gap-md justify-center">
            <button className="btn-metal btn-metal-primary">
              <Package size={16} />
              Shop Now
              <ArrowRight size={16} />
            </button>
            <button className="btn-metal">
              <Users size={16} />
              Find Suppliers
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-metal grid-metal-2 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="metal-glass-card text-center hover-lift">
              <stat.icon size={32} className="text-metal-accent mx-auto mb-md" />
              <div className="heading-metal heading-metal-lg mb-sm">{stat.value}</div>
              <div className="text-metal">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-16">
        <h2 className="heading-metal heading-metal-lg text-center mb-xl">
          Shop by Categories
        </h2>
        <div className="grid-metal grid-metal-3 mb-16">
          {categories.map((category, index) => (
            <div key={index} className="metal-glass-card text-center hover-lift cursor-pointer">
              <div className="text-4xl mb-md">{category.icon}</div>
              <h3 className="heading-metal heading-metal-sm mb-sm">{category.name}</h3>
              <p className="text-metal mb-md">{category.count} Products</p>
              <button className="btn-metal w-full">
                Explore
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-xl">
          <h2 className="heading-metal heading-metal-lg">
            Featured Products
          </h2>
          <button className="btn-metal">
            View All
            <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid-metal mb-16">
          {featuredProducts.map((product) => (
            <div key={product.id} className="metal-glass-card hover-lift">
              <div className="relative mb-md">
                <div className="text-6xl text-center py-8 bg-gradient-to-br from-sage-silver-light to-sage-silver rounded-lg">
                  {product.image}
                </div>
                <div className="absolute top-2 right-2">
                  <span className="badge-metal badge-metal-accent">
                    {product.badge}
                  </span>
                </div>
              </div>
              
              <h3 className="heading-metal heading-metal-sm mb-sm">{product.name}</h3>
              
              <div className="flex items-center gap-sm mb-md">
                <div className="flex items-center gap-xs">
                  <Star size={14} className="text-metal-accent fill-current" />
                  <span className="text-metal-accent font-medium">{product.rating}</span>
                </div>
                <span className="text-metal">({product.reviews} reviews)</span>
              </div>
              
              <div className="flex items-center justify-between mb-md">
                <div className="flex items-center gap-sm">
                  <span className="heading-metal heading-metal-sm text-metal-accent">
                    {product.price}
                  </span>
                  <span className="text-metal line-through text-sm">
                    {product.originalPrice}
                  </span>
                </div>
                <button className="btn-metal btn-metal-primary">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <div className="metal-glass-card text-center">
          <Leaf size={48} className="text-metal-accent mx-auto mb-lg" />
          <h2 className="heading-metal heading-metal-lg mb-md">
            Join Our Growing Community
          </h2>
          <p className="text-metal mb-xl max-w-2xl mx-auto">
            Connect with local farmers, discover seasonal produce, and support sustainable agriculture. 
            Get fresh updates and exclusive offers delivered to your inbox.
          </p>
          <div className="flex gap-md justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="input-metal flex-1"
            />
            <button className="btn-metal btn-metal-primary">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
