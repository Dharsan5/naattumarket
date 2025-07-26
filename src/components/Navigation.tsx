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
    <nav className="nav">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <Leaf size={24} className="text-accent" />
          <span>NaattuMarket</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links hidden md:flex">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Home size={18} />
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/products" 
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              <Package size={18} />
              Products
            </Link>
          </li>
          <li>
            <Link 
              to="/suppliers" 
              className={`nav-link ${isActive('/suppliers') ? 'active' : ''}`}
            >
              <Users size={18} />
              Suppliers
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
            >
              <ShoppingCart size={18} />
              Cart
            </Link>
          </li>
        </ul>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <User size={18} />
                {user?.name || 'Profile'}
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary btn-sm hidden md:inline-flex"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="btn btn-ghost btn-sm md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4">
            <div className="flex flex-col gap-1">
              <Link 
                to="/" 
                className={`nav-link justify-start ${isActive('/') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Home size={18} />
                Home
              </Link>
              <Link 
                to="/products" 
                className={`nav-link justify-start ${isActive('/products') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Package size={18} />
                Products
              </Link>
              <Link 
                to="/suppliers" 
                className={`nav-link justify-start ${isActive('/suppliers') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Users size={18} />
                Suppliers
              </Link>
              <Link 
                to="/cart" 
                className={`nav-link justify-start ${isActive('/cart') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <ShoppingCart size={18} />
                Cart
              </Link>
              
              <div className="border-t my-3"></div>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`nav-link justify-start ${isActive('/profile') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <User size={18} />
                    {user?.name || 'Profile'}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="nav-link justify-start text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className={`nav-link justify-start ${isActive('/login') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
