import React, { useState, useEffect } from 'react';
import { 
  Store,
  Package,
  ShoppingBag,
  Star,
  Edit 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { VendorService, BusinessProfile } from '../services/vendorService';

const VendorTab: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditingVendorInfo, setIsEditingVendorInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vendorData, setVendorData] = useState<BusinessProfile>({
    businessName: '',
    businessDescription: '',
    businessCategory: '',
    businessPhone: '',
    businessAddress: '',
    isVendor: false
  });
  
  // Fetch existing vendor profile data if available
  useEffect(() => {
    const fetchVendorProfile = async () => {
      if (user && user.role === 'supplier') {
        setIsLoading(true);
        try {
          const response = await VendorService.getVendorProfile();
          if (response.success && response.data) {
            setVendorData({
              ...response.data,
              isVendor: true
            });
          }
        } catch (error) {
          console.error('Error fetching vendor profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchVendorProfile();
  }, [user]);

  const handleVendorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setVendorData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let response;
      
      if (user?.role === 'supplier') {
        // Update existing vendor profile
        response = await VendorService.updateVendorProfile(vendorData);
      } else {
        // Register as a new vendor
        response = await VendorService.registerAsVendor(vendorData);
        
        // Update user role in auth context if successful
        if (response.success) {
          await updateProfile({ role: 'supplier' });
        }
      }
      
      if (response.success) {
        toast.success('Vendor profile updated successfully!');
        setIsEditingVendorInfo(false);
      } else {
        toast.error(response.error || 'Failed to update vendor profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating vendor profile');
      console.error('Vendor profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="metal-glass-card">
        <div className="flex justify-between items-center mb-lg">
          <h3 className="heading-metal heading-metal-lg">Vendor Setup</h3>
          {!isEditingVendorInfo && (
            <button 
              className="btn-metal" 
              onClick={() => setIsEditingVendorInfo(true)}
            >
              <Edit size={16} />
              {vendorData.isVendor ? 'Edit Vendor Info' : 'Become a Vendor'}
            </button>
          )}
        </div>

        {!isEditingVendorInfo && !vendorData.isVendor ? (
          <div className="text-center py-lg">
            <Store size={48} className="mx-auto mb-md text-metal-accent" />
            <h4 className="heading-metal heading-metal-md mb-sm">Become a Vendor</h4>
            <p className="text-metal mb-lg">
              Join our community of trusted suppliers and sell your natural products to health-conscious consumers.
            </p>
            <button 
              className="btn-metal mx-auto"
              onClick={() => setIsEditingVendorInfo(true)}
            >
              Setup Vendor Profile
            </button>
          </div>
        ) : isEditingVendorInfo ? (
          <form onSubmit={handleVendorSubmit}>
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    name="isVendor"
                    checked={vendorData.isVendor}
                    onChange={handleVendorInfoChange}
                    className="mr-sm"
                  />
                  Register as a vendor
                </label>
              </div>

              {vendorData.isVendor && (
                <>
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="Your business name"
                      value={vendorData.businessName}
                      onChange={handleVendorInfoChange}
                      className="form-input"
                      required={vendorData.isVendor}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Business Category</label>
                    <select
                      name="businessCategory"
                      value={vendorData.businessCategory}
                      onChange={handleVendorInfoChange}
                      className="form-input"
                      required={vendorData.isVendor}
                    >
                      <option value="">Select a category</option>
                      <option value="organic_produce">Organic Produce</option>
                      <option value="dairy_products">Dairy Products</option>
                      <option value="spices_herbs">Spices & Herbs</option>
                      <option value="grains_pulses">Grains & Pulses</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Business Description</label>
                    <textarea
                      name="businessDescription"
                      placeholder="Tell us about your business and products"
                      value={vendorData.businessDescription}
                      onChange={handleVendorInfoChange}
                      className="form-input"
                      rows={4}
                      required={vendorData.isVendor}
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Business Phone</label>
                    <input
                      type="tel"
                      name="businessPhone"
                      placeholder="Business contact number"
                      value={vendorData.businessPhone}
                      onChange={handleVendorInfoChange}
                      className="form-input"
                      required={vendorData.isVendor}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Business Address</label>
                    <textarea
                      name="businessAddress"
                      placeholder="Complete business address"
                      value={vendorData.businessAddress}
                      onChange={handleVendorInfoChange}
                      className="form-input"
                      rows={3}
                      required={vendorData.isVendor}
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-md mt-lg">
                <button 
                  type="button" 
                  className="btn-metal btn-outline"
                  onClick={() => setIsEditingVendorInfo(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-metal">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="heading-metal heading-metal-sm mb-xs">Business Name</h4>
              <p className="text-metal">{vendorData.businessName}</p>
            </div>
            
            <div>
              <h4 className="heading-metal heading-metal-sm mb-xs">Business Category</h4>
              <p className="text-metal">{vendorData.businessCategory}</p>
            </div>
            
            <div>
              <h4 className="heading-metal heading-metal-sm mb-xs">Business Description</h4>
              <p className="text-metal">{vendorData.businessDescription}</p>
            </div>
            
            <div>
              <h4 className="heading-metal heading-metal-sm mb-xs">Business Contact</h4>
              <p className="text-metal">{vendorData.businessPhone}</p>
            </div>
            
            <div>
              <h4 className="heading-metal heading-metal-sm mb-xs">Business Address</h4>
              <p className="text-metal">{vendorData.businessAddress}</p>
            </div>
          </div>
        )}
      </div>
      
      {vendorData.isVendor && !isEditingVendorInfo && (
        <div className="metal-glass-card">
          <h3 className="heading-metal heading-metal-md mb-md">Your Vendor Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
            <div className="text-center">
              <Package size={24} className="text-metal-accent mx-auto mb-sm" />
              <div className="heading-metal heading-metal-md">0</div>
              <div className="text-metal text-sm">Products Listed</div>
            </div>
            <div className="text-center">
              <ShoppingBag size={24} className="text-metal-accent mx-auto mb-sm" />
              <div className="heading-metal heading-metal-md">0</div>
              <div className="text-metal text-sm">Orders Received</div>
            </div>
            <div className="text-center">
              <Star size={24} className="text-metal-accent mx-auto mb-sm" />
              <div className="heading-metal heading-metal-md">0.0</div>
              <div className="text-metal text-sm">Avg Rating</div>
            </div>
          </div>
          <div className="flex gap-md">
            <button className="btn-metal flex-1">
              <Package size={16} />
              Add Products
            </button>
            <button className="btn-metal flex-1">
              <ShoppingBag size={16} />
              View Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorTab;
