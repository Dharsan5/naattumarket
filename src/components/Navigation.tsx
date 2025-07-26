import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  User,
  Leaf,
  Menu,
  X,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  return (
    <nav className="nav-metal">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <Leaf size={24} />
          NaattuMarket
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links hidden md:flex">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Home size={16} />
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              <Package size={16} />
              Products
            </Link>
          </li>
          <li>
            <Link 
              to="/suppliers" 
              className={`nav-link ${isActive('/suppliers') ? 'active' : ''}`}
            >
              <Users size={16} />
              Suppliers
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
            >
              <ShoppingCart size={16} />
              Cart
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                >
                  <User size={16} />
                  {user?.name || 'Profile'}
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="nav-link flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                <LogIn size={16} />
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="btn-metal md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="container border-t border-border-primary">
          <div className="py-4 space-y-2">
            <Link 
              to="/" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/') ? 'bg-glass-metal-medium text-text-accent' : 'text-text-secondary hover:bg-glass-metal-light'}`}
              onClick={closeMobileMenu}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link 
              to="/products" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/products') ? 'bg-glass-metal-medium text-text-accent' : 'text-text-secondary hover:bg-glass-metal-light'}`}
              onClick={closeMobileMenu}
            >
              <Package size={20} />
              <span>Products</span>
            </Link>
            <Link 
              to="/suppliers" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/suppliers') ? 'bg-glass-metal-medium text-text-accent' : 'text-text-secondary hover:bg-glass-metal-light'}`}
              onClick={closeMobileMenu}
            >
              <Users size={20} />
              <span>Suppliers</span>
            </Link>
            <Link 
              to="/cart" 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/cart') ? 'bg-glass-metal-medium text-text-accent' : 'text-text-secondary hover:bg-glass-metal-light'}`}
              onClick={closeMobileMenu}
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/profile') ? 'bg-glass-metal-medium text-text-accent' : 'text-text-secondary hover:bg-glass-metal-light'}`}
                  onClick={closeMobileMenu}
                >
                  <User size={20} />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors text-text-secondary hover:bg-glass-metal-light w-full text-left"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/login') ? 'bg-glass-metal-medium text-text-accent' : 'text-text-secondary hover:bg-glass-metal-light'}`}
                onClick={closeMobileMenu}
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
