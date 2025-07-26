import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, X, User } from 'lucide-react';
import { Message } from '../types/chat';
import '../styles/chat.css';

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

  // Load messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        // Import is inside useEffect to avoid circular dependencies
        const ChatService = (await import('../services/chatService')).default;
        
        // Fetch messages from API service
        const fetchedMessages = await ChatService.fetchMessages({
          supplierId,
          orderId
        });
        
        setMessages(fetchedMessages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [supplierId, orderId]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    const messageText = newMessage.trim();
    
    // Optimistically add message to UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: 'vendor', // Assuming the current user is the vendor
      timestamp: new Date(),
      read: false,
    };
    
    setMessages([...messages, tempMessage]);
    setNewMessage('');
    
    try {
      // Import is inside function to avoid circular dependencies
      const ChatService = (await import('../services/chatService')).default;
      
      // Send message through API service
      const sentMessage = await ChatService.sendMessage({
        supplierId,
        orderId,
        text: messageText
      });
      
      // Replace temporary message with actual message from server
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? sentMessage : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (e.g., show error notification)
      // Could add a retry button or visual indication that sending failed
    }
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

  // No minimize functionality

  return (
    <div className="chat-system metal-glass-card chat-centered">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="flex items-center flex-1 gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md relative">
            <User size={22} className="text-green-700" />
            <span className="status-online absolute bottom-0 right-0 border-2 border-white"></span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg text-shadow-strong">{supplierName}</h3>
            <p className="text-white text-xs flex items-center gap-1 font-medium text-shadow-sm">
              {orderId ? (
                <>
                  <span className="inline-block w-2 h-2 bg-white rounded-full shadow-glow"></span>
                  Order #{orderId}
                </>
              ) : 'Online now'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          {onClose && (
            <button 
              onClick={onClose} 
              className="chat-header-button chat-header-button-close"
              title="Close chat"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="chat-messages">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <div className="chat-date-separator">
              <span className="chat-date-text">
                {orderId === 'SUPPORT' ? 'Customer Support' : 
                  orderId ? `Order #${orderId} Conversation` : 'New Conversation'}
              </span>
            </div>
            
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                // Check if we need to add a date separator
                const showDateSeparator = index > 0 && 
                  new Date(msg.timestamp).toDateString() !== 
                  new Date(messages[index-1].timestamp).toDateString();
                
                return (
                  <React.Fragment key={msg.id}>
                    {showDateSeparator && (
                      <div className="chat-date-separator">
                        <span className="chat-date-text">
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div 
                      className={`message ${msg.sender === 'vendor' ? 'message-outgoing' : 'message-incoming'}`}
                    >
                      <div className="message-content">
                        <p className="message-text">{msg.text}</p>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                      {msg.sender === 'vendor' && (
                        <div className="message-status">
                          <span className={`status-indicator ${msg.read ? 'status-read' : 'status-sent'}`}>
                            {msg.read ? 'Read' : 'Sent'}
                          </span>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <p className="text-gray-500 mb-2">No messages yet</p>
                <p className="text-gray-400 text-sm">Start the conversation by typing a message below</p>
              </div>
            )}
            <div ref={messageEndRef} />
          </>
        )}
      </div>
      
      {/* Message Input */}
      <div className="chat-input">
        <button className="chat-action-button" title="Attach file">
          <Paperclip size={18} />
        </button>
        
        <textarea
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="input-metal flex-1"
          rows={1}
          autoFocus
        />
        
        <button 
          onClick={handleSendMessage}
          disabled={newMessage.trim() === ''}
          className={`chat-action-button ${newMessage.trim() !== '' ? 'chat-send-button' : ''}`}
          title="Send message"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatSystem;
