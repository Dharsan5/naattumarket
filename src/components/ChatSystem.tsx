import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, ArrowLeft, User } from 'lucide-react';
import '../styles/chat.css';

interface Message {
  id: string;
  text: string;
  sender: 'vendor' | 'supplier';
  timestamp: Date;
  read: boolean;
}

interface ChatProps {
  supplierId: number;
  supplierName: string;
  orderId?: string;
  onClose?: () => void;
}

const ChatSystem: React.FC<ChatProps> = ({ supplierId, supplierName, orderId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Mock initial messages for demo purposes
  useEffect(() => {
    // Simulate loading messages from an API
    setIsLoading(true);
    
    // Sample conversation based on an order
    const sampleMessages: Message[] = orderId ? [
      {
        id: '1',
        text: `Hello, I'm inquiring about order #${orderId}. When can I expect delivery?`,
        sender: 'vendor',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
      },
      {
        id: '2',
        text: `Hello! Your order #${orderId} has been processed and is being prepared for dispatch. Expected delivery is within 24 hours.`,
        sender: 'supplier',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
        read: true,
      },
      {
        id: '3',
        text: "Are all items in stock? I'm particularly concerned about the freshness of the curry leaves.",
        sender: 'vendor',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
        read: true,
      },
      {
        id: '4',
        text: 'Yes, all items are in stock. The curry leaves were harvested this morning and will be packed with special care to maintain freshness during delivery.',
        sender: 'supplier',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: true,
      },
    ] : [
      {
        id: '1',
        text: `Hello, I'm interested in your products. Do you offer wholesale prices?`,
        sender: 'vendor',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
      {
        id: '2',
        text: 'Hello! Yes, we do offer special wholesale pricing. What specific products are you interested in?',
        sender: 'supplier',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
        read: true,
      }
    ];
    
    setTimeout(() => {
      setMessages(sampleMessages);
      setIsLoading(false);
    }, 1000);
  }, [orderId]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Create new message
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'vendor', // Assuming the current user is the vendor
      timestamp: new Date(),
      read: false,
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate supplier response after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(newMessage),
        sender: 'supplier',
        timestamp: new Date(),
        read: false,
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  // Generate automatic response for demo purposes
  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      return 'We typically deliver within 24-48 hours of order confirmation. You can track your order in the order details section.';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('discount')) {
      return 'We offer volume-based discounts. Orders above ₹10,000 get 5% off, and orders above ₹25,000 get 10% off.';
    } else if (lowerMessage.includes('quality') || lowerMessage.includes('fresh')) {
      return 'All our products are quality checked and guaranteed fresh. We source directly from farms for maximum freshness.';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! How can I help you today?';
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Feel free to reach out if you have any other questions.";
    }
    
    return "Thank you for your message. We'll get back to you shortly with more information.";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-system metal-glass-card">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className="btn-metal p-xs">
              <ArrowLeft size={18} />
            </button>
          )}
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-silver to-sage-silver-dark flex items-center justify-center">
            <User size={18} />
          </div>
          
          <div>
            <h3 className="heading-metal heading-metal-sm">{supplierName}</h3>
            <p className="text-metal text-xs">
              {orderId ? `Order #${orderId}` : 'General Inquiry'}
            </p>
          </div>
        </div>
        
        <button className="btn-metal p-xs">
          <MoreVertical size={18} />
        </button>
      </div>
      
      {/* Chat Messages */}
      <div className="chat-messages">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <div className="text-center my-4">
              <span className="badge-metal text-xs">
                {orderId ? `Conversation for Order #${orderId}` : 'New Conversation'}
              </span>
            </div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender === 'vendor' ? 'message-outgoing' : 'message-incoming'}`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input */}
      <div className="chat-input">
        <button className="btn-metal p-xs">
          <Paperclip size={18} />
        </button>
        
        <textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-metal flex-1"
          rows={1}
        />
        
        <button 
          onClick={handleSendMessage}
          disabled={newMessage.trim() === ''}
          className={`btn-metal ${newMessage.trim() !== '' ? 'btn-metal-primary' : ''} p-xs`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatSystem;
