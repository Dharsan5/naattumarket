import { apiClient } from './api';

export interface ImageUploadResponse {
  success: boolean;
  data?: {
    secure_url: string;
    public_id: string | null;
  };
  error?: string;
}

class ImageService {
  // Upload profile image URL
  async uploadProfileImage(imageUrl: string): Promise<ImageUploadResponse> {
    try {
      const response = await apiClient.post<{ secure_url: string; public_id: string | null }>(
        '/uploads/profile-image',
        { imageUrl }
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to upload profile image'
      };
    } catch (error) {
      console.error('Profile image upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Upload product image URL
  async uploadProductImage(imageUrl: string, productId?: string): Promise<ImageUploadResponse> {
    try {
      const response = await apiClient.post<{ secure_url: string; public_id: string | null }>(
        '/uploads/product-image',
        { imageUrl, productId }
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to upload product image'
      };
    } catch (error) {
      console.error('Product image upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Remove image
  async removeImage(imageId: string, type: 'profile' | 'product', entityId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.delete(`/uploads/image/${imageId}`);

      if (response.success) {
        return { success: true };
      }

      return {
        success: false,
        error: response.error || 'Failed to remove image'
      };
    } catch (error) {
      console.error('Image removal error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Validate image URL
  async validateImageUrl(imageUrl: string): Promise<{ valid: boolean; error?: string }> {
    try {
      // Check if URL is valid
      new URL(imageUrl);

      // Test if image is accessible
      const response = await fetch(imageUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        return {
          valid: false,
          error: 'Image not accessible'
        };
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        return {
          valid: false,
          error: 'URL does not point to a valid image'
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid URL format'
      };
    }
  }

  // Get image dimensions (optional)
  async getImageDimensions(imageUrl: string): Promise<{ width: number; height: number } | null> {
    try {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
          resolve(null);
        };
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return null;
    }
  }

  // Generate placeholder image URL
  generatePlaceholderImage(text: string, width: number = 400, height: number = 300): string {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/${width}x${height}?text=${encodedText}`;
  }

  // Get optimized image URL (for services that support it)
  getOptimizedImageUrl(originalUrl: string, width?: number, height?: number, quality?: number): string {
    // This is a placeholder - in a real app, you might use a CDN or image optimization service
    if (originalUrl.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      if (quality) params.append('q', quality.toString());
      params.append('fit', 'crop');
      
      return `${originalUrl}?${params.toString()}`;
    }
    
    return originalUrl;
  }
}

export const imageService = new ImageService();
