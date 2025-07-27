import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Star, 
  DollarSign, 
  RefreshCw,
  Loader,
  ArrowUp,
  Users,
  ChevronRight,
  Store
} from 'lucide-react';
import { productService } from '../services/productService';
import VendorProducts from './VendorProducts';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
}

const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    avgRating: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample orders data
  const recentOrders = [
    { id: 'ORD1234', customer: 'Rahul Sharma', amount: 450, status: 'Processing', date: '2025-07-25' },
    { id: 'ORD1235', customer: 'Priya Singh', amount: 899, status: 'Delivered', date: '2025-07-24' },
    { id: 'ORD1236', customer: 'Anand Kumar', amount: 1200, status: 'Shipped', date: '2025-07-23' },
  ];
  
  // Fetch vendor stats
  useEffect(() => {
    fetchVendorStats();
  }, []);
  
  const fetchVendorStats = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getVendorStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching vendor stats:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metal-glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-metal mb-1 text-sm">Total Products</p>
              <h3 className="heading-metal heading-metal-lg">{stats.totalProducts}</h3>
            </div>
            <div className="bg-accent-light p-2 rounded-full">
              <Package className="text-accent" size={20} />
            </div>
          </div>
          <div className="text-xs text-green-400 mt-4 flex items-center">
            <ArrowUp size={12} className="mr-1" />
            <span>3 new this month</span>
          </div>
        </div>
        
        <div className="metal-glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-metal mb-1 text-sm">Total Orders</p>
              <h3 className="heading-metal heading-metal-lg">{stats.totalOrders}</h3>
            </div>
            <div className="bg-accent-light p-2 rounded-full">
              <ShoppingBag className="text-accent" size={20} />
            </div>
          </div>
          <div className="text-xs text-green-400 mt-4 flex items-center">
            <ArrowUp size={12} className="mr-1" />
            <span>12% from last month</span>
          </div>
        </div>
        
        <div className="metal-glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-metal mb-1 text-sm">Revenue</p>
              <h3 className="heading-metal heading-metal-lg">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
            <div className="bg-accent-light p-2 rounded-full">
              <DollarSign className="text-accent" size={20} />
            </div>
          </div>
          <div className="text-xs text-green-400 mt-4 flex items-center">
            <ArrowUp size={12} className="mr-1" />
            <span>8% from last month</span>
          </div>
        </div>
        
        <div className="metal-glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-metal mb-1 text-sm">Avg. Rating</p>
              <h3 className="heading-metal heading-metal-lg">{stats.avgRating.toFixed(1)}/5.0</h3>
            </div>
            <div className="bg-accent-light p-2 rounded-full">
              <Star className="text-accent" size={20} />
            </div>
          </div>
          <div className="text-xs text-green-400 mt-4 flex items-center">
            <ArrowUp size={12} className="mr-1" />
            <span>+0.2 from last month</span>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="metal-glass-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="heading-metal heading-metal-md">Recent Orders</h3>
          <button 
            className="btn-metal btn-sm"
            onClick={() => setActiveTab('orders')}
          >
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-sm text-metal">Order ID</th>
                <th className="text-left py-2 text-sm text-metal">Customer</th>
                <th className="text-left py-2 text-sm text-metal">Amount</th>
                <th className="text-left py-2 text-sm text-metal">Status</th>
                <th className="text-left py-2 text-sm text-metal">Date</th>
                <th className="text-left py-2 text-sm text-metal"></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-700">
                  <td className="py-3 text-metal">#{order.id}</td>
                  <td className="py-3 text-metal">{order.customer}</td>
                  <td className="py-3 text-metal">{formatCurrency(order.amount)}</td>
                  <td className="py-3">
                    <span className={`badge-${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-metal">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-3 text-right">
                    <button className="text-accent hover:text-accent-dark">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Customer Insights */}
      <div className="metal-glass-card">
        <h3 className="heading-metal heading-metal-md mb-6">Customer Insights</h3>
        <div className="flex items-center gap-6">
          <div className="bg-accent-light p-4 rounded-full">
            <Users className="text-accent" size={24} />
          </div>
          <div>
            <h4 className="heading-metal heading-metal-sm mb-1">Customer Acquisition</h4>
            <p className="text-metal mb-2">You gained 18 new customers this month.</p>
            <div className="flex items-center gap-2">
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{width: '70%'}}></div>
              </div>
              <span className="text-xs text-metal">70%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Helper function to get status class
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-metal heading-metal-lg">
          <Store className="inline-block mr-2" size={24} />
          Vendor Dashboard
        </h2>
        <button 
          className="btn-metal btn-sm"
          onClick={fetchVendorStats}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      
      <div className="flex gap-2 border-b border-gray-700 mb-6">
        <button 
          className={`py-2 px-4 font-medium border-b-2 ${
            activeTab === 'overview' 
              ? 'border-accent text-white' 
              : 'border-transparent text-metal hover:text-white'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} className="inline-block mr-2" />
          Overview
        </button>
        <button 
          className={`py-2 px-4 font-medium border-b-2 ${
            activeTab === 'products' 
              ? 'border-accent text-white' 
              : 'border-transparent text-metal hover:text-white'
          }`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} className="inline-block mr-2" />
          Products
        </button>
        <button 
          className={`py-2 px-4 font-medium border-b-2 ${
            activeTab === 'orders' 
              ? 'border-accent text-white' 
              : 'border-transparent text-metal hover:text-white'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} className="inline-block mr-2" />
          Orders
        </button>
      </div>
      
      {isLoading && activeTab === 'overview' ? (
        <div className="flex justify-center py-12">
          <Loader size={32} className="animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'products' && <VendorProducts />}
          {activeTab === 'orders' && (
            <div className="metal-glass-card p-6 text-center">
              <ShoppingBag size={48} className="mx-auto mb-4 text-metal-accent" />
              <h3 className="heading-metal heading-metal-md mb-2">Order Management</h3>
              <p className="text-metal mb-6">This feature will be available soon.</p>
              <button 
                className="btn-metal"
                onClick={() => setActiveTab('overview')}
              >
                Return to Overview
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VendorDashboard;
