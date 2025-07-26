# NaattuMarket - Native Supply. Real Time.

A real-time marketplace connecting street food vendors with local suppliers through instant chat, curated product kits, and location-based discovery.

## 🎯 Features

- **Real-time Chat**: Instant communication with suppliers using Socket.IO
- **Naattu Kits**: Curated business starter kits (Tiffin, Tea Stall, Chaat)
- **Local Discovery**: Location-based supplier matching
- **Live Inventory**: Real-time stock updates
- **Mobile-First**: Optimized for street vendors on mobile devices
- **Glassmorphism UI**: Modern olive-themed design with glass effects

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS with custom glassmorphism theme
- **Real-time**: Socket.IO client
- **Database**: Supabase (PostgreSQL + Auth)
- **UI/UX**: Framer Motion + Lucide Icons
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NattuMarket
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   **Frontend (.env):**
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

   **Backend (server/.env):**
   ```bash
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Database Setup (Supabase)**
   - Create a new Supabase project
   - Run the SQL schema from `server/database/schema.sql`
   - Update environment variables with your Supabase credentials

5. **Start Development**

   **Option A: Using batch script (Windows)**
   ```bash
   start-dev.bat
   ```

   **Option B: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

   **Frontend**: http://localhost:5173
   **Backend API**: http://localhost:5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd naattu-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SOCKET_URL=ws://localhost:3001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄 Database Setup

The app requires the following Supabase tables:

- `vendors` - Vendor profiles and business info
- `suppliers` - Supplier details and verification status
- `products` - Product catalog with real-time stock
- `naattu_kits` - Curated product bundles
- `orders` - Order management and tracking
- `messages` - Chat message storage

Use the Supabase dashboard to create these tables or run the provided migration scripts.

## 🎨 Design System

### Color Palette
- **Background**: `#e5eadb` (soft olive white)
- **Primary**: `#718355` (organic olive green)
- **Glassmorphism**: Transparent components with blur effects

### Components
- **GlassCard**: Reusable glassmorphism container
- **GlassButton**: Interactive button with hover effects
- **Header**: Sticky navigation with location display
- **BottomNav**: Mobile-friendly bottom navigation

## 📱 Pages

1. **Home** - Dashboard with quick actions and recent orders
2. **Suppliers** - Local supplier discovery with real-time status
3. **Naattu Kits** - Curated business starter packages
4. **Chat** - Real-time messaging with suppliers
5. **Profile** - Vendor profile and business management

## 🔌 Real-time Features

- Live chat with typing indicators
- Real-time stock updates
- Order status notifications
- Supplier online/offline status

## 🌍 Localization Ready

- Built with React i18next structure
- Tamil + English support planned
- Voice search integration ready

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel, Netlify, or similar
   - Configure environment variables
   - Setup Socket.IO server separately

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for Tamil Nadu's street food vendors