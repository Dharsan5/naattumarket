import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, Package, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="xl" variant="default" showText={true} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-secondary">Sign in to your NattuMarket account</p>
        </div>

        {/* Login Form */}
        <div className="card card-elevated">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-tertiary" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-tertiary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-tertiary hover:text-secondary transition" />
                    ) : (
                      <Eye size={18} className="text-tertiary hover:text-secondary transition" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full justify-center"
              >
                {isLoading ? (
                  <div className="loading" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-secondary">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary/80 font-medium transition"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-primary" />
              </div>
              <h3 className="font-medium text-sm mb-1">Quality Products</h3>
              <p className="text-xs text-tertiary">Fresh, organic products from trusted suppliers</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users size={20} className="text-primary" />
              </div>
              <h3 className="font-medium text-sm mb-1">Local Network</h3>
              <p className="text-xs text-tertiary">Connect with suppliers in your area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
