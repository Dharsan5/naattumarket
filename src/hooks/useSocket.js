import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

export const useSocket = (token) => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!token) return;
    
    // Initialize socket connection
    socketService.init(token);
    
    // Add connect listener
    socketService.addListener('connect', () => {
      setIsConnected(true);
    });
    
    // Add disconnect listener
    socketService.addListener('disconnect', () => {
      setIsConnected(false);
    });
    
    return () => {
      // Clean up listeners
      socketService.removeAllListeners('connect');
      socketService.removeAllListeners('disconnect');
    };
  }, [token]);
  
  return {
    isConnected,
    socket: socketService,
    joinOrderRoom: (orderId) => socketService.joinOrderRoom(orderId),
    joinSupplierChat: (supplierId) => socketService.joinSupplierChat(supplierId),
    sendMessage: (data) => socketService.sendMessage(data),
    markMessagesAsRead: (supplierId) => socketService.markMessagesRead(supplierId),
    listenForMessages: (callback) => socketService.addListener('new-message', callback),
    stopListeningForMessages: () => socketService.removeAllListeners('new-message'),
    listenForStatusUpdates: (callback) => socketService.addListener('status-update', callback),
    stopListeningForStatusUpdates: () => socketService.removeAllListeners('status-update')
  };
};
