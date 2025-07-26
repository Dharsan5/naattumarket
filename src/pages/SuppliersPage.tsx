import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Package,
  Phone,
  Mail,
  ArrowRight,
  Users,
  Award
} from 'lucide-react';
import { SupplierService, Supplier, SupplierFilters } from '../services/supplierService';
import toast from 'react-hot-toast';

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SupplierFilters>({
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchSuppliers();
  }, [filters]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await SupplierService.getSuppliers(filters);
      
      if (response.success && response.data) {
        setSuppliers(response.data.suppliers);
      } else {
        setSuppliers(mockSuppliers);
        if (response.error) {
          toast.error(response.error);
        }
      }
    } catch (err) {
      setSuppliers(mockSuppliers);
      setError('Failed to load suppliers. Showing demo data.');
      console.error('Supplier fetch error:', err);
    } finally {
      setLoading(false);
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

  const mockSuppliers: Supplier[] = [
    {
      id: "1",
      name: "Green Valley Farms",
      email: "contact@greenvalley.com",
      phone: "+91 9876543210",
      business_type: "Farm",
      rating: 4.9,
      reviews_count: 156,
      description: "Family-owned organic farm specializing in premium spices and herbs",
      location: {
        address: "Mysore Road, Bangalore",
        city: "Bangalore",
        state: "Karnataka",
        postal_code: "560059"
      },
      verified: true,
      created_at: "2020-01-15T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Nature's Best Organic",
      email: "info@naturesbest.com",
      phone: "+91 9876543211",
      business_type: "Processor",
      rating: 4.8,
      reviews_count: 203,
      description: "Leading processor of coconut-based products and traditional spices",
      location: {
        address: "Cochin Industrial Area",
        city: "Kochi",
        state: "Kerala",
        postal_code: "682030"
      },
      verified: true,
      created_at: "2019-03-20T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "3",
      name: "Coastal Farms Collective",
      email: "hello@coastalfarms.com",
      phone: "+91 9876543212",
      business_type: "Cooperative",
      rating: 4.7,
      reviews_count: 89,
      description: "Farmer collective promoting sustainable coastal agriculture",
      location: {
        address: "ECR Main Road, Mahabalipuram",
        city: "Chennai",
        state: "Tamil Nadu",
        postal_code: "603104"
      },
      verified: true,
      created_at: "2021-06-10T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "4",
      name: "Spice Masters Ltd",
      email: "orders@spicemasters.com",
      phone: "+91 9876543213",
      business_type: "Trader",
      rating: 4.6,
      reviews_count: 124,
      description: "Three generations of spice trading expertise",
      location: {
        address: "Spice Market, Old City",
        city: "Hyderabad",
        state: "Telangana",
        postal_code: "500002"
      },
      verified: true,
      created_at: "2018-11-05T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "5",
      name: "Rice Valley Exports",
      email: "export@ricevalley.com",
      phone: "+91 9876543214",
      business_type: "Exporter",
      rating: 4.5,
      reviews_count: 78,
      description: "Premium rice exporter with focus on heritage varieties",
      location: {
        address: "Industrial Estate, Thanjavur",
        city: "Thanjavur",
        state: "Tamil Nadu",
        postal_code: "613005"
      },
      verified: false,
      created_at: "2022-02-28T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];

  const SupplierCard: React.FC<{ supplier: Supplier }> = ({ supplier }) => (
    <div className="card card-elevated group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl">
            🏪
          </div>
          <div className="flex items-center gap-2">
            {supplier.verified && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Award size={12} />
                Verified
              </div>
            )}
            {supplier.rating && (
              <div className="flex items-center gap-1">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="font-semibold">{supplier.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition">{supplier.name}</h3>
        <div className="flex items-center gap-1 text-secondary mb-2">
          <MapPin size={16} />
          <span>{supplier.location.city}, {supplier.location.state}</span>
        </div>
        {supplier.description && (
          <p className="text-sm text-secondary mb-4">{supplier.description}</p>
        )}

        {/* Business Type */}
        <div className="mb-4">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {supplier.business_type}
          </span>
        </div>

        {/* Stats */}
        {supplier.reviews_count && (
          <div className="mb-6 text-center text-sm">
            <div className="font-semibold text-primary">{supplier.reviews_count}</div>
            <div className="text-tertiary">Reviews</div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center gap-2 text-secondary">
            <Phone size={14} />
            <span>{supplier.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <Mail size={14} />
            <span>{supplier.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1">
            View Profile
            <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary">
            Contact
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
          <p className="text-secondary">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Suppliers</h1>
          <p className="text-secondary">Connect with verified suppliers and farmers</p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="card mb-8">
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Suppliers</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search by name, location, or business type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                <Search size={16} />
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Suppliers Grid */}
        {suppliers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Users size={64} className="mx-auto mb-4 text-tertiary" />
            <h3 className="text-xl font-semibold mb-2">No suppliers found</h3>
            <p className="text-secondary">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More */}
        {suppliers.length > 0 && (
          <div className="text-center mt-12">
            <button className="btn btn-secondary">
              Load More Suppliers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;
