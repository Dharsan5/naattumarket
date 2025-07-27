import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for vendors and suppliers
const vendorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const supplierIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// India bounds (approximate)
const INDIA_BOUNDS: L.LatLngBoundsLiteral = [
  [6.0, 68.0], // Southwest coordinates
  [37.0, 97.0]  // Northeast coordinates
];

// Major cities in Tamil Nadu and nearby states
const MAJOR_CITIES = [
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { name: 'Vellore', state: 'Tamil Nadu', lat: 12.9716, lng: 79.1596 },
  { name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172 },
  { name: 'Tiruppur', state: 'Tamil Nadu', lat: 11.1085, lng: 77.3411 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 }
];

interface Vendor {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  business_type: string;
  phone: string;
  created_at: string;
}

interface Supplier {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  verified: boolean;
  rating: number;
  phone: string;
  created_at: string;
}

interface IndiaMapProps {
  vendors?: Vendor[];
  suppliers?: Supplier[];
  onMarkerClick?: (type: 'vendor' | 'supplier', id: string) => void;
  className?: string;
}

// Component to set map bounds
const MapBounds: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(INDIA_BOUNDS, { padding: [20, 20] });
  }, [map]);
  
  return null;
};

const IndiaMap: React.FC<IndiaMapProps> = ({ 
  vendors = [], 
  suppliers = [], 
  onMarkerClick,
  className = "h-96 w-full"
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'vendors' | 'suppliers'>('all');

  const filteredVendors = selectedType === 'all' || selectedType === 'vendors' ? vendors : [];
  const filteredSuppliers = selectedType === 'all' || selectedType === 'suppliers' ? suppliers : [];

  return (
    <div className={`relative ${className}`}>
      {/* Filter Controls */}
      <div className="absolute top-4 left-4 z-10 metal-glass-card p-3 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedType === 'all' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
                : 'text-metal hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType('vendors')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedType === 'vendors' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
                : 'text-metal hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200'
            }`}
          >
            Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setSelectedType('suppliers')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedType === 'suppliers' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                : 'text-metal hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200'
            }`}
          >
            Suppliers ({suppliers.length})
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="h-full w-full rounded-xl"
        style={{ minHeight: '400px' }}
      >
        <MapBounds />
        
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Vendor Markers */}
        {filteredVendors.map((vendor) => (
          <Marker
            key={`vendor-${vendor.id}`}
            position={[vendor.location.lat, vendor.location.lng]}
            icon={vendorIcon}
            eventHandlers={{
              click: () => onMarkerClick?.('vendor', vendor.id)
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-green-700 text-lg">{vendor.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{vendor.business_type}</p>
                <p className="text-sm text-gray-500 mb-3">📞 {vendor.phone}</p>
                <div className="flex justify-center">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                    Vendor
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Supplier Markers */}
        {filteredSuppliers.map((supplier) => (
          <Marker
            key={`supplier-${supplier.id}`}
            position={[supplier.location.lat, supplier.location.lng]}
            icon={supplierIcon}
            eventHandlers={{
              click: () => onMarkerClick?.('supplier', supplier.id)
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-blue-700 text-lg">{supplier.name}</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">Rating: {supplier.rating}/5</span>
                  {supplier.verified && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">📞 {supplier.phone}</p>
                <div className="flex justify-center">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                    Supplier
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Major Cities Markers */}
        {MAJOR_CITIES.map((city) => (
          <Marker
            key={`city-${city.name}`}
            position={[city.lat, city.lng]}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [20, 32],
              iconAnchor: [10, 32],
              popupAnchor: [1, -34],
              shadowSize: [32, 32]
            })}
          >
            <Popup>
              <div className="p-3 min-w-[150px]">
                <h3 className="font-semibold text-gray-700 text-base">{city.name}</h3>
                <p className="text-sm text-gray-500">{city.state}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 metal-glass-card p-4 shadow-xl">
        <div className="text-sm font-semibold text-metal mb-3">Legend</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-xs text-metal font-medium">Vendors</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-xs text-metal font-medium">Suppliers</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-500 rounded-full shadow-sm"></div>
            <span className="text-xs text-metal font-medium">Major Cities</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap; 