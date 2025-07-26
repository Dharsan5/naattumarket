import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { Suppliers } from './pages/Suppliers';
import { NaattuKits } from './pages/NaattuKits';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import './styles/glass.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-olive-50 font-inter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/kits" element={<NaattuKits />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        
        <BottomNav />
        
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(113, 131, 85, 0.9)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(113, 131, 85, 0.3)',
              borderRadius: '12px',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;