import axios from 'axios';
import { API_URL } from '../config';

class ProductService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Set JWT token for authenticated requests
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Get all products (public)
  async getAllProducts() {
    try {
      const response = await this.api.get('/products');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching products');
      return [];
    }
  }

  // Get featured products (public)
  async getFeaturedProducts() {
    try {
      const response = await this.api.get('/products/featured');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching featured products');
      return [];
    }
  }

  // Get product by id (public)
  async getProduct(id) {
    try {
      const response = await this.api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching product details');
      return null;
    }
  }

  // Get products by category (public)
  async getProductsByCategory(category) {
    try {
      const response = await this.api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching products by category');
      return [];
    }
  }

  // Search products (public)
  async searchProducts(query) {
    try {
      const response = await this.api.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error searching products');
      return [];
    }
  }

  // Get product categories (public)
  async getCategories() {
    try {
      const response = await this.api.get('/vendor/categories');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching product categories');
      return [];
    }
  }

  // Vendor specific methods - requires authentication

  // Get vendor's products
  async getVendorProducts() {
    try {
      const response = await this.api.get('/vendor/products');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching vendor products');
      return [];
    }
  }

  // Create a new product (vendor only)
  async createProduct(productData) {
    try {
      const response = await this.api.post('/vendor/products', productData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error creating product');
      throw error;
    }
  }

  // Update a product (vendor only)
  async updateProduct(id, productData) {
    try {
      const response = await this.api.put(`/vendor/products/${id}`, productData);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error updating product');
      throw error;
    }
  }

  // Delete a product (vendor only)
  async deleteProduct(id) {
    try {
      await this.api.delete(`/vendor/products/${id}`);
      return true;
    } catch (error) {
      this.handleError(error, 'Error deleting product');
      throw error;
    }
  }

  // Get vendor dashboard stats
  async getVendorStats() {
    try {
      const response = await this.api.get('/vendor/stats');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching vendor stats');
      return {
        stats: {
          total_products: 0,
          total_orders: 0,
          total_revenue: 0,
          avg_rating: 0
        },
        recentOrders: [],
        topProducts: []
      };
    }
  }

  // Get vendor's orders
  async getVendorOrders() {
    try {
      const response = await this.api.get('/vendor/orders');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching vendor orders');
      return [];
    }
  }

  // Get vendor order details
  async getVendorOrderDetails(id) {
    try {
      const response = await this.api.get(`/vendor/orders/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching order details');
      return null;
    }
  }

  // Error handling
  handleError(error, defaultMessage = 'An error occurred') {
    console.error(defaultMessage, error);
    if (error.response) {
      // Server responded with non-2xx status
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else caused the error
      console.error('Error:', error.message);
    }
  }
}

export default new ProductService();
