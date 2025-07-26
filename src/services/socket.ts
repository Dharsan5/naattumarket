import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId: string): void {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001', {
      auth: {
        userId
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  sendMessage(roomId: string, message: any): void {
    if (this.socket) {
      this.socket.emit('send_message', { roomId, message });
    }
  }

  onMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onStockUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('stock_update', callback);
    }
  }

  onOrderUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('order_update', callback);
    }
  }

  emitTyping(roomId: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit('typing', { roomId, isTyping });
    }
  }

  onTyping(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }
}

export default SocketService;