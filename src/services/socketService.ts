// Service for handling chat communication
import { io } from 'socket.io-client';
import { Message } from '../types/chat';

// Socket connection
let socket: any = null;
let isConnected = false;
let userId: string | null = null;

// API URL from environment - use fixed value for development to prevent issues
const API_URL = 'http://localhost:5000';

// Event listeners
const listeners: { [key: string]: Function[] } = {
  'new-message': [],
  'status-update': [],
  'messages-read': [],
  'connect': [],
  'disconnect': []
};

// Socket service
const SocketService = {
  // Initialize socket connection
  init: (token: string) => {
    try {
      if (socket) return;
      
      userId = token;
      
      socket = io(API_URL, {
        auth: {
          token
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
    
    // Socket event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      isConnected = true;
      
      // Notify listeners
      listeners['connect'].forEach(callback => callback());
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      isConnected = false;
      
      // Notify listeners
      listeners['disconnect'].forEach(callback => callback());
    });
    
    socket.on('new-message', (data: any) => {
      console.log('New message received:', data);
      
      // Notify listeners
      listeners['new-message'].forEach(callback => callback(data));
    });
    
    socket.on('status-update', (data: any) => {
      console.log('Status update received:', data);
      
      // Notify listeners
      listeners['status-update'].forEach(callback => callback(data));
    });
    
    socket.on('messages-read', (data: any) => {
      console.log('Messages marked as read:', data);
      
      // Notify listeners
      listeners['messages-read'].forEach(callback => callback(data));
    });
    
    return socket;
  },
  
  // Disconnect socket
  disconnect: () => {
    if (!socket) return;
    
    socket.disconnect();
    socket = null;
    isConnected = false;
    userId = null;
  },
  
  // Check connection status
  isConnected: () => isConnected,
  
  // Join supplier chat room
  joinSupplierChat: (supplierId: number) => {
    if (!socket || !isConnected) return;
    
    socket.emit('join-supplier-chat', supplierId);
  },
  
  // Join order room
  joinOrderRoom: (orderId: string) => {
    if (!socket || !isConnected) return;
    
    socket.emit('join-order-room', orderId);
  },
  
  // Send message
  sendMessage: (supplierId: number, orderId: string | undefined, message: Message, recipientId: number) => {
    if (!socket || !isConnected) return;
    
    socket.emit('send-message', {
      supplierId,
      orderId: orderId || 'general',
      message,
      recipientId,
      userId
    });
  },
  
  // Mark messages as read
  markMessagesAsRead: (supplierId: number) => {
    if (!socket || !isConnected) return;
    
    socket.emit('mark-messages-read', {
      supplierId
    });
  },
  
  // Add event listener
  on: (event: string, callback: Function) => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    
    listeners[event].push(callback);
    
    return () => {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    };
  }
};

export default SocketService;
