<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# NaattuMarket - Native Supply Real Time Marketplace

This is a React TypeScript application for a real-time marketplace connecting street food vendors with local suppliers.

## Key Features & Architecture
- **Real-time Chat**: Socket.IO for vendor-supplier communication
- **Live Updates**: Real-time inventory and order status updates
- **Local Discovery**: Location-based supplier matching with Supabase geo queries
- **Naattu Kits**: Curated supply packages (Tiffin Kit, Tea Stall Kit, Chaat Kit)
- **i18n Support**: Tamil-first with react-i18next
- **Olive Glass Theme**: Minimal glassmorphism design with #e5eadb background and #718355 accents

## Tech Stack
- Frontend: React 19 + TypeScript + TailwindCSS 4
- Real-time: Socket.IO client
- Backend Integration: Supabase (PostgreSQL, Auth, Geo)
- Routing: React Router DOM 7
- Animations: Framer Motion
- Icons: Lucide React
- UI Components: Headless UI

## Design System
- Primary Background: #e5eadb (soft olive white)
- Accent Color: #718355 (organic olive green)
- Glass Effect: backdrop-filter: blur(10px), background: rgba(113, 131, 85, 0.1)
- Typography: Inter for English, Noto Sans Tamil for Tamil text
- Components: Glassmorphism with subtle borders and micro-interactions

## Development Guidelines
- Use TypeScript for all components
- Implement responsive design (mobile-first)
- Add proper loading states and error handling
- Include accessibility features (ARIA labels, keyboard navigation)
- Use semantic HTML structure
- Implement proper error boundaries
- Add comprehensive TypeScript interfaces
- Follow React 19 best practices with modern hooks
