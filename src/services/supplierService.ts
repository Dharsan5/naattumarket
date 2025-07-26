import { apiClient, ApiResponse } from './api';

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  reviews_count?: number;
  verified: boolean;
  avatar_url?: string;
  cover_image_url?: string;
  business_hours?: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

export interface SupplierFilters {
  business_type?: string;
  city?: string;
  state?: string;
  verified?: boolean;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SuppliersResponse {
  suppliers: Supplier[];
  total: number;
  page: number;
  totalPages: number;
}

// Supplier API service
export class SupplierService {
  // Get all suppliers with filters
  static async getSuppliers(filters: SupplierFilters = {}): Promise<ApiResponse<SuppliersResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/suppliers${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<SuppliersResponse>(endpoint);
  }

  // Get supplier by ID
  static async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return apiClient.get<Supplier>(`/suppliers/${id}`);
  }

  // Get suppliers by business type
  static async getSuppliersByType(businessType: string): Promise<ApiResponse<Supplier[]>> {
    return apiClient.get<Supplier[]>(`/suppliers/type/${businessType}`);
  }

  // Search suppliers
  static async searchSuppliers(query: string): Promise<ApiResponse<Supplier[]>> {
    return apiClient.get<Supplier[]>(`/suppliers/search?q=${encodeURIComponent(query)}`);
  }

  // Get nearby suppliers (if location permission granted)
  static async getNearbySuppliers(lat: number, lng: number, radius: number = 10): Promise<ApiResponse<Supplier[]>> {
    return apiClient.get<Supplier[]>(`/suppliers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  // Get supplier products
  static async getSupplierProducts(supplierId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/suppliers/${supplierId}/products`);
  }

  // Get business types
  static async getBusinessTypes(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/suppliers/business-types');
  }
}

export { SupplierService as supplierService };
