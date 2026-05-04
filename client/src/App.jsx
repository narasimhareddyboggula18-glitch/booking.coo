import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { AuthGuard, GuestGuard } from './components/AuthGuard';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Sports from './pages/Sports';
import Booking from './pages/Booking';
import History from './pages/History';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
        <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/booking/:sportId" element={<AuthGuard><Booking /></AuthGuard>} />
        <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/admin" element={<AuthGuard requireAdmin><Admin /></AuthGuard>} />
        {/* 404 */}
        <Route path="*" element={
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',gap:'16px' }}>
            <div style={{ fontSize:'72px' }}>🏟️</div>
            <h1 style={{ fontFamily:'Outfit,sans-serif',color:'white',fontSize:'2rem' }}>404 — Page Not Found</h1>
            <a href="/" style={{ color:'#e94560',textDecoration:'none',fontWeight:600 }}>← Back to Home</a>
          </div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
          {!loading && (
            <>
              <Navbar />
              <AnimatedRoutes />
            </>
          )}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'rgba(16,16,32,0.95)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#00b894', secondary: 'white' } },
              error:   { iconTheme: { primary: '#e94560', secondary: 'white' } },
            }}
          />
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
