import React from 'react';
import { MessageCircle } from 'lucide-react';
import '../styles/chat.css';

interface ChatButtonProps {
  onClick: () => void;
  hasNewMessages?: boolean;
  type?: 'icon' | 'floating';
  label?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ 
  onClick, 
  hasNewMessages = false,
  type = 'icon',
  label = 'Chat'
}) => {
  if (type === 'floating') {
    return (
      <button 
        onClick={onClick}
        className="floating-chat-button"
        title="Open chat"
        aria-label="Open chat"
      >
        <MessageCircle size={24} strokeWidth={2} color="#000" />
        {hasNewMessages && <span className="chat-notification-dot"></span>}
      </button>
    );
  }
  
  return (
    <button 
      onClick={onClick}
      className="chat-icon-button"
      title="Open chat"
    >
      <MessageCircle size={16} />
      {hasNewMessages && <span className="chat-notification-dot"></span>}
    </button>
  );
};

export default ChatButton;
