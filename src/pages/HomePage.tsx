import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Users,
  Zap,
  RotateCcw,
  ShoppingBag,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Mock data - replace with actual API calls
  const featuredKits = [
    {
      id: '1',
      name: 'Tiffin Master Kit',
      nameTamil: 'டிபன் மாஸ்டர் கிட்',
      price: 2500,
      originalPrice: 3000,
      items: 12,
      image: '/api/placeholder/300/200',
      type: 'tiffin',
      popular: true
    },
    {
      id: '2',
      name: 'Tea Stall Starter',
      nameTamil: 'டீ கடை ஸ்டார்ட்டர்',
      price: 1800,
      originalPrice: 2200,
      items: 8,
      image: '/api/placeholder/300/200',
      type: 'tea',
      popular: false
    },
    {
      id: '3',
      name: 'Chaat Corner Kit',
      nameTamil: 'சாட் கார்னர் கிட்',
      price: 2200,
      originalPrice: 2800,
      items: 15,
      image: '/api/placeholder/300/200',
      type: 'chaat',
      popular: true
    }
  ];

  const nearbySuppliers = [
    {
      id: '1',
      name: 'Murugan Stores',
      nameTamil: 'முருகன் ஸ்டோர்ஸ்',
      rating: 4.8,
      distance: 0.8,
      verified: true,
      online: true,
      speciality: 'Fresh Vegetables',
      specialityTamil: 'புதிய காய்கறிகள்'
    },
    {
      id: '2',
      name: 'Lakshmi Traders',
      nameTamil: 'லட்சுமி ட்ரேடர்ஸ்',
      rating: 4.6,
      distance: 1.2,
      verified: true,
      online: true,
      speciality: 'Spices & Masala',
      specialityTamil: 'மசாலா & கிராம்பு'
    },
    {
      id: '3',
      name: 'Raja Wholesale',
      nameTamil: 'ராஜா ஹோல்சேல்',
      rating: 4.5,
      distance: 1.5,
      verified: false,
      online: false,
      speciality: 'Rice & Grains',
      specialityTamil: 'அரிசி & தானியங்கள்'
    }
  ];

  const quickActions = [
    {
      icon: RotateCcw,
      label: t('reorderYesterday'),
      labelTamil: 'நேற்று மீண்டும் ஆர்டர்',
      color: 'bg-blue-500',
      path: '/reorder'
    },
    {
      icon: Users,
      label: t('buyTogether'),
      labelTamil: 'சேர்ந்து வாங்கு',
      color: 'bg-green-500',
      path: '/group-orders'
    },
    {
      icon: MessageCircle,
      label: t('chat'),
      labelTamil: 'அரட்டை',
      color: 'bg-purple-500',
      path: '/chat'
    },
    {
      icon: TrendingUp,
      label: 'Live Prices',
      labelTamil: 'நேரடி விலை',
      color: 'bg-orange-500',
      path: '/live-prices'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-olive-800 mb-2">
              <span className="text-tamil">வணக்கம்!</span>
            </h1>
            <p className="text-olive-600 text-lg">
              {i18n.language === 'ta' ? 'நாட்டு சப்ளை. நேரடி நேரம்.' : t('tagline')}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-8"
          >
            <div className="glass-card p-1 flex items-center">
              <Search className="w-5 h-5 text-olive-500 ml-3" />
              <input
                type="text"
                placeholder={i18n.language === 'ta' ? 'பொருட்களை தேடுங்கள்...' : t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-olive-800 placeholder-olive-400"
              />
              {state.location && (
                <div className="flex items-center space-x-1 px-3 py-2 bg-olive-100 rounded-lg mr-1">
                  <MapPin className="w-4 h-4 text-olive-500" />
                  <span className="text-sm text-olive-600">{state.location.city}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-olive-800 mb-4 text-tamil">
              {i18n.language === 'ta' ? 'விரைவு செயல்கள்' : t('quickActions')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.path}>
                    <motion.div
                      className="glass-card-hover p-4 text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-xl mx-auto mb-3 flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-medium text-olive-700 text-tamil">
                        {i18n.language === 'ta' ? action.labelTamil : action.label}
                      </p>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Naattu Kits */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-olive-800 text-tamil">
              {i18n.language === 'ta' ? 'சிறப்பு நாட்டு கிட்கள்' : t('featuredKits')}
            </h2>
            <Link to="/naattu-kits" className="text-olive-600 hover:text-olive-800 transition-colors">
              {i18n.language === 'ta' ? 'அனைத்தும் பார்' : 'View All'}
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredKits.map((kit, index) => (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-hover overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={kit.image} 
                    alt={kit.name}
                    className="w-full h-48 object-cover"
                  />
                  {kit.popular && (
                    <div className="absolute top-3 left-3 bg-olive-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {i18n.language === 'ta' ? 'பிரபலம்' : 'Popular'}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-olive-700">
                    {kit.items} {i18n.language === 'ta' ? 'பொருட்கள்' : 'items'}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-olive-800 mb-2 text-tamil">
                    {i18n.language === 'ta' ? kit.nameTamil : kit.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-olive-700">₹{kit.price}</span>
                      <span className="text-sm text-olive-500 line-through">₹{kit.originalPrice}</span>
                    </div>
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {Math.round((1 - kit.price / kit.originalPrice) * 100)}% {i18n.language === 'ta' ? 'தள்ளுபடி' : 'OFF'}
                    </div>
                  </div>
                  
                  <Link to={`/naattu-kits/${kit.id}`}>
                    <motion.button
                      className="glass-btn-primary w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {i18n.language === 'ta' ? 'கிட் பார்' : 'View Kit'}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Suppliers */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-olive-800 text-tamil">
              {i18n.language === 'ta' ? 'அருகிலுள்ள சப்ளையர்கள்' : t('nearbySuppliers')}
            </h2>
            <Link to="/suppliers" className="text-olive-600 hover:text-olive-800 transition-colors">
              {i18n.language === 'ta' ? 'அனைத்தும் பார்' : 'View All'}
            </Link>
          </div>

          <div className="space-y-4">
            {nearbySuppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-olive-200 rounded-xl flex items-center justify-center">
                        <span className="text-olive-700 font-bold text-lg">
                          {supplier.name.charAt(0)}
                        </span>
                      </div>
                      {supplier.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-olive-800 text-tamil">
                          {i18n.language === 'ta' ? supplier.nameTamil : supplier.name}
                        </h3>
                        {supplier.verified && (
                          <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                            {i18n.language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-olive-600 mb-1 text-tamil">
                        {i18n.language === 'ta' ? supplier.specialityTamil : supplier.speciality}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-olive-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{supplier.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{supplier.distance}km</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${supplier.online ? 'text-green-600' : 'text-gray-500'}`}>
                          <div className={`w-2 h-2 rounded-full ${supplier.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span>{supplier.online ? (i18n.language === 'ta' ? 'ஆன்லைன்' : 'Online') : (i18n.language === 'ta' ? 'ஆஃப்லைன்' : 'Offline')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/chat/${supplier.id}`}>
                      <motion.button
                        className="glass-btn p-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </motion.button>
                    </Link>
                    <Link to={`/suppliers/${supplier.id}`}>
                      <motion.button
                        className="glass-btn p-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Updates Banner */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center bg-gradient-to-r from-olive-500/10 to-olive-600/10"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Zap className="w-6 h-6 text-olive-600 animate-pulse" />
              <h3 className="text-xl font-bold text-olive-800 text-tamil">
                {i18n.language === 'ta' ? 'நேரடி அப்டேட்ஸ்' : 'Live Updates'}
              </h3>
            </div>
            <p className="text-olive-600 mb-4 text-tamil">
              {i18n.language === 'ta' 
                ? 'விலை மாற்றங்கள், ஸ்டாக் அப்டேட்ஸ், மற்றும் சிறப்பு ஆஃபர்கள் உடனுக்குடன் பெறுங்கள்' 
                : 'Get instant price changes, stock updates, and special offers in real-time'
              }
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-olive-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-tamil">{i18n.language === 'ta' ? '15 சப்ளையர்கள் ஆன்லைன்' : '15 suppliers online'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span className="text-tamil">{i18n.language === 'ta' ? 'கடைசி அப்டேட்: இப்போது' : 'Last update: now'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
