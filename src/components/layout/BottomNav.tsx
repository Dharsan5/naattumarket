import React from 'react';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Package, ShoppingCart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Package, label: 'Suppliers', path: '/suppliers' },
  { icon: ShoppingCart, label: 'Kits', path: '/kits' },
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
  { icon: User, label: 'Profile', path: '/profile' }
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-strong border-t metallic-border p-2 mx-4 mb-4 rounded-2xl">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex flex-col items-center p-2 rounded-xl min-w-[60px]
                  ${isActive 
                    ? 'text-olive-600 glass-button glow-green' 
                    : 'text-olive-400 hover:text-olive-600'
                  }
                  transition-all duration-300
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};