import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: string;
          name: string;
          phone: string;
          location: {
            lat: number;
            lng: number;
          };
          business_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          location: {
            lat: number;
            lng: number;
          };
          business_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          location?: {
            lat: number;
            lng: number;
          };
          business_type?: string;
          created_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          location: {
            lat: number;
            lng: number;
          };
          verified: boolean;
          rating: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          location: {
            lat: number;
            lng: number;
          };
          verified?: boolean;
          rating?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          location?: {
            lat: number;
            lng: number;
          };
          verified?: boolean;
          rating?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          price: number;
          stock: number;
          category: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          name: string;
          price: number;
          stock: number;
          category: string;
          image_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          name?: string;
          price?: number;
          stock?: number;
          category?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      naattu_kits: {
        Row: {
          id: string;
          name: string;
          description: string;
          total_price: number;
          image_url: string;
          items: any;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          total_price: number;
          image_url?: string;
          items: any;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          total_price?: number;
          image_url?: string;
          items?: any;
          category?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          vendor_id: string;
          supplier_id: string;
          items: any;
          total_amount: number;
          status: string;
          delivery_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          supplier_id: string;
          items: any;
          total_amount: number;
          status?: string;
          delivery_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          supplier_id?: string;
          items?: any;
          total_amount?: number;
          status?: string;
          delivery_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          message_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          message_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          message_type?: string;
          created_at?: string;
        };
      };
    };
  };
};