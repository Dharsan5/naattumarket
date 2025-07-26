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
  CheckCircle,
  BarChart,
  LineChart,
  PieChart,
  Zap
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
      title: "Fast Delivery",
      description: "Farm-fresh products delivered to your doorstep"
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: "Quality Assured",
      description: "Every product is tested and verified for quality"
    }
  ];

  const categories = [
    { name: "Fresh Spices", icon: <BarChart size={24} />, count: "50+ products" },
    { name: "Organic Herbs", icon: <LineChart size={24} />, count: "30+ products" },
    { name: "Natural Oils", icon: <PieChart size={24} />, count: "25+ products" },
    { name: "Premium Rice", icon: <Zap size={24} />, count: "20+ products" },
    { name: "Pure Honey", icon: <Award size={24} />, count: "15+ products" },
    { name: "Traditional Pulses", icon: <TrendingUp size={24} />, count: "40+ products" }
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
      {/* Main Dashboard Section */}
      <section className="py-12">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Welcome to NaattuMarket</h1>
            <div className="flex gap-3">
              <button className="btn btn-primary">
                Browse Products
                <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary">
                Find Suppliers
              </button>
            </div>
          </div>
          
          <div className="dashboard-stats mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="dashboard-card text-center">
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                <p className="text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="mb-10">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Discover Fresh Organic Products</h2>
                <Link to="/products" className="btn btn-ghost btn-sm">
                  View all
                  <ArrowRight size={14} />
                </Link>
              </div>
              <p className="text-secondary mb-6">
                Connect directly with local farmers and suppliers 
                for the freshest organic products delivered to your doorstep.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start p-4 rounded-md border border-light hover:border-main transition-all">
                    <div className="mr-4 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-tertiary">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <div className="dashboard-card h-full">
                <div className="dashboard-card-header">
                  <h2 className="dashboard-card-title">Featured Suppliers</h2>
                  <Link to="/suppliers" className="btn btn-ghost btn-sm">
                    All suppliers
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid gap-4">
                  {suppliers.map((supplier, index) => (
                    <div key={index} className="border border-light rounded-md p-4 hover:bg-hover transition-all">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{supplier.name}</h3>
                        <div className="flex items-center">
                          <Star size={16} className="text-amber" />
                          <span className="ml-1 text-sm font-medium">{supplier.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-tertiary text-sm mt-1">
                        <MapPin size={14} />
                        <span>{supplier.location}</span>
                      </div>
                      <div className="text-sm mt-2">
                        <span className="text-primary font-medium">{supplier.specialty}</span>
                        <span className="text-tertiary ml-2">({supplier.products} products)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Browse Categories</h2>
              </div>
              <div className="grid gap-3">
                {categories.map((category, index) => (
                  <Link key={index} to={`/products?category=${category.name}`} className="flex justify-between items-center p-3 rounded-md border border-light hover:border-main hover:bg-hover transition-all">
                    <div className="flex items-center">
                      <div className="p-2 bg-muted rounded-md mr-3">
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-sm text-tertiary">{category.count}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">Ready to get started?</h2>
            </div>
            <p className="text-secondary mb-6">
              Join thousands of customers who trust NaattuMarket for their organic product needs.
              Get started with just a few clicks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn btn-primary">
                Browse Products
                <ArrowRight size={16} />
              </Link>
              <Link to="/suppliers" className="btn btn-secondary">
                Meet Our Suppliers
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
