// API Configuration and base setup
// Use relative URL to work with Vite's proxy
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '/api';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Generic API client
export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Handle common errors with products while database is being set up
    if (endpoint.includes('/products')) {
      // Return mock success response for now
      console.log(`🔧 Development mode: Simulating API request to: ${endpoint}`);
      
      if (endpoint.includes('/categories')) {
        return {
          success: true,
          data: {
            categories: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Herbs & Spices']
          } as any,
          message: 'Mock categories returned'
        };
      }
      
      return {
        success: true,
        data: {
          products: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalProducts: 0,
            hasNext: false,
            hasPrev: false
          }
        } as any,
        message: 'Mock products returned'
      };
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log(`Making API request to: ${url}`, { method: options.method });
      
      const response = await fetch(url, {
        ...options,
        headers,
        // Include credentials for cookies, needed for session-based auth
        credentials: 'include',
      });
      
      // For debugging CORS issues
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        
        // Try to get error data as JSON
        let errorMessage;
        let errorDetail = '';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Server error (${response.status})`;
          errorDetail = errorData.error || '';
          console.error('Error details:', errorData);
        } catch (err) {
          errorMessage = `Server error (${response.status})`;
        }
        
        throw new Error(errorDetail ? `${errorMessage}: ${errorDetail}` : errorMessage);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Check if it's a network error, which could indicate CORS issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('Network error - possible CORS issue or server not running');
        return {
          success: false,
          error: 'Network error - server may be unavailable or CORS issue',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
