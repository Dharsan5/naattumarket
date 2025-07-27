import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './providers/SocketProvider';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SuppliersPage from './pages/SuppliersPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
// Import CSS
import './styles/main.css';

// AppContent component to use hooks
const AppContent = () => {
  const location = useLocation();
  // Show navigation on all pages
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Suspense fallback={<div className="loading-container">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
          </Routes>
        </Suspense>
      </main>
      
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--glass-metal-medium)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-metal-md)',
          },
        }}
      />
    </div>
  );
};

// Import ErrorBoundary
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;