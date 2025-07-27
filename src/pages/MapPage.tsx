import React, { useEffect, useState } from 'react';
import IndiaMap from '../components/IndiaMap';
import { mapService, Vendor, Supplier } from '../services/mapService';
import { MapPin, Users, Building2, Loader2, Filter, RefreshCw, X } from 'lucide-react';

const MapPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const mapData = await mapService.getMapData();
      setVendors(mapData.vendors);
      setSuppliers(mapData.suppliers);
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (type: 'vendor' | 'supplier', id: string) => {
    if (type === 'vendor') {
      const vendor = vendors.find(v => v.id === id);
      setSelectedVendor(vendor || null);
      setSelectedSupplier(null);
    } else {
      const supplier = suppliers.find(s => s.id === id);
      setSelectedSupplier(supplier || null);
      setSelectedVendor(null);
    }
  };

  const filteredVendors = selectedState === 'all' 
    ? vendors 
    : mapService.filterByState(vendors, selectedState);

  const filteredSuppliers = selectedState === 'all' 
    ? suppliers 
    : mapService.filterByState(suppliers, selectedState);

  const states = [
    { value: 'all', label: 'All States' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Telangana', label: 'Telangana' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="metal-glass-card p-8 text-center max-w-md">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-green-600" />
          <h3 className="heading-metal heading-metal-lg mb-2">Loading Map</h3>
          <p className="text-metal">Discovering vendors and suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="metal-glass-card border-b border-green-200/50 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="heading-metal heading-metal-2xl flex items-center gap-4 mb-3">
                <div className="p-3 bg-green-600/10 rounded-xl">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                NaattuMarket Map
              </h1>
              <p className="text-metal text-lg">
                Discover vendors and suppliers across Tamil Nadu and beyond
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6">
              <div className="metal-glass-card p-4 text-center min-w-[120px]">
                <div className="text-3xl font-bold text-green-600 mb-1">{vendors.length}</div>
                <div className="text-metal flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Vendors</span>
                </div>
              </div>
              <div className="metal-glass-card p-4 text-center min-w-[120px]">
                <div className="text-3xl font-bold text-blue-600 mb-1">{suppliers.length}</div>
                <div className="text-metal flex items-center justify-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Suppliers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* State Filter */}
            <div className="metal-glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-green-600" />
                <h3 className="heading-metal heading-metal-lg">Filter by State</h3>
              </div>
              <div className="space-y-3">
                {states.map((state) => (
                  <button
                    key={state.value}
                    onClick={() => setSelectedState(state.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedState === state.value
                        ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                        : 'text-metal hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200'
                    }`}
                  >
                    {state.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Vendor/Supplier Details */}
            {(selectedVendor || selectedSupplier) && (
              <div className="metal-glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-metal heading-metal-lg">
                    {selectedVendor ? 'Vendor Details' : 'Supplier Details'}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedVendor(null);
                      setSelectedSupplier(null);
                    }}
                    className="p-2 text-metal hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {selectedVendor && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-800 text-lg mb-2">{selectedVendor.name}</h4>
                      <p className="text-green-700 mb-3">{selectedVendor.business_type}</p>
                      <div className="space-y-2 text-sm text-green-600">
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          📞 {selectedVendor.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          📍 {selectedVendor.location.lat.toFixed(4)}, {selectedVendor.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <span className="inline-block bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-medium">
                        Vendor
                      </span>
                    </div>
                  </div>
                )}

                {selectedSupplier && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-800 text-lg mb-2">{selectedSupplier.name}</h4>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-blue-700 font-medium">Rating: {selectedSupplier.rating}/5</span>
                        {selectedSupplier.verified && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-blue-600">
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          📞 {selectedSupplier.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          📍 {selectedSupplier.location.lat.toFixed(4)}, {selectedSupplier.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium">
                        Supplier
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="metal-glass-card p-6">
              <h3 className="heading-metal heading-metal-lg mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={loadMapData}
                  className="w-full btn-metal flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
                <button
                  onClick={() => {
                    setSelectedVendor(null);
                    setSelectedSupplier(null);
                  }}
                  className="w-full btn-metal btn-outline"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="metal-glass-card overflow-hidden">
              <IndiaMap
                vendors={filteredVendors}
                suppliers={filteredSuppliers}
                onMarkerClick={handleMarkerClick}
                className="h-[600px]"
              />
            </div>
            
            {/* Map Info */}
            <div className="metal-glass-card mt-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{filteredVendors.length}</div>
                  <div className="text-metal font-medium">Vendors in {selectedState === 'all' ? 'India' : selectedState}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{filteredSuppliers.length}</div>
                  <div className="text-metal font-medium">Suppliers in {selectedState === 'all' ? 'India' : selectedState}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-3xl font-bold text-gray-600 mb-2">{filteredVendors.length + filteredSuppliers.length}</div>
                  <div className="text-metal font-medium">Total Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage; 