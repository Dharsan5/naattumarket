import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  MessageCircle, 
  User,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: t('home'),
      labelTamil: 'முகப்பு'
    },
    { 
      path: '/suppliers', 
      icon: Users, 
      label: t('suppliers'),
      labelTamil: 'சப்ளையர்கள்'
    },
    { 
      path: '/naattu-kits', 
      icon: Package, 
      label: t('naattuKits'),
      labelTamil: 'நாட்டு கிட்கள்'
    },
    { 
      path: '/orders', 
      icon: ShoppingCart, 
      label: t('orders'),
      labelTamil: 'ஆர்டர்கள்'
    },
    { 
      path: '/chat', 
      icon: MessageCircle, 
      label: t('chat'),
      labelTamil: 'அரட்டை'
    },
  ];

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
  };

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-olive-100">
      {/* Top Navigation Bar */}
      <nav className="glass-nav px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-olive-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl">ந</span>
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-olive-800">
                <span className="text-tamil">நாட்டு</span>Market
              </h1>
              <p className="text-xs text-olive-600 text-tamil">நேரடி சப்ளை</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="glass-btn p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <Link to="/notifications">
              <motion.div
                className="relative glass-btn p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              className="glass-btn px-3 py-2 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {i18n.language === 'en' ? 'த' : 'EN'}
            </motion.button>

            {/* Profile */}
            <Link to="/profile">
              <motion.div
                className="glass-btn p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5" />
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden glass-btn p-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 md:hidden"
          >
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="glass-input w-full"
              autoFocus
            />
          </motion.div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 space-y-2"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-olive-500 text-white shadow-glow' 
                      : 'glass-card-hover text-olive-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className={i18n.language === 'ta' ? 'text-tamil' : ''}>
                    {i18n.language === 'ta' ? item.labelTamil : item.label}
                  </span>
                </Link>
              );
            })}
            
            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-glass-medium">
              <button
                onClick={toggleLanguage}
                className="glass-btn px-3 py-2 text-sm"
              >
                {i18n.language === 'en' ? 'த' : 'EN'}
              </button>
              
              <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
                <div className="relative glass-btn p-2">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              </Link>
              
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <div className="glass-btn p-2">
                  <User className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-glass-medium">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center space-y-1 py-2 px-3"
              >
                <motion.div
                  className={`p-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-olive-500 text-white shadow-glow' 
                      : 'text-olive-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs ${
                  isActive ? 'text-olive-800 font-medium' : 'text-olive-600'
                } ${i18n.language === 'ta' ? 'text-tamil' : ''}`}>
                  {i18n.language === 'ta' ? item.labelTamil : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-20"></div>
    </div>
  );
}
