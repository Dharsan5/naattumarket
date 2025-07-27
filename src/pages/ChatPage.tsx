import React, { useState, useEffect } from 'react';
import { User, Search, MessageSquare } from 'lucide-react';
import ChatSystem from '../components/ChatSystem';
import { Supplier } from '../types/chat';
import '../styles/chat.css';

const ChatPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Handle window resize for responsive layout
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        // Import is inside useEffect to avoid circular dependencies
        const SupplierService = await import('../services/supplierService');
        
        // Fetch suppliers from API service
        const fetchedSuppliers = await SupplierService.SupplierService.getSuppliers();
        
        setSuppliers(fetchedSuppliers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setSuppliers([]);
        setIsLoading(false);
      }
    };
    
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const handleSelectSupplier = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedOrder(undefined);
    setShowChat(true);
    
    try {
      // Import is inside function to avoid circular dependencies
      const ChatService = (await import('../services/chatService')).default;
      
      // Mark messages as read through API service
      await ChatService.markMessagesAsRead({
        supplierId: supplier.id
      });
      
      // Update local state for immediate UI feedback
      setSuppliers(prev => 
        prev.map(s => 
          s.id === supplier.id ? { ...s, unreadCount: 0 } : s
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // We still update the UI optimistically even if the API call fails
      setSuppliers(prev => 
        prev.map(s => 
          s.id === supplier.id ? { ...s, unreadCount: 0 } : s
        )
      );
    }
  };
  
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrder(orderId);
  };
  
  const handleBackToList = () => {
    setShowChat(false);
  };

  // On mobile, show either the chat list or the chat
  const shouldShowChatList = !isMobile || (isMobile && !showChat);
  const shouldShowChat = !isMobile || (isMobile && showChat);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="heading-metal heading-metal-xl mb-2">Messages</h1>
        <p className="text-metal">Communicate with your suppliers about orders and inquiries</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Suppliers List */}
        {shouldShowChatList && (
          <div className="w-full md:w-1/3 metal-glass-card p-4">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-metal w-full pl-10"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-metal" />
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="loading-spinner"></div>
              </div>
            ) : filteredSuppliers.length > 0 ? (
              <div className="chat-list">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className={`chat-list-item ${selectedSupplier?.id === supplier.id ? 'active' : ''}`}
                    onClick={() => handleSelectSupplier(supplier)}
                  >
                    <div className="chat-list-avatar">
                      {supplier.image ? (
                        <img src={supplier.image} alt={supplier.name} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    
                    <div className="chat-list-content">
                      <div className="chat-list-name">{supplier.name}</div>
                      <div className="chat-list-message">{supplier.lastMessage || 'No recent messages'}</div>
                    </div>
                    
                    <div className="chat-list-meta">
                      <div className="chat-list-time">{supplier.lastMessageTime ? formatTime(supplier.lastMessageTime) : ''}</div>
                      {supplier.unreadCount > 0 && (
                        <div className="chat-list-badge">{supplier.unreadCount}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-metal">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                <p>No suppliers found</p>
              </div>
            )}
          </div>
        )}
        
        {/* Chat Area */}
        {shouldShowChat && selectedSupplier ? (
          <div className="w-full md:w-2/3">
            {/* Order Selection (if available) */}
            {selectedSupplier.orders && selectedSupplier.orders.length > 0 ? (
              <div className="metal-glass-card p-4 mb-4">
                <h3 className="heading-metal heading-metal-sm mb-3">Select Order Conversation</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className={`btn-metal ${!selectedOrder ? 'btn-metal-primary' : ''}`}
                    onClick={() => setSelectedOrder(undefined)}
                  >
                    General Chat
                  </button>
                  
                  {selectedSupplier.orders.map(order => (
                    <button
                      key={order.id}
                      className={`btn-metal ${selectedOrder === order.id ? 'btn-metal-primary' : ''}`}
                      onClick={() => handleSelectOrder(order.id)}
                    >
                      {order.id}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="metal-glass-card p-4 mb-4">
                <div className="text-center py-3">
                  <p className="text-metal mb-1">No orders with this supplier yet</p>
                  <p className="text-sm text-metal-light">This is a general conversation</p>
                </div>
              </div>
            )}
            
            {/* Chat Component */}
            <ChatSystem
              supplierId={selectedSupplier.id}
              supplierName={selectedSupplier.name}
              orderId={selectedOrder}
              onClose={isMobile ? handleBackToList : undefined}
            />
          </div>
        ) : shouldShowChat && (
          <div className="w-full md:w-2/3 flex items-center justify-center h-96 metal-glass-card">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto mb-4 text-metal opacity-30" />
              <h3 className="heading-metal heading-metal-md mb-2">No conversation selected</h3>
              <p className="text-metal">Select a supplier to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
