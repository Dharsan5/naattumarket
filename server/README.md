# NaattuMarket Server

Backend API server for NaattuMarket - A natural products marketplace connecting farmers and consumers.

## Features

- **RESTful API** - Clean and organized API endpoints
- **Real-time Communication** - Socket.IO for live order updates and chat
- **Supabase Authentication** - Built-in user management with JWT tokens
- **Row Level Security** - Secure data access with Supabase RLS policies
- **File Upload** - Support for product images via Supabase Storage
- **Rate Limiting** - Protection against abuse and spam
- **Error Handling** - Comprehensive error handling middleware
- **PostgreSQL Database** - Robust database with Supabase
- **Environment Configuration** - Flexible environment-based configuration

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and keys
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL Editor

5. Update `.env` with your Supabase configuration:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Database Setup

This project uses Supabase (PostgreSQL) as the database. Follow these steps:

1. **Create Supabase Project**: Sign up at [supabase.com](https://supabase.com) and create a new project.

2. **Run Database Schema**: Copy and paste the contents of `database/schema.sql` into your Supabase SQL Editor and execute it. This will create:
   - All required tables (suppliers, products, users, orders, etc.)
   - Row Level Security (RLS) policies
   - Sample data for testing
   - Indexes for optimal performance

3. **Configure Authentication**: In your Supabase dashboard:
   - Go to Authentication > Settings
   - Configure your site URL and redirect URLs
   - Enable email confirmation if desired
   - Set up any OAuth providers you want to use

4. **Get API Keys**: From Settings > API, copy:
   - Project URL
   - `anon` key (for client-side operations)
   - `service_role` key (for server-side admin operations)

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - Get all products (with filtering, search, pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/products/meta/categories` - Get product categories
- `POST /api/products` - Create new product (admin/supplier)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get single supplier
- `POST /api/suppliers` - Register as supplier
- `PUT /api/suppliers/:id` - Update supplier profile

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:productId` - Add to favorites

## Socket.IO Events

### Client to Server
- `join-order-room` - Join order-specific room for updates
- `send-message` - Send chat message
- `order-status-update` - Update order status (suppliers)

### Server to Client
- `new-message` - Receive new chat message
- `status-update` - Receive order status update
- `notification` - Receive general notifications

## Project Structure

```
server/
├── src/
│   ├── config/          # Database and app configuration
│   ├── middleware/      # Custom middleware functions
│   ├── models/          # Database models (Mongoose schemas)
│   ├── routes/          # API route definitions
│   ├── controllers/     # Route controllers
│   ├── utils/           # Utility functions
│   └── index.js         # Server entry point
├── uploads/             # File upload directory
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Environment Variables

See `.env.example` for all available environment variables and their descriptions.

Key variables:
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 5000)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key for client operations
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for admin operations
- `CLIENT_URL` - Frontend application URL for CORS

## Development

### Running in Development Mode
```bash
npm run dev
```

This starts the server with nodemon for automatic restarts on file changes.

### Building for Production
```bash
npm run build
npm start
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Joi validation schemas
- **JWT Authentication** - Secure token-based authentication
- **File Upload Limits** - Size and type restrictions

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Submit a pull request

## License

MIT License - see LICENSE file for details
