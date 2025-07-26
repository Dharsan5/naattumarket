import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, Package, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component mounts
  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast.success('Welcome back!');
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        toast.error(error || 'Login failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-5xl">
      <div className="container">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-4xl">
            <div className="flex items-center justify-center gap-3 mb-2xl">
              <div className="p-3 bg-glass-metal-medium rounded-lg">
                <Leaf size={32} className="text-text-accent" />
              </div>
            </div>
            <h1 className="heading-metal-lg mb-lg">Welcome Back</h1>
            <p className="text-metal">Sign in to your NaattuMarket account</p>
          </div>

          {/* Login Form */}
          <div className="metal-glass-card">
            <form onSubmit={handleSubmit} className="space-y-xl">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-sm">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-text-muted" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-metal pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-sm">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-text-muted" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-metal pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-text-muted hover:text-text-secondary" />
                    ) : (
                      <Eye size={18} className="text-text-muted hover:text-text-secondary" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-text-accent hover:text-earth-gold transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-metal-primary w-full justify-center"
              >
                {isLoading ? (
                  <div className="loading-metal" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-xl pt-xl border-t border-border-primary text-center">
              <p className="text-text-secondary">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-text-accent hover:text-earth-gold font-medium transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="text-center p-lg">
                <div className="w-12 h-12 bg-glass-metal-medium rounded-lg flex items-center justify-center mx-auto mb-md">
                  <Package size={24} className="text-text-accent" />
                </div>
                <h3 className="font-medium text-text-primary mb-sm">Quality Products</h3>
                <p className="text-sm text-text-muted">Fresh, organic products from trusted suppliers</p>
              </div>
              <div className="text-center p-lg">
                <div className="w-12 h-12 bg-glass-metal-medium rounded-lg flex items-center justify-center mx-auto mb-md">
                  <Users size={24} className="text-text-accent" />
                </div>
                <h3 className="font-medium text-text-primary mb-sm">Local Network</h3>
                <p className="text-sm text-text-muted">Connect with suppliers in your area</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
