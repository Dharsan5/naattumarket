import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getSupabase } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import supplierRoutes from './routes/suppliers.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import vendorRoutes from './routes/vendors.js';
import uploadRoutes from './routes/uploads.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    // Allow any origin in development
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"]
  }
});

// Connect to database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
// Configure helmet with relaxed settings for development
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

// Configure CORS - make it more permissive for development
app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin in development
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  credentials: true,
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

// CORS preflight options handling for all routes
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NaattuMarket API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/uploads', uploadRoutes);

  // Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Authentication for socket connections
  const token = socket.handshake.auth.token;
  let userId = null;
  
  if (token) {
    try {
      // Verify JWT token would be here
      // For now, we'll assume the token is the userId for simplicity
      userId = token;
      console.log(`Authenticated socket for user ${userId}`);
    } catch (error) {
      console.error('Socket authentication error:', error);
    }
  }

  // Join room for order updates
  socket.on('join-order-room', (orderId) => {
    if (!orderId) return;
    socket.join(`order-${orderId}`);
    console.log(`Socket ${socket.id} joined room: order-${orderId}`);
  });
  
  // Join supplier chat room
  socket.on('join-supplier-chat', (supplierId) => {
    if (!supplierId) return;
    socket.join(`supplier-${supplierId}`);
    console.log(`Socket ${socket.id} joined room: supplier-${supplierId}`);
  });

  // Handle chat messages
  socket.on('send-message', async (data) => {
    try {
      const { supplierId, orderId, message, recipientId } = data;
      
      if (!supplierId || !message || !userId) {
        return console.error('Invalid message data:', data);
      }
      
      // Save message to database
      const supabase = getSupabase();
      const { error } = await supabase
        .from('messages')
        .insert({
          content: message.text,
          user_id: userId,
          supplier_id: supplierId,
          order_id: orderId !== 'general' ? orderId : null,
          recipient_id: recipientId,
          is_read: false,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error saving message:', error);
        return;
      }
      
      // Emit to supplier chat room
      io.to(`supplier-${supplierId}`).emit('new-message', {
        ...data,
        timestamp: new Date().toISOString()
      });
      
      // If it's an order-specific message, also emit to order room
      if (orderId && orderId !== 'general') {
        io.to(`order-${orderId}`).emit('new-message', {
          ...data,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle order status updates
  socket.on('order-status-update', (data) => {
    const { orderId, status, message } = data;
    
    if (!orderId || !status) {
      return console.error('Invalid order update data:', data);
    }
    
    io.to(`order-${orderId}`).emit('status-update', {
      orderId,
      status,
      message,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle message read status
  socket.on('mark-messages-read', async (data) => {
    try {
      const { supplierId } = data;
      
      if (!supplierId || !userId) {
        return console.error('Invalid read status data:', data);
      }
      
      // Update read status in database
      const supabase = getSupabase();
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('supplier_id', supplierId)
        .eq('recipient_id', userId)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking messages as read:', error);
        return;
      }
      
      // Emit read status to supplier chat room
      io.to(`supplier-${supplierId}`).emit('messages-read', {
        supplierId,
        userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Force port 5000 in development to match frontend proxy config
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;

server.listen(PORT, () => {
  console.log(`🚀 NaattuMarket Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
