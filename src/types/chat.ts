// Chat related types
export interface Message {
  id: string;
  text: string;
  sender: 'vendor' | 'supplier';
  timestamp: Date;
  read: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  image?: string;
  orders?: { id: string; date: Date; status: string }[];
}
