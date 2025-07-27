import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { socketService } from '../services/socketService';
import { useLocation } from 'react-router-dom';

/**
 * SocketProvider - A component that manages socket connections based on auth state
 * Should wrap around the main app to provide socket functionality
 */
export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  
  // Connect socket when user is authenticated
  useEffect(() => {
    try {
      if (isAuthenticated && user?.id) {
        console.log('Initializing socket connection for user:', user.id);
        socketService.init(user.id);
      } else {
        // Disconnect socket when user logs out
        socketService.disconnect();
      }
      
      return () => {
        // Clean up on unmount
        socketService.disconnect();
      };
    } catch (error) {
      console.error('Error in socket connection:', error);
    }
  }, [isAuthenticated, user]);
  
  // Reconnect socket when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (isAuthenticated && user?.id) {
        console.log('Reconnecting socket after coming online');
        socketService.init(user.id);
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated, user]);
  
  // Join relevant rooms based on path
  useEffect(() => {
    try {
      const path = location.pathname;
      
      // Extract order ID from path if viewing an order
      if (path.includes('/orders/') && isAuthenticated) {
        const orderId = path.split('/orders/')[1].split('/')[0];
        if (orderId) {
          console.log('Joining order room:', orderId);
          socketService.joinOrderRoom(orderId);
        }
      }
      
      // Extract supplier ID if viewing a supplier chat
      if (path.includes('/suppliers/') && path.includes('/chat') && isAuthenticated) {
        const supplierId = path.split('/suppliers/')[1].split('/')[0];
        if (supplierId) {
          console.log('Joining supplier chat:', supplierId);
          socketService.joinSupplierChat(supplierId);
        }
      }
    } catch (error) {
      console.error('Error joining rooms:', error);
    }
  }, [location.pathname, isAuthenticated]);
  
  return (
    <>{children}</>
  );
};
