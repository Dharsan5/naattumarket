// API service for Chat functionality
import { Message } from '../types/chat';
import SocketService from './socketService';

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Auth token getter function (implement based on your auth system)
const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

// Types
type SendMessageParams = {
  supplierId: number;
  orderId?: string;
  text: string;
};

type FetchMessagesParams = {
  supplierId: number;
  orderId?: string;
};

type MarkAsReadParams = {
  supplierId: number;
};

// Chat API Service
const ChatService = {
  // Fetch messages for a conversation
  fetchMessages: async ({ supplierId, orderId }: FetchMessagesParams): Promise<Message[]> => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/api/messages?supplierId=${supplierId}&orderId=${orderId || 'general'}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch messages');
      }
      
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a new message
  sendMessage: async ({ supplierId, orderId, text }: SendMessageParams): Promise<Message> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ supplierId, orderId: orderId || 'general', text })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async ({ supplierId }: MarkAsReadParams): Promise<void> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/messages/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ supplierId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark messages as read');
      }
      
      // Also notify via socket for real-time updates
      if (SocketService.isConnected()) {
        SocketService.markMessagesAsRead(supplierId);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },
  
  // Initialize socket connection
  initSocket: () => {
    const token = getAuthToken();
    if (token) {
      SocketService.init(token);
    }
  },
  
  // Join supplier chat room
  joinSupplierChat: (supplierId: number) => {
    SocketService.joinSupplierChat(supplierId);
  },
  
  // Register for real-time message updates
  onNewMessage: (callback: Function) => {
    return SocketService.on('new-message', callback);
  }
};

export default ChatService;
