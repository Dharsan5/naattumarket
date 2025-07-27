import { apiClient, ApiResponse } from './api';

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount_price?: number;
  images: string[];
  image_url?: string;
  category: string;
  subcategory?: string;
  in_stock: boolean;
  stock_quantity: number;
  rating?: number;
  reviews_count?: number;
  supplier_id: string;
  supplier_name?: string;
  badges?: string[];
  is_organic: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Product form data for creation/updates
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  category: string;
  subcategory?: string;
  images: string[];
  is_organic: boolean;
  is_featured?: boolean;
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
  
  // Vendor Product Management
  
  // Get vendor's own products
  static async getVendorProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products/vendor');
  }

  // Create a new product as vendor
  static async createProduct(product: ProductFormData): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/products', product);
  }

  // Update a product as vendor
  static async updateProduct(id: string, product: ProductFormData): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/products/${id}`, product);
  }

  // Delete a product as vendor
  static async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${id}`);
  }
  
  // Get product subcategories for a category
  static async getSubcategories(category: string): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`/products/subcategories/${category}`);
  }
  
  // Get vendor dashboard stats
  static async getVendorStats(): Promise<ApiResponse<{
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    avgRating: number;
  }>> {
    return apiClient.get<any>('/products/vendor/stats');
  }
}

export { ProductService as productService };
