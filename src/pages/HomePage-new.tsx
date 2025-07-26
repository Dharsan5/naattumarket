import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Truck, 
  Shield,
  Leaf,
  MapPin,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Leaf className="text-primary" size={24} />,
      title: "100% Organic",
      description: "Certified organic products sourced directly from farmers"
    },
    {
      icon: <Users className="text-primary" size={24} />,
      title: "Local Suppliers",
      description: "Supporting local farmers and producers in your area"
    },
    {
      icon: <Truck className="text-primary" size={24} />,
      title: "Fresh Delivery",
      description: "Farm-fresh products delivered to your doorstep"
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: "Quality Assured",
      description: "Every product is tested and verified for quality"
    }
  ];

  const categories = [
    { name: "Fresh Spices", emoji: "🌿", count: "50+ products" },
    { name: "Organic Herbs", emoji: "🍃", count: "30+ products" },
    { name: "Natural Oils", emoji: "🥥", count: "25+ products" },
    { name: "Premium Rice", emoji: "🍚", count: "20+ products" },
    { name: "Pure Honey", emoji: "🍯", count: "15+ products" },
    { name: "Traditional Pulses", emoji: "🫘", count: "40+ products" }
  ];

  const suppliers = [
    {
      name: "Green Valley Farms",
      location: "Karnataka",
      rating: 4.9,
      products: 45,
      specialty: "Organic Spices"
    },
    {
      name: "Nature's Best",
      location: "Kerala",
      rating: 4.8,
      products: 32,
      specialty: "Fresh Herbs"
    },
    {
      name: "Coastal Farms",
      location: "Tamil Nadu",
      rating: 4.7,
      products: 28,
      specialty: "Coconut Products"
    }
  ];

  const stats = [
    { label: "Active Suppliers", value: "500+" },
    { label: "Happy Customers", value: "10,000+" },
    { label: "Products Available", value: "2,500+" },
    { label: "Cities Served", value: "50+" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-gray-50 py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Fresh, <span className="text-primary">Organic</span> Products
                <br />
                From Local Farms
              </h1>
              <p className="text-xl text-secondary mb-8 leading-relaxed">
                Connect directly with local farmers and suppliers to get the freshest, 
                highest quality organic products delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/products" className="btn btn-primary btn-lg">
                  Shop Now
                  <ArrowRight size={20} />
                </Link>
                <Link to="/suppliers" className="btn btn-secondary btn-lg">
                  Find Suppliers
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-secondary">Verified Suppliers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">10k+</div>
                  <div className="text-sm text-secondary">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center text-8xl">
                🌱
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="font-semibold text-sm">4.9 Rating</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="font-semibold text-sm">100% Organic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose NattuMarket?</h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              We're committed to bringing you the best organic products while supporting local farmers and communities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover text-center">
                <div className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-secondary">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-secondary">
              Explore our wide range of organic products
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="card card-hover group"
              >
                <div className="p-8 text-center">
                  <div className="text-5xl mb-4">{category.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition">
                    {category.name}
                  </h3>
                  <p className="text-secondary">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Suppliers Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Suppliers</h2>
            <p className="text-xl text-secondary">
              Meet our top-rated suppliers and farmers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {suppliers.map((supplier, index) => (
              <div key={index} className="card card-hover">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl">
                      🏪
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="font-semibold">{supplier.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{supplier.name}</h3>
                  <div className="flex items-center gap-1 text-secondary mb-2">
                    <MapPin size={16} />
                    <span>{supplier.location}</span>
                  </div>
                  <p className="text-sm text-secondary mb-4">{supplier.specialty}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-tertiary">{supplier.products} products</span>
                    <Link to="/suppliers" className="text-primary hover:text-primary/80 font-medium">
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/suppliers" className="btn btn-secondary">
              View All Suppliers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="card card-elevated max-w-4xl mx-auto text-center">
            <div className="p-12">
              <div className="text-6xl mb-8">🚀</div>
              <h2 className="text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
              <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
                Join thousands of customers who trust NattuMarket for their organic product needs. 
                Fresh, quality products delivered right to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn btn-primary btn-lg">
                  Browse Products
                  <ArrowRight size={20} />
                </Link>
                <Link to="/auth" className="btn btn-secondary btn-lg">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
