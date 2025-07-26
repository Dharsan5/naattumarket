import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';
import ChatSystem from './ChatSystem';
import '../styles/chat.css';

interface OrderChatProps {
  orderId: string;
  supplierId: number;
  supplierName: string;
  startOpen?: boolean;
  onClose?: () => void;
}

const OrderChat: React.FC<OrderChatProps> = ({ 
  orderId, 
  supplierId, 
  supplierName, 
  startOpen = false,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  // If parent component provides startOpen prop and it changes, update our local state
  useEffect(() => {
    setIsOpen(startOpen);
  }, [startOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 chat-modal-overlay">
      <div className="relative max-w-lg w-full animate-fade-in-up">
        <div className="absolute top-3 right-3 z-10">
            <button 
              onClick={handleClose}
              className="text-black hover:text-gray-700 bg-white/90 p-2 rounded-full backdrop-blur-sm shadow-sm"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
        </div>
        
        <ChatSystem
          supplierId={supplierId}
          supplierName={supplierName}
          orderId={orderId}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default OrderChat;
