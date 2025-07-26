import { apiClient, ApiResponse } from './api';

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category: string;
  in_stock: boolean;
  rating?: number;
  reviews_count?: number;
  supplier_id: string;
  supplier_name?: string;
  badges?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// Product API service
export class ProductService {
  // Get all products with filters
  static async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<ProductsResponse>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<ProductsResponse>(endpoint);
  }

  // Get product by ID
  static async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/products/category/${category}`);
  }

  // Search products
  static async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products/featured');
  }

  // Get categories
  static async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/products/categories');
  }
}

export { ProductService as productService };
