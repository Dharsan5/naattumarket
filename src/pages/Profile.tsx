import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Settings, HelpCircle, LogOut, Star, Package } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Header } from '../components/layout/Header';

export const Profile: React.FC = () => {
  const stats = [
    { label: 'Orders', value: '24', icon: Package },
    { label: 'Rating', value: '4.8', icon: Star },
    { label: 'Savings', value: '₹2,400', icon: User }
  ];

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => {} },
    { icon: Package, label: 'Order History', action: () => {} },
    { icon: MapPin, label: 'Delivery Addresses', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} }
  ];

  return (
    <div className="min-h-screen bg-olive-50 pb-24">
      <Header title="Profile" showSearch={false} showNotifications={false} />
      
      <div className="px-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="text-center">
            <div className="relative inline-block mb-4">
              <img 
                src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150" 
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <User size={12} className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-olive-800 mb-1">Arun Kumar</h2>
            <p className="text-olive-600 text-sm mb-2">Tea Stall Owner</p>
            <div className="flex items-center justify-center gap-1 text-sm text-olive-600">
              <MapPin size={14} />
              <span>T. Nagar, Chennai</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <GlassCard key={index} className="text-center">
                <stat.icon className="text-olive-600 mx-auto mb-2" size={20} />
                <p className="text-lg font-semibold text-olive-800">{stat.value}</p>
                <p className="text-xs text-olive-600">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Business Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-olive-800 mb-3">Business Details</h3>
          <GlassCard>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-olive-600">Business Type</span>
                <span className="font-medium text-olive-800">Tea Stall</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-olive-600">Phone</span>
                <span className="font-medium text-olive-800">+91 98765 43210</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-olive-600">Member Since</span>
                <span className="font-medium text-olive-800">Jan 2024</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-olive-800 mb-3">Account</h3>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <GlassCard 
                key={index}
                onClick={item.action}
                className="flex items-center gap-4 hover:glow-green transition-all duration-300"
              >
                <div className="p-2 glass-button rounded-lg">
                  <item.icon size={18} className="text-olive-600" />
                </div>
                <span className="flex-1 font-medium text-olive-800">{item.label}</span>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassButton 
            onClick={() => {/* Handle logout */}}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </GlassButton>
        </motion.div>
      </div>
    </div>
  );
};