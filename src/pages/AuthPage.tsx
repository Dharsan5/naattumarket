import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Leaf, 
  User, 
  Phone,
  ArrowRight, 
  Package, 
  Users,
  ShoppingBag,
  Check,
  Building,
  Store
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import '../styles/auth.css';

const AuthPage: React.FC = () => {
  // State for tab switching between login and signup
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const loginTabRef = useRef<HTMLDivElement>(null);
  const signupTabRef = useRef<HTMLDivElement>(null);

  // State for form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isVendor: false,
    businessName: '',
    agreeToTerms: false,
  });

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auth and navigation
  const { login, signup, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Update indicator position when tab changes
  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  // Set the tab indicator position
  const updateIndicator = () => {
    const activeRef = activeTab === 'login' ? loginTabRef : signupTabRef;
    if (activeRef.current) {
      setIndicatorStyle({
        width: `${activeRef.current.offsetWidth}px`,
        left: `${activeRef.current.offsetLeft}px`
      });
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast.success('Successfully logged in!');
      // Redirect will happen via the useEffect above
    } catch (err) {
      toast.error('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    if (!signupData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }
    
    try {
      // Pass all necessary signup data
      await signup({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
        isVendor: signupData.isVendor,
        businessName: signupData.businessName,
      });
      toast.success('Account created successfully! Please login.');
      setActiveTab('login');
    } catch (err) {
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setLoginData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Handle signup input changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSignupData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card metal-glass-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Leaf size={20} />
            </div>
            <h1 className="auth-title">NaattuMarket</h1>
          </div>
          <p className="auth-subtitle">Natural products from trusted suppliers</p>
        </div>
        
        <div className="auth-tabs">
          <div 
            ref={loginTabRef}
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => setActiveTab('login')}
          >
            Login
          </div>
          <div 
            ref={signupTabRef}
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`} 
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
          <div className="auth-tab-indicator" style={indicatorStyle}></div>
        </div>
        
        <div className="auth-form-container">
          {activeTab === 'login' ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="auth-input-group">
                <Mail className="auth-input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="auth-input"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <div className="auth-input-group">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="auth-input"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="auth-remember">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    name="remember"
                    className="auth-checkbox"
                    checked={loginData.remember}
                    onChange={handleLoginChange}
                  />
                  <span>Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="auth-forget-link">
                  Forgot password?
                </Link>
              </div>
              
              <button
                type="submit"
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
                {!isLoading && <ArrowRight size={18} className="ml-2" />}
              </button>
              
              <div className="auth-or-divider">
                <div className="auth-divider-line"></div>
                <div className="auth-divider-text">OR</div>
                <div className="auth-divider-line"></div>
              </div>
              
              <div className="auth-social-buttons">
                <button type="button" className="auth-social-button">
                  <img src="/icons/google.svg" alt="Google" className="auth-social-icon" />
                </button>
                <button type="button" className="auth-social-button">
                  <img src="/icons/facebook.svg" alt="Facebook" className="auth-social-icon" />
                </button>
                <button type="button" className="auth-social-button">
                  <img src="/icons/apple.svg" alt="Apple" className="auth-social-icon" />
                </button>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <div className="auth-input-group">
                <User className="auth-input-icon" size={18} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  className="auth-input"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              
              <div className="auth-input-group">
                <Mail className="auth-input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="auth-input"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              
              <div className="auth-input-group">
                <Phone className="auth-input-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="auth-input"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              
              <div className="auth-input-group">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="auth-input"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="auth-input-group">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className="auth-input"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="auth-checkbox-label mb-2">
                <input
                  type="checkbox"
                  name="isVendor"
                  className="auth-checkbox"
                  checked={signupData.isVendor}
                  onChange={handleSignupChange}
                />
                <span>I want to register as a vendor</span>
              </div>
              
              {signupData.isVendor && (
                <div className="auth-input-group">
                  <Building className="auth-input-icon" size={18} />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business name"
                    className="auth-input"
                    value={signupData.businessName}
                    onChange={handleSignupChange}
                    required={signupData.isVendor}
                  />
                </div>
              )}
              
              {signupData.isVendor && (
                <div className="auth-vendor-info">
                  <h3>Vendor Benefits:</h3>
                  <p>As a vendor, you'll be able to list and sell your natural products to our community of health-conscious consumers.</p>
                  <Link to="/vendor-info" className="auth-vendor-link">
                    Learn more about becoming a vendor <ArrowRight size={14} />
                  </Link>
                </div>
              )}
              
              <div className="auth-checkbox-label mt-4">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  className="auth-checkbox"
                  checked={signupData.agreeToTerms}
                  onChange={handleSignupChange}
                  required
                />
                <span>
                  I agree to the <Link to="/terms" className="auth-link">Terms</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                </span>
              </div>
              
              <button
                type="submit"
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight size={18} className="ml-2" />}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className="auth-features">
        <div className="auth-feature metal-glass-card">
          <div className="auth-feature-icon">
            <Leaf size={24} />
          </div>
          <h3 className="auth-feature-title">Natural Products</h3>
          <p className="auth-feature-desc">
            Access to a wide range of organic and natural products directly from trusted suppliers.
          </p>
        </div>
        
        <div className="auth-feature metal-glass-card">
          <div className="auth-feature-icon">
            <Store size={24} />
          </div>
          <h3 className="auth-feature-title">Local Vendors</h3>
          <p className="auth-feature-desc">
            Support local businesses while getting the freshest products with transparent sourcing.
          </p>
        </div>
        
        <div className="auth-feature metal-glass-card">
          <div className="auth-feature-icon">
            <Package size={24} />
          </div>
          <h3 className="auth-feature-title">Fast Delivery</h3>
          <p className="auth-feature-desc">
            Quick and reliable delivery services to ensure your products arrive fresh and on time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
