import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  User,
  Leaf,
  LogIn,
  LogOut,
  ShoppingBag,
  Settings,
  Layers,
  Heart,
  MapPin
} from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  // Mock user data since auth is removed
  const user = { name: 'Demo User' };
  const isAuthenticated = true;
  
  // Navigation items for the regular navbar
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={18} />
    },
    {
      name: "All Products",
      path: "/products",
      icon: <Package size={18} />
    },
    {
      name: "Categories",
      path: "/products/categories",
      icon: <Layers size={18} />
    },
    {
      name: "Featured",
      path: "/products/featured",
      icon: <Heart size={18} />
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      icon: <Users size={18} />
    },
    {
      name: "Map",
      path: "/map",
      icon: <MapPin size={18} />
    },
    {
      name: "Cart",
      path: "/cart",
      icon: <ShoppingCart size={18} />
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    // Mock logout functionality
    console.log('Logout clicked');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <Leaf size={24} className="text-accent" />
          <span>NaattuMarket</span>
        </Link>

        {/* Main Navigation - Always visible */}
        <ul className="nav-links flex-1 flex justify-center space-x-1 md:space-x-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <User size={18} />
                <span className="hidden md:inline">{user?.name || 'Profile'}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary btn-sm"
            >
              <LogIn size={16} />
              <span className="hidden md:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Full Menu */}
      <div className="md:hidden bg-white border-t flex justify-center py-2">
        <div className="container">
          <div className="flex justify-between">
            {isAuthenticated && (
              <>
                <Link 
                  to="/orders" 
                  className={`nav-link text-sm ${isActive('/orders') ? 'active' : ''}`}
                >
                  <ShoppingBag size={16} />
                  Orders
                </Link>
                <Link 
                  to="/settings" 
                  className={`nav-link text-sm ${isActive('/settings') ? 'active' : ''}`}
                >
                  <Settings size={16} />
                  Settings
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
