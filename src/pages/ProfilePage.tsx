import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Package,
  Heart,
  Settings,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  Edit,
  Star,
  Clock,
  Store,
  ShoppingBag,
  ListFilter,
  BarChart,
  FileText,
  Gift,
  Home,
  HelpCircle,
  Save
} from 'lucide-react';
import VendorTab from '../components/VendorTab';
import VendorDashboard from '../components/VendorDashboard';
import ProfileImageUploader from '../components/ProfileImageUploader';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  });
  
  // For address display/formatting
  const getFormattedAddress = () => {
    if (!user?.address) return 'No address provided';
    
    const { street, city, state, postal_code, country } = user.address;
    return `${street}, ${city}, ${state} ${postal_code}, ${country}`;
  };
  
  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postal_code: user.address?.postal_code || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  const orders = [
    {
      id: "ORD001",
      date: "2024-01-20",
      status: "Delivered",
      total: 450,
      items: 3,
      supplier: "Green Valley Farms"
    },
    {
      id: "ORD002",
      date: "2024-01-18",
      status: "In Transit",
      total: 299,
      items: 2,
      supplier: "Nature's Best"
    },
    {
      id: "ORD003",
      date: "2024-01-15",
      status: "Delivered",
      total: 680,
      items: 1,
      supplier: "Golden Harvest"
    }
  ];

  const favorites = [
    {
      id: 1,
      name: "Organic Turmeric Powder",
      price: "₹299",
      image: "🌿",
      supplier: "Green Valley Farms"
    },
    {
      id: 2,
      name: "Fresh Curry Leaves",
      price: "₹89",
      image: "🍃",
      supplier: "Nature's Best"
    },
    {
      id: 3,
      name: "Premium Basmati Rice",
      price: "₹680",
      image: "🌾",
      supplier: "Golden Harvest"
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'vendor', label: 'Vendor Setup', icon: Store },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-400';
      case 'In Transit': return 'text-blue-400';
      case 'Processing': return 'text-yellow-400';
      default: return 'text-metal';
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="metal-glass-card">
        <div className="flex items-center gap-lg mb-lg">
          <ProfileImageUploader 
            currentImageUrl={user?.avatar_url} 
            onUploadSuccess={(url) => {
              toast.success('Profile image updated!');
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-sm mb-sm">
              <h2 className="heading-metal heading-metal-lg">{user?.name}</h2>
              {user?.role === 'supplier' && (
                <div title="Verified Vendor">
                  <Shield size={16} className="text-green-400" />
                </div>
              )}
            </div>
            <p className="text-metal mb-sm">Member since {new Date(user?.created_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
            <div className="flex items-center gap-sm">
              <Star size={14} className="text-metal-accent fill-current" />
              <span className="text-metal">{user?.role === 'supplier' ? 'Vendor' : 'Customer'}</span>
            </div>
          </div>
          <button 
            className="btn-metal"
            onClick={() => setIsEditingProfile(true)}
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="metal-glass-card">
        <h3 className="heading-metal heading-metal-md mb-lg">Contact Information</h3>
        {isEditingProfile ? (
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            // Submit form logic will go here
            setIsEditingProfile(false);
            toast.success('Profile updated successfully');
          }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.address.street}
                onChange={(e) => setProfileForm({
                  ...profileForm, 
                  address: {...profileForm.address, street: e.target.value}
                })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.address.city}
                  onChange={(e) => setProfileForm({
                    ...profileForm, 
                    address: {...profileForm.address, city: e.target.value}
                  })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">State/Province</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.address.state}
                  onChange={(e) => setProfileForm({
                    ...profileForm, 
                    address: {...profileForm.address, state: e.target.value}
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.address.postal_code}
                  onChange={(e) => setProfileForm({
                    ...profileForm, 
                    address: {...profileForm.address, postal_code: e.target.value}
                  })}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.address.country}
                  onChange={(e) => setProfileForm({
                    ...profileForm, 
                    address: {...profileForm.address, country: e.target.value}
                  })}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button 
                type="button" 
                className="btn-metal btn-outline"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-metal">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-sm">
              <Mail size={16} className="text-metal-accent" />
              <span className="text-metal">{user?.email}</span>
            </div>
            <div className="flex items-center gap-sm">
              <Phone size={16} className="text-metal-accent" />
              <span className="text-metal">{user?.phone || 'No phone number added'}</span>
            </div>
            <div className="flex items-start gap-sm">
              <MapPin size={16} className="text-metal-accent mt-1" />
              <span className="text-metal">{getFormattedAddress()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        <div className="metal-glass-card text-center">
          <Package size={24} className="text-metal-accent mx-auto mb-sm" />
          <div className="heading-metal heading-metal-md">12</div>
          <div className="text-metal text-sm">Total Orders</div>
        </div>
        <div className="metal-glass-card text-center">
          <Heart size={24} className="text-metal-accent mx-auto mb-sm" />
          <div className="heading-metal heading-metal-md">8</div>
          <div className="text-metal text-sm">Favorites</div>
        </div>
        <div className="metal-glass-card text-center">
          <Star size={24} className="text-metal-accent mx-auto mb-sm" />
          <div className="heading-metal heading-metal-md">4.9</div>
          <div className="text-metal text-sm">Avg Rating</div>
        </div>
        <div className="metal-glass-card text-center">
          <Calendar size={24} className="text-metal-accent mx-auto mb-sm" />
          <div className="heading-metal heading-metal-md">10</div>
          <div className="text-metal text-sm">Months Active</div>
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-metal heading-metal-lg">Order History</h3>
        <button className="btn-metal">
          <Package size={16} />
          View All Orders
        </button>
      </div>
      
      {orders.map((order) => (
        <div key={order.id} className="metal-glass-card">
          <div className="flex justify-between items-start mb-md">
            <div>
              <h4 className="heading-metal heading-metal-sm mb-xs">Order #{order.id}</h4>
              <p className="text-metal text-sm mb-sm">from {order.supplier}</p>
              <div className="flex items-center gap-sm">
                <Calendar size={14} className="text-metal-accent" />
                <span className="text-metal text-sm">{order.date}</span>
              </div>
            </div>
            <span className={`badge-metal ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-metal">
              {order.items} items • ₹{order.total}
            </div>
            <div className="flex gap-sm">
              <button className="btn-metal">View Details</button>
              {order.status === 'Delivered' && (
                <button className="btn-metal btn-metal-primary">Reorder</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const FavoritesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="heading-metal heading-metal-lg">Your Favorites</h3>
        <button className="btn-metal">
          <Heart size={16} />
          Manage Favorites
        </button>
      </div>
      
      <div className="grid-metal">
        {favorites.map((item) => (
          <div key={item.id} className="metal-glass-card hover-lift">
            <div className="text-4xl text-center bg-gradient-to-br from-sage-silver-light to-sage-silver rounded-lg py-6 mb-md">
              {item.image}
            </div>
            <h4 className="heading-metal heading-metal-sm mb-sm">{item.name}</h4>
            <p className="text-metal text-sm mb-md">by {item.supplier}</p>
            <div className="flex justify-between items-center">
              <span className="heading-metal text-metal-accent">{item.price}</span>
              <div className="flex gap-sm">
                <button className="btn-metal">
                  <Heart size={16} className="fill-current text-red-400" />
                </button>
                <button className="btn-metal btn-metal-primary">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h3 className="heading-metal heading-metal-lg">Settings</h3>
      
      <div className="metal-glass-card">
        <h4 className="heading-metal heading-metal-md mb-lg">Notifications</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-sm">
              <Bell size={16} className="text-metal-accent" />
              <span className="text-metal">Order Updates</span>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-sm">
              <Package size={16} className="text-metal-accent" />
              <span className="text-metal">New Products</span>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-sm">
              <Star size={16} className="text-metal-accent" />
              <span className="text-metal">Promotions</span>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>

      <div className="metal-glass-card">
        <h4 className="heading-metal heading-metal-md mb-lg">Account</h4>
        <div className="space-y-4">
          <button className="btn-metal w-full justify-start">
            <CreditCard size={16} />
            Payment Methods
          </button>
          <button className="btn-metal w-full justify-start">
            <MapPin size={16} />
            Delivery Addresses
          </button>
          <button className="btn-metal w-full justify-start">
            <Shield size={16} />
            Privacy Settings
          </button>
          <button className="btn-metal w-full justify-start text-red-400 hover:bg-red-500/10">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    // If user is a vendor and on vendor tab, show vendor dashboard
    if (activeTab === 'vendor' && user?.role === 'supplier') {
      return <VendorDashboard />;
    }
    
    // Otherwise show regular tabs
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'vendor': return <VendorTab />; // Setup vendor tab for non-vendors
      case 'orders': return <OrdersTab />;
      case 'favorites': return <FavoritesTab />;
      case 'settings': return <SettingsTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="heading-metal heading-metal-xl mb-xl">My Account</h1>
      
      <div className="grid lg:grid-cols-4 gap-xl">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="metal-glass-card sticky top-8">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn-metal w-full justify-start ${
                    activeTab === tab.id ? 'btn-metal-primary' : ''
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
