import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Users, Coffee, UtensilsCrossed } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Header } from '../components/layout/Header';

interface NaattuKit {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  items: string[];
  category: string;
  image: string;
  icon: React.ComponentType<any>;
  popular: boolean;
}

export const NaattuKits: React.FC = () => {
  const [selectedKit, setSelectedKit] = useState<string | null>(null);

  const kits: NaattuKit[] = [
    {
      id: '1',
      name: 'Tiffin Master Kit',
      description: 'Everything for South Indian breakfast business',
      price: 2499,
      originalPrice: 3200,
      items: ['Rice (5kg)', 'Urad Dal (2kg)', 'Coconut Oil (1L)', 'Salt (1kg)', 'Curry Leaves'],
      category: 'Breakfast',
      image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: UtensilsCrossed,
      popular: true
    },
    {
      id: '2',
      name: 'Tea Stall Starter',
      description: 'Complete tea business essentials',
      price: 1899,
      originalPrice: 2400,
      items: ['Tea Powder (2kg)', 'Sugar (5kg)', 'Milk Powder (1kg)', 'Cardamom (100g)', 'Ginger (500g)'],
      category: 'Beverages',
      image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: Coffee,
      popular: false
    },
    {
      id: '3',
      name: 'Chaat Corner Kit',
      description: 'Street food essentials for chaat business',
      price: 1699,
      originalPrice: 2100,
      items: ['Chickpeas (2kg)', 'Tamarind (500g)', 'Chaat Masala (200g)', 'Sev (500g)', 'Green Chutney Mix'],
      category: 'Street Food',
      image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=400',
      icon: ShoppingCart,
      popular: true
    }
  ];

  const handleAddToCart = (kitId: string) => {
    setSelectedKit(kitId);
    // Simulate adding to cart
    setTimeout(() => {
      setSelectedKit(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-olive-50 pb-24">
      <Header title="Naattu Kits" showSearch={false} />
      
      <div className="px-4 space-y-6">
        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="text-center">
            <h2 className="text-lg font-semibold text-olive-800 mb-2">
              Curated Business Kits
            </h2>
            <p className="text-sm text-olive-600">
              Complete ingredient sets for your street food business
            </p>
          </GlassCard>
        </motion.div>

        {/* Buy Together Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard variant="strong" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium">
              Bulk Deal
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-olive-600" size={24} />
              <div>
                <h3 className="font-semibold text-olive-800">Buy Together & Save</h3>
                <p className="text-sm text-olive-600">3+ vendors nearby → Extra 15% off!</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Naattu Kits */}
        <div className="space-y-4">
          {kits.map((kit, index) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden">
                {kit.popular && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-br-lg text-xs font-medium">
                    Popular
                  </div>
                )}
                
                <div className="flex gap-4">
                  {/* Kit Image */}
                  <div className="relative">
                    <img 
                      src={kit.image} 
                      alt={kit.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                      <kit.icon className="text-white" size={24} />
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Kit Header */}
                    <div className="mb-2">
                      <h3 className="font-semibold text-olive-800">{kit.name}</h3>
                      <p className="text-sm text-olive-600">{kit.description}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-olive-800">₹{kit.price}</span>
                      <span className="text-sm text-olive-500 line-through">₹{kit.originalPrice}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Save ₹{kit.originalPrice - kit.price}
                      </span>
                    </div>

                    {/* Items Preview */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {kit.items.slice(0, 2).map((item, i) => (
                          <span 
                            key={i}
                            className="text-xs bg-olive-100 text-olive-700 px-2 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                        <span className="text-xs text-olive-600">
                          +{kit.items.length - 2} more items
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <GlassButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => {/* View kit details */}}
                        className="flex-1"
                      >
                        View Details
                      </GlassButton>
                      <GlassButton 
                        size="sm"
                        onClick={() => handleAddToCart(kit.id)}
                        loading={selectedKit === kit.id}
                        className="flex-1 flex items-center gap-1"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Custom Kit Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GlassCard className="text-center border-2 border-dashed border-olive-300">
            <div className="py-4">
              <h3 className="font-semibold text-olive-800 mb-2">Need Something Custom?</h3>
              <p className="text-sm text-olive-600 mb-4">
                Build your own kit with personalized ingredients
              </p>
              <GlassButton onClick={() => {/* Navigate to custom kit builder */}}>
                Create Custom Kit
              </GlassButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};