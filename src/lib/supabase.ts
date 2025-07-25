import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Auth helpers
export const auth = {
  // Phone OTP authentication
  async signInWithOTP(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true
      }
    });
    return { data, error };
  },

  async verifyOTP(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers with geolocation support
export const db = {
  // Suppliers
  async getNearbySuppliers(latitude: number, longitude: number, radiusKm: number = 10) {
    const { data, error } = await supabase
      .rpc('get_nearby_suppliers', {
        lat: latitude,
        lng: longitude,
        radius_km: radiusKm
      });
    return { data, error };
  },

  async getSupplierById(id: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select(`
        *,
        user:users(*),
        products(*),
        location:locations(*)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getSuppliers(filters: any = {}) {
    let query = supabase
      .from('suppliers')
      .select(`
        *,
        user:users(*),
        products(*),
        location:locations(*)
      `);

    if (filters.verified) {
      query = query.eq('verified', true);
    }

    if (filters.online) {
      query = query.eq('is_online', true);
    }

    if (filters.category) {
      query = query.contains('tags', [filters.category]);
    }

    const { data, error } = await query.order('rating', { ascending: false });
    return { data, error };
  },

  // Products
  async getProducts(supplierId?: string, filters: any = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        supplier:suppliers(*),
        category:product_categories(*)
      `);

    if (supplierId) {
      query = query.eq('supplier_id', supplierId);
    }

    if (filters.inStock) {
      query = query.eq('in_stock', true);
    }

    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters.priceRange) {
      query = query.gte('price', filters.priceRange.min).lte('price', filters.priceRange.max);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async searchProducts(searchTerm: string, _latitude?: number, _longitude?: number) {
    let query = supabase
      .from('products')
      .select(`
        *,
        supplier:suppliers!inner(*),
        category:product_categories(*)
      `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,name_in_tamil.ilike.%${searchTerm}%`)
      .eq('in_stock', true);

    const { data, error } = await query.order('popularity_score', { ascending: false });
    return { data, error };
  },

  // Naattu Kits
  async getNaattuKits(type?: string) {
    let query = supabase
      .from('naattu_kits')
      .select(`
        *,
        kit_products:naattu_kit_products(
          quantity,
          customizable,
          product:products(*)
        )
      `);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('popularity_score', { ascending: false });
    return { data, error };
  },

  async getNaattuKitById(id: string) {
    const { data, error } = await supabase
      .from('naattu_kits')
      .select(`
        *,
        kit_products:naattu_kit_products(
          quantity,
          customizable,
          product:products(
            *,
            supplier:suppliers(*)
          )
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Orders
  async createOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    return { data, error };
  },

  async getOrdersByVendor(vendorId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        supplier:suppliers(*),
        order_items:order_items(
          *,
          product:products(*)
        ),
        tracking_updates:tracking_updates(*)
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateOrderStatus(orderId: string, status: string, message?: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (!error && message) {
      await supabase
        .from('tracking_updates')
        .insert({
          order_id: orderId,
          status,
          message,
          timestamp: new Date().toISOString()
        });
    }

    return { data, error };
  },

  // Chat
  async getChatRooms(userId: string, userType: 'vendor' | 'supplier') {
    const column = userType === 'vendor' ? 'vendor_id' : 'supplier_id';
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        vendor:vendors(*),
        supplier:suppliers(*),
        last_message:chat_messages(*)
      `)
      .eq(column, userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async getChatMessages(roomId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async sendChatMessage(messageData: any) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single();
    return { data, error };
  },

  // Group Orders
  async getGroupOrders(latitude: number, longitude: number, radiusKm: number = 5) {
    const { data, error } = await supabase
      .rpc('get_nearby_group_orders', {
        lat: latitude,
        lng: longitude,
        radius_km: radiusKm
      });
    return { data, error };
  },

  async createGroupOrder(groupOrderData: any) {
    const { data, error } = await supabase
      .from('group_orders')
      .insert(groupOrderData)
      .select()
      .single();
    return { data, error };
  },

  async joinGroupOrder(groupOrderId: string, vendorId: string) {
    const { data, error } = await supabase
      .rpc('join_group_order', {
        group_order_id: groupOrderId,
        vendor_id: vendorId
      });
    return { data, error };
  }
};

// Real-time subscriptions
export const realtime = {
  subscribeToInventoryUpdates(supplierId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`inventory:${supplierId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `supplier_id=eq.${supplierId}`
        },
        callback
      )
      .subscribe();
  },

  subscribeToOrderUpdates(vendorId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`orders:${vendorId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `vendor_id=eq.${vendorId}`
        },
        callback
      )
      .subscribe();
  },

  subscribeToChatMessages(roomId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        callback
      )
      .subscribe();
  },

  subscribeToGroupOrders(_latitude: number, _longitude: number, callback: (payload: any) => void) {
    return supabase
      .channel('group-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_orders'
        },
        callback
      )
      .subscribe();
  },

  unsubscribe(subscription: any) {
    return supabase.removeChannel(subscription);
  }
};

export default supabase;
