import { apiClient, ApiResponse } from './api';

export interface BusinessProfile {
  businessName: string;
  businessDescription: string;
  businessCategory: string;
  businessPhone: string;
  businessAddress: string;
  isVendor: boolean;
}

export class VendorService {
  // Update vendor profile
  static async updateVendorProfile(data: BusinessProfile): Promise<ApiResponse<any>> {
    return apiClient.put<any>('/vendors/profile', data);
  }

  // Get vendor profile
  static async getVendorProfile(): Promise<ApiResponse<BusinessProfile>> {
    return apiClient.get<BusinessProfile>('/vendors/profile');
  }

  // Register as a vendor
  static async registerAsVendor(data: BusinessProfile): Promise<ApiResponse<any>> {
    return apiClient.post<any>('/vendors/register', data);
  }
}
