import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  User,
  Leaf
} from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

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
          <li>
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              <User size={16} />
              Profile
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="btn-metal md:hidden">
          <Package size={16} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="container">
          <div className="flex justify-around py-2">
            <Link 
              to="/" 
              className={`flex flex-col items-center gap-1 p-2 ${isActive('/') ? 'text-metal-accent' : 'text-metal'}`}
            >
              <Home size={20} />
              <span className="text-xs">Home</span>
            </Link>
            <Link 
              to="/products" 
              className={`flex flex-col items-center gap-1 p-2 ${isActive('/products') ? 'text-metal-accent' : 'text-metal'}`}
            >
              <Package size={20} />
              <span className="text-xs">Products</span>
            </Link>
            <Link 
              to="/suppliers" 
              className={`flex flex-col items-center gap-1 p-2 ${isActive('/suppliers') ? 'text-metal-accent' : 'text-metal'}`}
            >
              <Users size={20} />
              <span className="text-xs">Suppliers</span>
            </Link>
            <Link 
              to="/cart" 
              className={`flex flex-col items-center gap-1 p-2 ${isActive('/cart') ? 'text-metal-accent' : 'text-metal'}`}
            >
              <ShoppingCart size={20} />
              <span className="text-xs">Cart</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex flex-col items-center gap-1 p-2 ${isActive('/profile') ? 'text-metal-accent' : 'text-metal'}`}
            >
              <User size={20} />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
