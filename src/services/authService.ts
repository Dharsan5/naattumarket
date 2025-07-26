import { apiClient, ApiResponse } from './api';

// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: 'customer' | 'supplier' | 'admin';
  avatar_url?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'customer' | 'supplier';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Authentication API service
export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    console.log('Attempting login with credentials:', { email: credentials.email });
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      console.log('Login response:', response);
      
      if (response.success && response.data?.token) {
        console.log('Login successful, setting token');
        apiClient.setToken(response.data.token);
      } else {
        console.error('Login failed:', response.error);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed due to network error' 
      };
    }
  }

  // Register user
  static async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    console.log('Attempting registration with data:', { 
      email: userData.email, 
      name: userData.name,
      role: userData.role
    });
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      console.log('Registration response:', response);
      
      if (response.success && response.data?.token) {
        console.log('Registration successful, setting token');
        apiClient.setToken(response.data.token);
      } else {
        console.error('Registration failed:', response.error);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed due to network error' 
      };
    }
  }

  // Logout user
  static async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');
    apiClient.setToken(null);
    return response;
  }

  // Get current user profile
  static async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/profile');
  }

  // Update user profile
  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/auth/profile', userData);
  }

  // Change password
  static async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/auth/change-password', {
      oldPassword,
      newPassword
    });
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/forgot-password', { email });
  }

  // Reset password with token
  static async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/reset-password', { token, password });
  }

  // Verify email
  static async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/verify-email', { token });
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh', { refreshToken });
    
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response;
  }
}

export { AuthService as authService };
