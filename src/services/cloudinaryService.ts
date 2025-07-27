import { apiClient, ApiResponse } from './api';

// Define interface for upload response
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

// Cloudinary service for image uploads
export class CloudinaryService {
  // Upload profile image
  static async uploadProfileImage(file: File): Promise<ApiResponse<CloudinaryUploadResponse>> {
    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    
    // Set upload preset for Cloudinary (should be configured on the server)
    formData.append('upload_preset', 'naattu_market_profiles');
    
    try {
      // Send to backend endpoint that will handle the Cloudinary upload
      const response = await apiClient.post<CloudinaryUploadResponse>(
        '/uploads/profile-image', 
        formData,
        { 'Content-Type': 'multipart/form-data' }
      );
      
      return response;
    } catch (error) {
      console.error('Image upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload image' 
      };
    }
  }

  // Upload product image
  static async uploadProductImage(file: File): Promise<ApiResponse<CloudinaryUploadResponse>> {
    // Create FormData
    const formData = new FormData();
    formData.append('image', file);
    
    // Set upload preset for Cloudinary (should be configured on the server)
    formData.append('upload_preset', 'naattu_market_products');
    
    try {
      // Send to backend endpoint that will handle the Cloudinary upload
      const response = await apiClient.post<CloudinaryUploadResponse>(
        '/uploads/product-image', 
        formData,
        { 'Content-Type': 'multipart/form-data' }
      );
      
      return response;
    } catch (error) {
      console.error('Product image upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload product image' 
      };
    }
  }

  // Delete an image
  static async deleteImage(publicId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/uploads/image/${publicId}`);
    } catch (error) {
      console.error('Image deletion error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete image' 
      };
    }
  }
}
