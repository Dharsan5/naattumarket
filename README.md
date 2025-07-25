# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# NaattuMarket - Native Supply. Real Time. 🔥

A real-time marketplace connecting street food vendors with local suppliers in Tamil Nadu, India. Built with modern web technologies and featuring a beautiful olive glass design theme.

## 🎯 Features

### 🔴 **Real-time Live Chat with Suppliers**
- Instant communication using Socket.IO
- Tamil language quick phrases for low-literacy users
- Message translation and typing indicators
- Voice message support

### 🛒 **Naattu Kits & Dynamic Orders**
- Curated supply packages: Tiffin Kit, Tea Stall Kit, Chaat Kit
- Smart price calculation with real-time updates
- "Buy Together" feature for bulk discounts
- Custom kit builder

### 🌍 **Local Supplier Discovery**
- Location-based supplier matching
- Verified supplier badges
- Live inventory tracking
- Real-time availability updates

### 🧑‍🍳 **Simple UI for Low-Tech Users**
- Tamil-first interface with i18n support
- Icon-based navigation
- Voice search capabilities
- Quick action cards ("Reorder Yesterday")

### 🧾 **Order Tracking & Alerts**
- Real-time order status updates
- WhatsApp/SMS integration
- Admin dashboard for suppliers
- Push notifications

## 🎨 Design System - Minimal Olive Glass

### Color Palette
- **Background:** `#e5eadb` (soft olive white)
- **Primary:** `#718355` (organic olive green)
- **Glass Effect:** `backdrop-filter: blur(10px)` with `rgba(113, 131, 85, 0.1)`

### Typography
- **English:** Inter font family
- **Tamil:** Noto Sans Tamil
- Responsive font scaling

### Components
- Glassmorphism cards with subtle borders
- Micro-interactions and animations
- Glowing shadows and hover effects

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, TailwindCSS 4 |
| **Real-time** | Socket.IO (vendor ↔ supplier chat, live stock) |
| **Backend** | Express.js, Node.js |
| **Database** | Supabase (PostgreSQL, Auth, Geo queries) |
| **Authentication** | Supabase OTP (Phone number based) |
| **Payments** | UPI integration (Razorpay/PhonePe SDK) |
| **Internationalization** | react-i18next (Tamil-first) |
| **Alerts** | Twilio/WhatsApp API |
| **State Management** | React Context + useReducer |
| **Routing** | React Router DOM 7 |
| **Animations** | Framer Motion |
| **Build Tool** | Vite |

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- (Optional) Socket.IO server

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nattumarket.git
   cd nattumarket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SOCKET_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
nattumarket/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Navigation, etc.)
│   │   └── ui/             # Basic UI components
│   ├── pages/              # Page components
│   │   └── auth/           # Authentication pages
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # External service configurations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── i18n/               # Internationalization files
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🌐 Internationalization (i18n)

NaattuMarket is **Tamil-first** with English support:

- Primary language: Tamil (`ta`)
- Secondary language: English (`en`)
- Auto language detection
- Persistent language preference
- Context-aware translations

### Adding Translations

Edit `src/i18n/index.ts`:

```typescript
// Add new keys to both languages
en: {
  translation: {
    newKey: 'English text'
  }
},
ta: {
  translation: {
    newKey: 'தமிழ் உரை'
  }
}
```

## 🔌 API Integration

### Supabase Setup

1. Create a new Supabase project
2. Set up the database schema (see `docs/database-schema.sql`)
3. Configure Row Level Security (RLS)
4. Enable real-time subscriptions

### Socket.IO Server

The app expects a Socket.IO server for real-time features. Refer to the backend repository for setup instructions.

## 📱 Mobile-First Design

- Responsive design with mobile-first approach
- Touch-friendly interactions
- Optimized for low-end devices
- Progressive Web App (PWA) ready

## 🔒 Security Features

- Row Level Security (RLS) with Supabase
- Phone number OTP authentication
- Input validation and sanitization
- Rate limiting for API calls
- Secure environment variable handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error boundaries
- Add comprehensive TypeScript types
- Write accessible markup (ARIA labels)
- Optimize for performance (lazy loading, code splitting)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tamil language support inspired by local street food culture
- Olive glass design inspired by South Indian aesthetics
- Real-time features inspired by modern marketplace needs

## 📞 Support

For support and questions:
- Email: support@nattumarket.com
- WhatsApp: +91 XXXXX XXXXX
- GitHub Issues: [Create an issue](https://github.com/yourusername/nattumarket/issues)

---

**Built with ❤️ for Tamil Nadu's street food vendors**

*நாட்டு சப்ளை. நேரடி நேரம்* 🇮🇳

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
