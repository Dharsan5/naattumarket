import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Bell } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showLocation?: boolean;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'NaattuMarket',
  showSearch = true,
  showLocation = true,
  showNotifications = true
}) => {
  return (
    <div className="sticky top-0 z-40 p-4 pb-2">
      <GlassCard variant="strong" className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.h1 
            className="text-xl font-bold text-olive-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          
          {showLocation && (
            <motion.div 
              className="flex items-center gap-1 text-sm text-olive-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MapPin size={14} />
              <span>T. Nagar</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <motion.button
              className="glass-button p-2 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={18} className="text-olive-600" />
            </motion.button>
          )}
          
          {showNotifications && (
            <motion.button 
              className="glass-button p-2 rounded-lg relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={18} className="text-olive-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </motion.button>
          )}
        </div>
      </GlassCard>
    </div>
  );
};