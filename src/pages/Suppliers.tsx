import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Header } from '../components/layout/Header';

interface Supplier {
  id: string;
  name: string;
  rating: number;
  distance: string;
  verified: boolean;
  products: string[];
  lastSeen: string;
  image: string;
  deliveryTime: string;
}

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading suppliers
    setTimeout(() => {
      setSuppliers([
        {
          id: '1',
          name: 'Ravi Fresh Vegetables',
          rating: 4.8,
          distance: '0.5 km',
          verified: true,
          products: ['Tomatoes', 'Onions', 'Green Chilies', 'Coriander'],
          lastSeen: '2 min ago',
          image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg?auto=compress&cs=tinysrgb&w=400',
          deliveryTime: '30 min'
        },
        {
          id: '2',
          name: 'Lakshmi Spices & More',
          rating: 4.6,
          distance: '0.8 km',
          verified: true,
          products: ['Tea Powder', 'Sugar', 'Salt', 'Turmeric'],
          lastSeen: '5 min ago',
          image: 'https://images.pexels.com/photos/4198022/pexels-photo-4198022.jpeg?auto=compress&cs=tinysrgb&w=400',
          deliveryTime: '45 min'
        },
        {
          id: '3',
          name: 'Kumar Oil & Grains',
          rating: 4.5,
          distance: '1.2 km',
          verified: false,
          products: ['Cooking Oil', 'Rice', 'Dal', 'Wheat Flour'],
          lastSeen: '15 min ago',
          image: 'https://images.pexels.com/photos/4198790/pexels-photo-4198790.jpeg?auto=compress&cs=tinysrgb&w=400',
          deliveryTime: '60 min'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-olive-50 pb-24">
        <Header title="Local Suppliers" />
        <div className="px-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-olive-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-olive-200 rounded w-3/4"></div>
                  <div className="h-3 bg-olive-200 rounded w-1/2"></div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive-50 pb-24">
      <Header title="Local Suppliers" />
      
      <div className="px-4 space-y-4">
        {suppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="flex items-start gap-4">
                {/* Supplier Image */}
                <div className="relative">
                  <img 
                    src={supplier.image} 
                    alt={supplier.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  {supplier.verified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {/* Supplier Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-olive-800 flex items-center gap-1">
                        {supplier.name}
                        {supplier.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-olive-600">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span>{supplier.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{supplier.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{supplier.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {supplier.products.slice(0, 3).map((product, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-olive-100 text-olive-700 px-2 py-1 rounded-full"
                        >
                          {product}
                        </span>
                      ))}
                      {supplier.products.length > 3 && (
                        <span className="text-xs text-olive-600">
                          +{supplier.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-olive-500">
                      Active {supplier.lastSeen}
                    </span>
                    <div className="flex gap-2">
                      <GlassButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => {/* Navigate to supplier details */}}
                      >
                        View
                      </GlassButton>
                      <GlassButton 
                        size="sm"
                        onClick={() => {/* Start chat */}}
                        className="flex items-center gap-1"
                      >
                        <MessageCircle size={14} />
                        Chat
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {/* Live Stock Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard variant="strong" className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-olive-800">Live Updates</span>
            </div>
            <p className="text-xs text-olive-600">
              Stock levels update in real-time. Chat directly for instant availability.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};