import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Package, 
  Clock,
  Award,
  Leaf,
  Search,
  Filter
} from 'lucide-react';

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const suppliers = [
    {
      id: 1,
      name: "Green Valley Farms",
      rating: 4.9,
      reviews: 245,
      location: "Ooty, Tamil Nadu",
      specialties: ["Organic Spices", "Herbs", "Vegetables"],
      image: "🌱",
      verified: true,
      products: 156,
      deliveryTime: "2-3 days",
      description: "Certified organic farm specializing in premium spices and herbs grown in the Nilgiri hills.",
      phone: "+91 98765 43210",
      email: "contact@greenvalley.com",
      established: "2015",
      certifications: ["Organic", "Fair Trade", "ISO 9001"]
    },
    {
      id: 2,
      name: "Nature's Best",
      rating: 4.8,
      reviews: 189,
      location: "Coimbatore, Tamil Nadu",
      specialties: ["Fresh Herbs", "Leafy Greens", "Microgreens"],
      image: "🍃",
      verified: true,
      products: 89,
      deliveryTime: "1-2 days",
      description: "Family-owned farm providing fresh herbs and greens with same-day harvest guarantee.",
      phone: "+91 98765 43211",
      email: "hello@naturesbest.com",
      established: "2018",
      certifications: ["Organic", "Local Certified"]
    },
    {
      id: 3,
      name: "Coastal Farms",
      rating: 4.7,
      reviews: 134,
      location: "Kanyakumari, Tamil Nadu",
      specialties: ["Coconut Products", "Sea Salt", "Tropical Fruits"],
      image: "🥥",
      verified: true,
      products: 67,
      deliveryTime: "3-4 days",
      description: "Coastal farm specializing in coconut products and tropical produce from Tamil Nadu's southern coast.",
      phone: "+91 98765 43212",
      email: "info@coastalfarms.com",
      established: "2012",
      certifications: ["Organic", "Coastal Certified"]
    },
    {
      id: 4,
      name: "Spice Masters",
      rating: 4.9,
      reviews: 298,
      location: "Kumbakonam, Tamil Nadu",
      specialties: ["Traditional Spices", "Spice Blends", "Dry Fruits"],
      image: "🌶️",
      verified: true,
      products: 203,
      deliveryTime: "2-3 days",
      description: "Three generations of spice expertise, offering authentic Tamil Nadu spice blends and premium dry fruits.",
      phone: "+91 98765 43213",
      email: "orders@spicemasters.com",
      established: "1987",
      certifications: ["Traditional", "Premium Quality", "Export Grade"]
    },
    {
      id: 5,
      name: "Golden Harvest",
      rating: 4.6,
      reviews: 167,
      location: "Thanjavur, Tamil Nadu",
      specialties: ["Rice Varieties", "Millets", "Pulses"],
      image: "🌾",
      verified: true,
      products: 124,
      deliveryTime: "2-4 days",
      description: "Premium rice and grain supplier from the rice bowl of Tamil Nadu, offering traditional and organic varieties.",
      phone: "+91 98765 43214",
      email: "sales@goldenharvest.com",
      established: "2010",
      certifications: ["Organic", "Traditional", "Quality Assured"]
    },
    {
      id: 6,
      name: "Herb Garden Co.",
      rating: 4.8,
      reviews: 156,
      location: "Kodaikanal, Tamil Nadu",
      specialties: ["Medicinal Herbs", "Aromatic Plants", "Essential Oils"],
      image: "🌿",
      verified: false,
      products: 78,
      deliveryTime: "3-5 days",
      description: "Hill station herb garden specializing in medicinal and aromatic plants grown in cool mountain climate.",
      phone: "+91 98765 43215",
      email: "contact@herbgarden.com",
      established: "2019",
      certifications: ["Medicinal Grade", "Hill Grown"]
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const SupplierCard = ({ supplier }: { supplier: typeof suppliers[0] }) => (
    <div className="metal-glass-card hover-lift">
      <div className="flex items-start gap-lg mb-lg">
        <div className="text-4xl bg-gradient-to-br from-sage-silver-light to-sage-silver rounded-lg p-4">
          {supplier.image}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-sm mb-sm">
            <h3 className="heading-metal heading-metal-md">{supplier.name}</h3>
            {supplier.verified && (
              <Award size={16} className="text-metal-accent" />
            )}
          </div>
          <div className="flex items-center gap-sm mb-sm">
            <Star size={14} className="text-metal-accent fill-current" />
            <span className="text-metal-accent font-medium">{supplier.rating}</span>
            <span className="text-metal">({supplier.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-sm text-metal">
            <MapPin size={14} />
            <span>{supplier.location}</span>
          </div>
        </div>
      </div>

      <p className="text-metal mb-lg">{supplier.description}</p>

      <div className="grid grid-cols-2 gap-md mb-lg">
        <div className="flex items-center gap-sm">
          <Package size={16} className="text-metal-accent" />
          <span className="text-metal">{supplier.products} Products</span>
        </div>
        <div className="flex items-center gap-sm">
          <Clock size={16} className="text-metal-accent" />
          <span className="text-metal">{supplier.deliveryTime}</span>
        </div>
        <div className="flex items-center gap-sm">
          <Leaf size={16} className="text-metal-accent" />
          <span className="text-metal">Est. {supplier.established}</span>
        </div>
        <div className="flex items-center gap-sm">
          <Award size={16} className="text-metal-accent" />
          <span className="text-metal">{supplier.certifications.length} Certs</span>
        </div>
      </div>

      <div className="mb-lg">
        <h4 className="heading-metal heading-metal-sm mb-sm">Specialties</h4>
        <div className="flex flex-wrap gap-sm">
          {supplier.specialties.map((specialty, index) => (
            <span key={index} className="badge-metal">
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-lg">
        <h4 className="heading-metal heading-metal-sm mb-sm">Certifications</h4>
        <div className="flex flex-wrap gap-sm">
          {supplier.certifications.map((cert, index) => (
            <span key={index} className="badge-metal badge-metal-accent">
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-md">
        <button className="btn-metal flex-1">
          <Package size={16} />
          View Products
        </button>
        <button className="btn-metal">
          <Phone size={16} />
        </button>
        <button className="btn-metal">
          <Mail size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-xl">
        <h1 className="heading-metal heading-metal-xl mb-md">Our Suppliers</h1>
        <p className="text-metal">Connect with verified local farmers and suppliers across Tamil Nadu</p>
      </div>

      {/* Search and Stats */}
      <div className="metal-glass-card mb-xl">
        <div className="flex flex-col md:flex-row gap-lg items-center justify-between mb-lg">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metal-accent" />
              <input
                type="text"
                placeholder="Search suppliers by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-metal pl-12"
              />
            </div>
          </div>
          
          <button className="btn-metal">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <div className="text-center">
            <div className="heading-metal heading-metal-lg text-metal-accent">200+</div>
            <div className="text-metal">Total Suppliers</div>
          </div>
          <div className="text-center">
            <div className="heading-metal heading-metal-lg text-metal-accent">150+</div>
            <div className="text-metal">Verified</div>
          </div>
          <div className="text-center">
            <div className="heading-metal heading-metal-lg text-metal-accent">4.8★</div>
            <div className="text-metal">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="heading-metal heading-metal-lg text-metal-accent">2-3h</div>
            <div className="text-metal">Avg Delivery</div>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid-metal">
        {filteredSuppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>

      {/* Empty State */}
      {filteredSuppliers.length === 0 && (
        <div className="metal-glass-card text-center py-16">
          <Search size={48} className="text-metal-accent mx-auto mb-lg" />
          <h3 className="heading-metal heading-metal-md mb-md">No suppliers found</h3>
          <p className="text-metal mb-lg">Try adjusting your search criteria</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="btn-metal btn-metal-primary"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="metal-glass-card text-center mt-xl">
        <Leaf size={48} className="text-metal-accent mx-auto mb-lg" />
        <h3 className="heading-metal heading-metal-lg mb-md">Become a Supplier</h3>
        <p className="text-metal mb-xl max-w-2xl mx-auto">
          Join our network of trusted suppliers and reach thousands of customers looking for fresh, quality products.
        </p>
        <button className="btn-metal btn-metal-primary">
          Apply to Become Supplier
        </button>
      </div>
    </div>
  );
};

export default SuppliersPage;
