import React, { useState, useEffect } from 'react';
import { User, Search, MessageSquare } from 'lucide-react';
import ChatSystem from '../components/ChatSystem';
import '../styles/chat.css';

interface Supplier {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  image?: string;
  orders?: { id: string; date: Date; status: string }[];
}

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
    // Simulate loading suppliers from API
    const loadSuppliers = async () => {
      setIsLoading(true);
      
      // Mock data
      const mockSuppliers: Supplier[] = [
        {
          id: 1,
          name: 'Green Valley Farms',
          lastMessage: 'Your order has been dispatched and will arrive tomorrow.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
          unreadCount: 2,
          orders: [
            { id: 'ORD-2023-001', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), status: 'delivered' },
            { id: 'ORD-2023-045', date: new Date(Date.now() - 1000 * 60 * 60 * 5), status: 'shipping' }
          ]
        },
        {
          id: 2,
          name: 'Nature\'s Best',
          lastMessage: 'We have restocked the curry leaves you inquired about.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          unreadCount: 0,
          orders: [
            { id: 'ORD-2023-032', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), status: 'delivered' }
          ]
        },
        {
          id: 3,
          name: 'Golden Harvest',
          lastMessage: 'Thank you for your order! Let us know if you have any questions.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          unreadCount: 1,
          orders: [
            { id: 'ORD-2023-056', date: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'processing' }
          ]
        },
        {
          id: 4,
          name: 'Spice World Exports',
          lastMessage: 'The special discount for bulk orders is available until this weekend.',
          lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          unreadCount: 0
        }
      ];
      
      setTimeout(() => {
        setSuppliers(mockSuppliers);
        setIsLoading(false);
      }, 1000);
    };
    
    loadSuppliers();
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
  
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedOrder(undefined);
    setShowChat(true);
    
    // Mark messages as read (in a real app, this would call an API)
    setSuppliers(prev => 
      prev.map(s => 
        s.id === supplier.id ? { ...s, unreadCount: 0 } : s
      )
    );
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
                      <div className="chat-list-message">{supplier.lastMessage}</div>
                    </div>
                    
                    <div className="chat-list-meta">
                      <div className="chat-list-time">{formatTime(supplier.lastMessageTime)}</div>
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
            {selectedSupplier.orders && selectedSupplier.orders.length > 0 && (
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
