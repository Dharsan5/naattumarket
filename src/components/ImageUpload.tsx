import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  currentImage,
  placeholder = "Enter image URL",
  className = ""
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Test if the image URL is accessible
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('Image not accessible');
      }

      onImageUpload(imageUrl);
      setImageUrl('');
    } catch (error) {
      setError('Unable to access image. Please check the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Current"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
          {onImageRemove && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Image URL Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !imageUrl.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            Add
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </form>

      {/* Help Text */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <div className="flex items-start gap-2">
          <ImageIcon size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Image Requirements:</p>
            <ul className="space-y-1 text-xs">
              <li>• Enter a valid image URL (e.g., https://example.com/image.jpg)</li>
              <li>• Supported formats: JPG, PNG, GIF, WebP</li>
              <li>• Image should be publicly accessible</li>
              <li>• Recommended size: 400x400 pixels or larger</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Image Suggestions */}
      {/* The quick suggestions block has been removed as per the edit hint. */}
    </div>
  );
};

export default ImageUpload; 