import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Clock, TrendingUp, Package, MessageCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Header } from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      icon: Package,
      title: 'Browse Suppliers',
      description: 'Find fresh supplies near you',
      action: () => navigate('/suppliers'),
      color: 'text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Chat Now',
      description: 'Talk to suppliers instantly',
      action: () => navigate('/chat'),
      color: 'text-green-600'
    }
  ];

  const recentOrders = [
    { id: 1, supplier: 'Ravi Vegetables', items: 'Tomato, Onion, Green Chili', time: '2 hours ago' },
    { id: 2, supplier: 'Lakshmi Spices', items: 'Tea Powder, Sugar', time: 'Yesterday' }
  ];

  return (
    <div className="min-h-screen bg-olive-50 pb-24">
      <Header />
      
      <div className="px-4 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={16} className="text-olive-600" />
              <span className="text-sm text-olive-600">
                {currentTime.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-olive-800 mb-1">
              Good {currentTime.getHours() < 12 ? 'Morning' : 'Afternoon'}!
            </h2>
            <p className="text-olive-600 text-sm">Ready to stock up fresh supplies?</p>
          </GlassCard>
        </motion.div>

        {/* Voice Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-olive-800 mb-1">Voice Search</h3>
              <p className="text-sm text-olive-600">Say what you need in Tamil or English</p>
            </div>
            <GlassButton 
              className="p-3 rounded-full glow-green-strong"
              onClick={() => {/* Implement voice search */}}
            >
              <Mic size={20} className="text-white" />
            </GlassButton>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-olive-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <GlassCard 
                key={index} 
                onClick={action.action}
                className="flex items-center gap-4 hover:glow-green transition-all duration-300"
              >
                <div className={`p-3 rounded-lg glass-button ${action.color}`}>
                  <action.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-olive-800">{action.title}</h4>
                  <p className="text-sm text-olive-600">{action.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Trending Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-olive-600" />
            <h3 className="text-lg font-semibold text-olive-800">Trending Today</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {['Fresh Tomatoes ₹25/kg', 'Tea Powder ₹120/kg', 'Onions ₹30/kg'].map((item, index) => (
              <GlassCard 
                key={index}
                className="min-w-[140px] text-center whitespace-nowrap"
              >
                <p className="text-sm font-medium text-olive-800">{item}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-olive-800 mb-3">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <GlassCard key={order.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-olive-800">{order.supplier}</h4>
                  <p className="text-sm text-olive-600">{order.items}</p>
                  <p className="text-xs text-olive-500 mt-1">{order.time}</p>
                </div>
                <GlassButton 
                  size="sm"
                  onClick={() => {/* Reorder functionality */}}
                >
                  Reorder
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};