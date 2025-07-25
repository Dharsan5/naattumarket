import { io, Socket } from 'socket.io-client';
import type { SocketEvents } from '../types';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    this.socket = io(serverUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      retries: 3,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.socket?.connect();
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  connect() {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Chat Methods
  joinRoom(roomId: string) {
    this.socket?.emit('join_room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave_room', roomId);
  }

  sendMessage(message: Parameters<SocketEvents['send_message']>[0]) {
    this.socket?.emit('send_message', message);
  }

  onMessageReceived(callback: (message: Parameters<SocketEvents['message_received']>[0]) => void) {
    this.socket?.on('message_received', callback);
  }

  startTyping(roomId: string, userId: string) {
    this.socket?.emit('typing_start', { roomId, userId, isTyping: true, timestamp: new Date() });
  }

  stopTyping(roomId: string, userId: string) {
    this.socket?.emit('typing_stop', { roomId, userId, isTyping: false, timestamp: new Date() });
  }

  onTypingUpdate(callback: (data: Parameters<SocketEvents['typing_start']>[0]) => void) {
    this.socket?.on('typing_start', callback);
    this.socket?.on('typing_stop', callback);
  }

  markMessageAsRead(messageId: string, userId: string) {
    this.socket?.emit('message_read', { messageId, userId });
  }

  // Inventory Methods
  onInventoryUpdate(callback: (data: Parameters<SocketEvents['inventory_update']>[0]) => void) {
    this.socket?.on('inventory_update', callback);
  }

  onProductAvailabilityChange(callback: (data: Parameters<SocketEvents['product_availability']>[0]) => void) {
    this.socket?.on('product_availability', callback);
  }

  // Order Methods
  onOrderStatusUpdate(callback: (data: Parameters<SocketEvents['order_status_update']>[0]) => void) {
    this.socket?.on('order_status_update', callback);
  }

  onSupplierOnlineStatus(callback: (data: Parameters<SocketEvents['supplier_online_status']>[0]) => void) {
    this.socket?.on('supplier_online_status', callback);
  }

  // Group Order Methods
  onGroupOrderInvitation(callback: (groupOrder: Parameters<SocketEvents['group_order_invitation']>[0]) => void) {
    this.socket?.on('group_order_invitation', callback);
  }

  onGroupOrderUpdate(callback: (groupOrder: Parameters<SocketEvents['group_order_update']>[0]) => void) {
    this.socket?.on('group_order_update', callback);
  }

  // Utility Methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Remove all listeners for a specific event
  off(event: keyof SocketEvents, callback?: (...args: any[]) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.removeAllListeners(event);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  // Public method to access socket for event listeners
  onConnect(callback: () => void) {
    this.socket?.on('connect', callback);
  }

  onDisconnect(callback: () => void) {
    this.socket?.on('disconnect', callback);
  }

  offConnect(callback: () => void) {
    this.socket?.off('connect', callback);
  }

  offDisconnect(callback: () => void) {
    this.socket?.off('disconnect', callback);
  }
}

// Create singleton instance
export const socketManager = new SocketManager();

// Hook for React components
import { useEffect, useRef, useState } from 'react';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socketManager.isConnected());
  const socketRef = useRef(socketManager);

  useEffect(() => {
    const socket = socketRef.current;
    
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.onConnect(handleConnect);
    socket.onDisconnect(handleDisconnect);

    return () => {
      socket.offConnect(handleConnect);
      socket.offDisconnect(handleDisconnect);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected
  };
}

export default socketManager;
