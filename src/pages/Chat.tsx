import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, MoreVertical, ArrowLeft, Mic } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { Header } from '../components/layout/Header';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastSeen: string;
  unreadCount: number;
  online: boolean;
}

export const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: ChatContact[] = [
    {
      id: '1',
      name: 'Ravi Vegetables',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
      lastMessage: 'Fresh tomatoes available now!',
      lastSeen: '2 min ago',
      unreadCount: 2,
      online: true
    },
    {
      id: '2',
      name: 'Lakshmi Spices',
      avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=150',
      lastMessage: 'Tea powder ready for delivery',
      lastSeen: '10 min ago',
      unreadCount: 0,
      online: false
    },
    {
      id: '3',
      name: 'Kumar Oil Store',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      lastMessage: 'Good morning! What do you need?',
      lastSeen: '1 hour ago',
      unreadCount: 1,
      online: false
    }
  ];

  const quickReplies = [
    'Price?',
    'Available?',
    'Delivery time?',
    'Fresh stock?'
  ];

  useEffect(() => {
    if (selectedChat) {
      // Load chat messages
      setMessages([
        {
          id: '1',
          senderId: selectedChat,
          content: 'Hello! What supplies do you need today?',
          timestamp: new Date(Date.now() - 300000),
          type: 'text'
        },
        {
          id: '2',
          senderId: 'me',
          content: 'Hi! Do you have fresh tomatoes?',
          timestamp: new Date(Date.now() - 240000),
          type: 'text'
        },
        {
          id: '3',
          senderId: selectedChat,
          content: 'Yes! Just got fresh stock. ₹25/kg. How much do you need?',
          timestamp: new Date(Date.now() - 120000),
          type: 'text'
        }
      ]);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      content: message,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChat,
        content: 'Thank you for your message. Let me check and get back to you.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  if (selectedChat) {
    const contact = contacts.find(c => c.id === selectedChat);
    
    return (
      <div className="min-h-screen bg-olive-50 pb-24 flex flex-col">
        {/* Chat Header */}
        <div className="sticky top-0 z-40 p-4 pb-2">
          <GlassCard variant="strong" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GlassButton 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedChat(null)}
                className="p-2"
              >
                <ArrowLeft size={16} />
              </GlassButton>
              <img 
                src={contact?.avatar} 
                alt={contact?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-olive-800">{contact?.name}</h3>
                <p className="text-xs text-olive-600">
                  {contact?.online ? 'Online' : `Last seen ${contact?.lastSeen}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <GlassButton size="sm" variant="outline" className="p-2">
                <Phone size={16} />
              </GlassButton>
              <GlassButton size="sm" variant="outline" className="p-2">
                <MoreVertical size={16} />
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 space-y-3 custom-scrollbar overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] p-3 rounded-2xl
                  ${msg.senderId === 'me' 
                    ? 'bg-olive-600 text-white ml-auto' 
                    : 'glass-card text-olive-800'
                  }
                `}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.senderId === 'me' ? 'text-olive-200' : 'text-olive-500'}`}>
                    {msg.timestamp.toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <GlassCard className="flex items-center gap-2 p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-olive-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-olive-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-olive-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-olive-600">typing...</span>
              </GlassCard>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 mb-2">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            {quickReplies.map((reply, index) => (
              <GlassButton
                key={index}
                size="sm"
                variant="outline"
                onClick={() => setMessage(reply)}
                className="whitespace-nowrap"
              >
                {reply}
              </GlassButton>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4">
          <GlassCard className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-olive-800 placeholder-olive-500"
            />
            <GlassButton size="sm" variant="outline" className="p-2">
              <Mic size={16} />
            </GlassButton>
            <GlassButton size="sm" onClick={sendMessage} className="p-2">
              <Send size={16} />
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive-50 pb-24">
      <Header title="Messages" showSearch={false} />
      
      <div className="px-4 space-y-3">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassCard 
              onClick={() => setSelectedChat(contact.id)}
              className="flex items-center gap-4 hover:glow-green transition-all duration-300"
            >
              <div className="relative">
                <img 
                  src={contact.avatar} 
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.online && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-olive-800">{contact.name}</h3>
                  <span className="text-xs text-olive-500">{contact.lastSeen}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-olive-600 truncate">{contact.lastMessage}</p>
                  {contact.unreadCount > 0 && (
                    <span className="bg-olive-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};