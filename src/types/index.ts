// Core Types for NaattuMarket
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'vendor' | 'supplier';
  location: Location;
  avatar?: string;
  verified: boolean;
  language: 'en' | 'ta';
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Product {
  id: string;
  name: string;
  nameInTamil?: string;
  description: string;
  descriptionInTamil?: string;
  category: ProductCategory;
  price: number;
  unit: string;
  inStock: boolean;
  stockCount: number;
  supplierId: string;
  supplier: Supplier;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameInTamil?: string;
  icon: string;
  color: string;
}

export interface Supplier {
  id: string;
  businessName: string;
  businessNameInTamil?: string;
  user: User;
  products: Product[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  tags: string[];
  deliveryRadius: number; // in kilometers
  minimumOrder: number;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Vendor {
  id: string;
  businessName: string;
  businessNameInTamil?: string;
  user: User;
  businessType: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks' | 'other';
  preferredSuppliers: string[];
  orderHistory: Order[];
}

export interface NaattuKit {
  id: string;
  name: string;
  nameInTamil?: string;
  description: string;
  descriptionInTamil?: string;
  type: 'tiffin' | 'tea' | 'chaat' | 'juice' | 'snacks';
  products: KitProduct[];
  totalPrice: number;
  discountPrice?: number;
  imageUrl?: string;
  tags: string[];
  popularityScore: number;
}

export interface KitProduct {
  productId: string;
  product: Product;
  quantity: number;
  customizable: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  supplierId: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Cart {
  id: string;
  vendorId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedDelivery: Date;
  groupOrderId?: string; // For "Buy Together" feature
}

export interface Order {
  id: string;
  vendorId: string;
  vendor: Vendor;
  supplierId: string;
  supplier: Supplier;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: Location;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  notes?: string;
  trackingUpdates: TrackingUpdate[];
  createdAt: Date;
  updatedAt: Date;
  groupOrderId?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'upi' | 'cash' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface TrackingUpdate {
  id: string;
  orderId: string;
  status: OrderStatus;
  message: string;
  messageInTamil?: string;
  timestamp: Date;
  location?: Location;
}

export interface GroupOrder {
  id: string;
  initiatorId: string;
  participants: string[]; // vendor IDs
  supplierId: string;
  supplier: Supplier;
  status: 'forming' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  minimumAmount: number;
  currentAmount: number;
  expiresAt: Date;
  orders: Order[];
  discountPercentage: number;
  createdAt: Date;
}

// Chat System Types
export interface ChatRoom {
  id: string;
  vendorId: string;
  supplierId: string;
  vendor: Vendor;
  supplier: Supplier;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: 'vendor' | 'supplier';
  message: string;
  messageType: 'text' | 'quick_phrase' | 'image' | 'location' | 'order_request';
  translatedMessage?: string;
  metadata?: MessageMetadata;
  readBy: string[];
  timestamp: Date;
}

export interface MessageMetadata {
  quickPhraseId?: string;
  orderId?: string;
  productId?: string;
  imageUrl?: string;
  location?: Location;
}

export interface QuickPhrase {
  id: string;
  category: 'greeting' | 'inquiry' | 'negotiation' | 'order' | 'delivery';
  english: string;
  tamil: string;
  icon: string;
  popularity: number;
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

// Socket Events
export interface SocketEvents {
  // Connection
  connect: () => void;
  disconnect: () => void;
  
  // Chat
  'join_room': (roomId: string) => void;
  'leave_room': (roomId: string) => void;
  'send_message': (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  'message_received': (message: ChatMessage) => void;
  'typing_start': (data: TypingIndicator) => void;
  'typing_stop': (data: TypingIndicator) => void;
  'message_read': (data: { messageId: string; userId: string }) => void;
  
  // Inventory Updates
  'inventory_update': (data: { productId: string; stockCount: number }) => void;
  'product_availability': (data: { productId: string; available: boolean }) => void;
  
  // Order Updates
  'order_status_update': (data: { orderId: string; status: OrderStatus; update: TrackingUpdate }) => void;
  'supplier_online_status': (data: { supplierId: string; isOnline: boolean; lastSeen: Date }) => void;
  
  // Group Orders
  'group_order_invitation': (groupOrder: GroupOrder) => void;
  'group_order_update': (groupOrder: GroupOrder) => void;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  inStockOnly?: boolean;
  verifiedOnly?: boolean;
  rating?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'distance';
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  titleInTamil?: string;
  message: string;
  messageInTamil?: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'order_confirmed'
  | 'order_ready'
  | 'order_delivered'
  | 'payment_received'
  | 'chat_message'
  | 'inventory_alert'
  | 'group_order_invitation'
  | 'supplier_online'
  | 'promotion';

// App State Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  language: 'en' | 'ta';
  location: Location | null;
  cart: Cart | null;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}
