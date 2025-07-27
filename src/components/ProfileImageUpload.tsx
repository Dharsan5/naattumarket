import React, { useState } from 'react';
import { Upload, User, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ProfileImageUploadProps {
  className?: string;
  size?: number;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ className = '', size = 100 }) => {
  const { user, updateProfileImage } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    try {
      const success = await updateProfileImage(file);
      if (success) {
        toast.success('Profile image updated successfully');
      } else {
        toast.error('Failed to update profile image');
      }
    } catch (error) {
      toast.error('Error updating profile image');
      console.error('Profile image error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-gradient-to-br from-sage-silver-light to-sage-silver ${className}`}
      style={{ width: size, height: size }}
    >
      {user?.avatar_url ? (
        <img 
          src={user.avatar_url} 
          alt={user.name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-metal">
          <User size={size * 0.5} />
        </div>
      )}
      
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader size={size * 0.3} className="text-white animate-spin" />
        </div>
      )}
      
      <label 
        htmlFor="profile-image-upload" 
        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center cursor-pointer transition-all opacity-0 hover:opacity-100"
      >
        <Upload size={size * 0.3} className="text-white" />
        <input 
          type="file"
          id="profile-image-upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ProfileImageUpload;
