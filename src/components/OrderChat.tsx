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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 chat-modal-overlay">
      <div className="relative max-w-lg w-full animate-fade-in-up">

        
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
