import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatSystem from './ChatSystem';
import '../styles/chat.css';

interface OrderChatProps {
  orderId: string;
  supplierId: number;
  supplierName: string;
}

const OrderChat: React.FC<OrderChatProps> = ({ orderId, supplierId, supplierName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-metal flex items-center gap-2"
      >
        <MessageCircle size={16} />
        Chat with Supplier
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-lg w-full">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
            
            <ChatSystem
              supplierId={supplierId}
              supplierName={supplierName}
              orderId={orderId}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OrderChat;
