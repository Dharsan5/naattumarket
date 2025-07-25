// Database types for Supabase integration
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          role: 'vendor' | 'supplier';
          avatar: string | null;
          verified: boolean;
          language: 'en' | 'ta';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone: string;
          role: 'vendor' | 'supplier';
          avatar?: string | null;
          verified?: boolean;
          language?: 'en' | 'ta';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string;
          role?: 'vendor' | 'supplier';
          avatar?: string | null;
          verified?: boolean;
          language?: 'en' | 'ta';
          created_at?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          latitude: number;
          longitude: number;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          latitude: number;
          longitude: number;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          business_name_in_tamil: string | null;
          location_id: string;
          rating: number;
          review_count: number;
          verified: boolean;
          tags: string[];
          delivery_radius: number;
          minimum_order: number;
          is_online: boolean;
          last_seen: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          business_name_in_tamil?: string | null;
          location_id: string;
          rating?: number;
          review_count?: number;
          verified?: boolean;
          tags?: string[];
          delivery_radius?: number;
          minimum_order?: number;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          business_name_in_tamil?: string | null;
          location_id?: string;
          rating?: number;
          review_count?: number;
          verified?: boolean;
          tags?: string[];
          delivery_radius?: number;
          minimum_order?: number;
          is_online?: boolean;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          business_name_in_tamil: string | null;
          business_type: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks' | 'other';
          location_id: string;
          preferred_suppliers: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          business_name_in_tamil?: string | null;
          business_type: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks' | 'other';
          location_id: string;
          preferred_suppliers?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          business_name_in_tamil?: string | null;
          business_type?: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks' | 'other';
          location_id?: string;
          preferred_suppliers?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          name_in_tamil: string | null;
          icon: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_in_tamil?: string | null;
          icon: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_in_tamil?: string | null;
          icon?: string;
          color?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          category_id: string;
          name: string;
          name_in_tamil: string | null;
          description: string;
          description_in_tamil: string | null;
          price: number;
          unit: string;
          in_stock: boolean;
          stock_count: number;
          image_url: string | null;
          popularity_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          category_id: string;
          name: string;
          name_in_tamil?: string | null;
          description: string;
          description_in_tamil?: string | null;
          price: number;
          unit: string;
          in_stock?: boolean;
          stock_count?: number;
          image_url?: string | null;
          popularity_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          category_id?: string;
          name?: string;
          name_in_tamil?: string | null;
          description?: string;
          description_in_tamil?: string | null;
          price?: number;
          unit?: string;
          in_stock?: boolean;
          stock_count?: number;
          image_url?: string | null;
          popularity_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      naattu_kits: {
        Row: {
          id: string;
          name: string;
          name_in_tamil: string | null;
          description: string;
          description_in_tamil: string | null;
          type: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks';
          total_price: number;
          discount_price: number | null;
          image_url: string | null;
          tags: string[];
          popularity_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_in_tamil?: string | null;
          description: string;
          description_in_tamil?: string | null;
          type: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks';
          total_price: number;
          discount_price?: number | null;
          image_url?: string | null;
          tags?: string[];
          popularity_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_in_tamil?: string | null;
          description?: string;
          description_in_tamil?: string | null;
          type?: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks';
          total_price?: number;
          discount_price?: number | null;
          image_url?: string | null;
          tags?: string[];
          popularity_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          vendor_id: string;
          supplier_id: string;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          subtotal: number;
          delivery_fee: number;
          total: number;
          payment_method: 'upi' | 'cash' | 'card';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address_id: string;
          estimated_delivery: string;
          actual_delivery: string | null;
          notes: string | null;
          group_order_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          supplier_id: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          subtotal: number;
          delivery_fee?: number;
          total: number;
          payment_method: 'upi' | 'cash' | 'card';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address_id: string;
          estimated_delivery: string;
          actual_delivery?: string | null;
          notes?: string | null;
          group_order_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          supplier_id?: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          payment_method?: 'upi' | 'cash' | 'card';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          delivery_address_id?: string;
          estimated_delivery?: string;
          actual_delivery?: string | null;
          notes?: string | null;
          group_order_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          vendor_id: string;
          supplier_id: string;
          unread_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          supplier_id: string;
          unread_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          supplier_id?: string;
          unread_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          room_id: string;
          sender_id: string;
          sender_type: 'vendor' | 'supplier';
          message: string;
          message_type: 'text' | 'quick_phrase' | 'image' | 'location' | 'order_request';
          translated_message: string | null;
          metadata: Record<string, any> | null;
          read_by: string[];
          timestamp: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          sender_id: string;
          sender_type: 'vendor' | 'supplier';
          message: string;
          message_type?: 'text' | 'quick_phrase' | 'image' | 'location' | 'order_request';
          translated_message?: string | null;
          metadata?: Record<string, any> | null;
          read_by?: string[];
          timestamp?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          sender_id?: string;
          sender_type?: 'vendor' | 'supplier';
          message?: string;
          message_type?: 'text' | 'quick_phrase' | 'image' | 'location' | 'order_request';
          translated_message?: string | null;
          metadata?: Record<string, any> | null;
          read_by?: string[];
          timestamp?: string;
        };
      };
      group_orders: {
        Row: {
          id: string;
          initiator_id: string;
          participants: string[];
          supplier_id: string;
          status: 'forming' | 'confirmed' | 'active' | 'completed' | 'cancelled';
          minimum_amount: number;
          current_amount: number;
          expires_at: string;
          discount_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          initiator_id: string;
          participants?: string[];
          supplier_id: string;
          status?: 'forming' | 'confirmed' | 'active' | 'completed' | 'cancelled';
          minimum_amount: number;
          current_amount?: number;
          expires_at: string;
          discount_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          initiator_id?: string;
          participants?: string[];
          supplier_id?: string;
          status?: 'forming' | 'confirmed' | 'active' | 'completed' | 'cancelled';
          minimum_amount?: number;
          current_amount?: number;
          expires_at?: string;
          discount_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_nearby_suppliers: {
        Args: {
          lat: number;
          lng: number;
          radius_km: number;
        };
        Returns: any[];
      };
      get_nearby_group_orders: {
        Args: {
          lat: number;
          lng: number;
          radius_km: number;
        };
        Returns: any[];
      };
      join_group_order: {
        Args: {
          group_order_id: string;
          vendor_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: 'vendor' | 'supplier';
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
      payment_method: 'upi' | 'cash' | 'card';
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
      business_type: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks' | 'other';
      kit_type: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks';
      message_type: 'text' | 'quick_phrase' | 'image' | 'location' | 'order_request';
      group_order_status: 'forming' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
