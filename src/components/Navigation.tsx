import React, { useState, useRef, useEffect } from 'react';
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
  LogOut,
  ChevronDown,
  Layers,
  Heart,
  Settings,
  ShoppingBag,
  Truck,
  BarChart,
  HelpCircle,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DropdownItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Navigation with dropdown menus
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={18} />,
      hasDropdown: false
    },
    {
      name: "Products",
      path: "/products",
      icon: <Package size={18} />,
      hasDropdown: true,
      dropdownItems: [
        { name: "All Products", path: "/products", icon: <Layers size={16} /> },
        { name: "Categories", path: "/products/categories", icon: <ShoppingBag size={16} /> },
        { name: "Featured", path: "/products/featured", icon: <Heart size={16} /> }
      ]
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      icon: <Users size={18} />,
      hasDropdown: true,
      dropdownItems: [
        { name: "All Suppliers", path: "/suppliers", icon: <Users size={16} /> },
        { name: "Top Rated", path: "/suppliers/top-rated", icon: <Star size={16} /> },
        { name: "Delivery Partners", path: "/suppliers/delivery", icon: <Truck size={16} /> }
      ]
    },
    {
      name: "Cart",
      path: "/cart",
      icon: <ShoppingCart size={18} />,
      hasDropdown: false
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close any open dropdowns when toggling mobile menu
    setOpenDropdown(null);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };
  
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !Object.values(dropdownRefs.current).some(ref => 
        ref && ref.contains(event.target as Node)
      )) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

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
          {navItems.map((item) => (
            <li 
              key={item.name}
              ref={el => dropdownRefs.current[item.name] = el}
              className={item.hasDropdown ? 'dropdown-wrapper' : ''}
            >
              {item.hasDropdown ? (
                <>
                  <button 
                    className={`nav-link ${openDropdown === item.name ? 'active' : ''}`}
                    onClick={() => toggleDropdown(item.name)}
                    aria-expanded={openDropdown === item.name}
                  >
                    {item.icon}
                    {item.name}
                    <ChevronDown size={16} className={`dropdown-arrow ${openDropdown === item.name ? 'open' : ''}`} />
                  </button>
                  
                  {openDropdown === item.name && (
                    <div className="dropdown">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link 
                          key={dropdownItem.path}
                          to={dropdownItem.path}
                          className={`dropdown-item ${isActive(dropdownItem.path) ? 'active' : ''}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {dropdownItem.icon}
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div 
              className="hidden md:block"
              ref={el => dropdownRefs.current['profile'] = el}
            >
              <button 
                onClick={() => toggleDropdown('profile')}
                className={`nav-link ${openDropdown === 'profile' ? 'active' : ''}`}
                aria-expanded={openDropdown === 'profile'}
              >
                <User size={18} />
                {user?.name || 'Profile'}
                <ChevronDown size={16} className={`dropdown-arrow ${openDropdown === 'profile' ? 'open' : ''}`} />
              </button>
              
              {openDropdown === 'profile' && (
                <div className="dropdown profile-dropdown">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <User size={16} />
                    My Account
                  </Link>
                  <Link 
                    to="/orders" 
                    className="dropdown-item"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <ShoppingBag size={16} />
                    My Orders
                  </Link>
                  <Link 
                    to="/settings" 
                    className="dropdown-item"
                    onClick={() => setOpenDropdown(null)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item text-error"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
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
              {navItems.map((item) => (
                <React.Fragment key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <button 
                        className={`nav-link justify-start ${openDropdown === item.name ? 'active' : ''}`}
                        onClick={() => toggleDropdown(item.name)}
                        aria-expanded={openDropdown === item.name}
                      >
                        {item.icon}
                        {item.name}
                        <ChevronDown size={16} className={`dropdown-arrow ml-auto ${openDropdown === item.name ? 'open' : ''}`} />
                      </button>
                      
                      {openDropdown === item.name && (
                        <div className="mobile-dropdown">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link 
                              key={dropdownItem.path}
                              to={dropdownItem.path}
                              className={`nav-link mobile-dropdown-item ${isActive(dropdownItem.path) ? 'active' : ''}`}
                              onClick={closeMobileMenu}
                            >
                              {dropdownItem.icon}
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={`nav-link justify-start ${isActive(item.path) ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
              
              <div className="border-t my-3"></div>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`nav-link justify-start ${isActive('/profile') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <User size={18} />
                    My Account
                  </Link>
                  <Link 
                    to="/orders" 
                    className={`nav-link justify-start ${isActive('/orders') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <ShoppingBag size={18} />
                    My Orders
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`nav-link justify-start ${isActive('/settings') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="nav-link justify-start text-left text-error"
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
