import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProfileImageUploaderProps {
  currentImageUrl?: string | null;
  onUploadSuccess?: (imageUrl: string) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ 
  currentImageUrl,
  onUploadSuccess 
}) => {
  // Mock function since auth is removed
  const updateProfileImage = async (file: File): Promise<string> => { 
    console.log('Update profile image mock', file); 
    return 'mock-url';
  };
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG and WebP images are supported');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsLoading(true);
    try {
      const success = await updateProfileImage(file);
      if (success) {
        toast.success('Profile image updated successfully');
        
        // If an external callback was provided, call it with the new image URL
        if (onUploadSuccess && typeof previewUrl === 'string') {
          onUploadSuccess(previewUrl);
        }
      } else {
        toast.error('Failed to update profile image');
        // Revert to previous image on failure
        setPreviewUrl(currentImageUrl || null);
      }
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Image upload error:', error);
      // Revert to previous image on error
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (onUploadSuccess) {
      onUploadSuccess('');
    }
    // In a real implementation, you would also need to call an API to remove the image
  };

  return (
    <div className="profile-image-uploader">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-24 h-24 rounded-full overflow-hidden group">
          <img 
            src={previewUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:bg-opacity-50 group-hover:opacity-100 transition-all duration-200">
            <button 
              onClick={triggerFileInput}
              className="bg-white bg-opacity-80 p-1 rounded-full m-1"
              disabled={isLoading}
              aria-label="Change profile image"
            >
              <Camera size={16} />
            </button>
            <button 
              onClick={removeImage}
              className="bg-white bg-opacity-80 p-1 rounded-full m-1"
              disabled={isLoading}
              aria-label="Remove profile image"
            >
              <X size={16} />
            </button>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader size={24} className="text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={triggerFileInput}
          disabled={isLoading}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-sage-silver-light to-sage-silver flex items-center justify-center"
        >
          {isLoading ? (
            <Loader size={24} className="animate-spin" />
          ) : (
            <Upload size={24} />
          )}
        </button>
      )}
    </div>
  );
};

export default ProfileImageUploader;
