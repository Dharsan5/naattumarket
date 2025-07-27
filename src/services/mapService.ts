import { apiClient } from './api';

export interface Vendor {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  business_type: string;
  phone: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  verified: boolean;
  rating: number;
  phone: string;
  created_at: string;
}

export interface MapData {
  vendors: Vendor[];
  suppliers: Supplier[];
}

class MapService {
  async getVendors(): Promise<Vendor[]> {
    try {
      const response = await apiClient.get<Vendor[]>('/vendors');
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching vendors for map:', error);
      return [];
    }
  }

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>('/suppliers');
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching suppliers for map:', error);
      return [];
    }
  }

  async getMapData(): Promise<MapData> {
    try {
      const [vendors, suppliers] = await Promise.all([
        this.getVendors(),
        this.getSuppliers()
      ]);

      return {
        vendors,
        suppliers
      };
    } catch (error) {
      console.error('Error fetching map data:', error);
      return {
        vendors: [],
        suppliers: []
      };
    }
  }

  // Get vendors by location (within a certain radius)
  async getVendorsNearby(lat: number, lng: number, radiusKm: number = 50): Promise<Vendor[]> {
    try {
      const response = await apiClient.get<Vendor[]>(`/vendors/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching nearby vendors:', error);
      return [];
    }
  }

  // Get suppliers by location (within a certain radius)
  async getSuppliersNearby(lat: number, lng: number, radiusKm: number = 50): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>(`/suppliers/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching nearby suppliers:', error);
      return [];
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Filter vendors/suppliers by state
  filterByState<T extends Vendor | Supplier>(items: T[], state: string): T[] {
    // This is a simplified filter - in a real app, you'd have state data
    // For now, we'll filter by approximate coordinates
    const stateBounds: { [key: string]: { minLat: number; maxLat: number; minLng: number; maxLng: number } } = {
      'Tamil Nadu': { minLat: 8.0, maxLat: 13.5, minLng: 76.0, maxLng: 80.5 },
      'Karnataka': { minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.5 },
      'Kerala': { minLat: 8.0, maxLat: 12.5, minLng: 74.5, maxLng: 77.5 },
      'Telangana': { minLat: 15.5, maxLat: 19.5, minLng: 77.0, maxLng: 81.0 }
    };

    const bounds = stateBounds[state];
    if (!bounds) return items;

    return items.filter(item => 
      item.location.lat >= bounds.minLat && 
      item.location.lat <= bounds.maxLat &&
      item.location.lng >= bounds.minLng && 
      item.location.lng <= bounds.maxLng
    );
  }
}

export const mapService = new MapService(); 