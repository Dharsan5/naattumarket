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
  Award,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Supplier {
  id: string;
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  business_type: string;
  verified: boolean;
  rating: number;
  reviews_count: number;
  certifications: string[];
  specialties: string[];
  image_url?: string;
}

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`http://localhost:5000/api/suppliers?${params.toString()}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setSuppliers(data.data);
      } else {
        setSuppliers([]);
        setError('Failed to fetch suppliers');
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSuppliers();
  };

  const SupplierCard: React.FC<{ supplier: Supplier }> = ({ supplier }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-olive-100 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl">
            🏪
          </div>
          <div className="flex items-center gap-2">
            {supplier.verified && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Check size={12} />
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
        <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-olive-600 transition">{supplier.name}</h3>
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin size={16} />
          <span>{supplier.location.city}, {supplier.location.state}</span>
        </div>
        {supplier.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>
        )}

        {/* Business Type & Certifications */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-xs bg-olive-100 text-olive-700 px-2 py-1 rounded-full">
            {supplier.business_type}
          </span>
          {supplier.certifications.slice(0, 2).map((cert, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {cert}
            </span>
          ))}
        </div>

        {/* Stats */}
        {supplier.reviews_count && (
          <div className="mb-4 text-center text-sm bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-olive-600 text-lg">{supplier.reviews_count}</div>
            <div className="text-gray-500">Reviews</div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={14} />
            <span>{supplier.contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={14} />
            <span className="truncate">{supplier.contact.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-olive-600 text-white py-2 px-4 rounded-lg hover:bg-olive-700 transition-colors flex items-center justify-center gap-2">
            View Profile
            <ArrowRight size={16} />
          </button>
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
            Contact
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-olive-50 to-yellow-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Verified Suppliers</h1>
          <p className="text-gray-600">Connect with trusted suppliers and farmers</p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">Search Suppliers</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, location, or business type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-transparent"
                />
              </div>
            </div>

            <button type="submit" className="bg-olive-600 text-white py-2 px-6 rounded-lg hover:bg-olive-700 transition-colors flex items-center gap-2">
              <Search size={16} />
              Search
            </button>
          </form>
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
            <Users size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">No suppliers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More */}
        {suppliers.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">
              Load More Suppliers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;
