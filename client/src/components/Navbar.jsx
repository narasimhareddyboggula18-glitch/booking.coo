import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiCalendar,
  FiHome, FiGrid, FiShield
} from 'react-icons/fi';

const useWindowWidth = () => {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
};

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <FiHome /> },
    { to: '/sports', label: 'Sports', icon: <FiGrid /> },
    ...(isAuthenticated ? [{ to: '/history', label: 'My Bookings', icon: <FiCalendar /> }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: <FiShield /> }] : []),
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          transition: 'all 0.3s ease',
          background: scrolled
            ? 'rgba(10,10,10,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
          padding: scrolled ? '12px 0' : '20px 0',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, #e94560, #0f3460)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              🏆
            </motion.div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.5px' }}>
              Sport<span style={{ color: '#e94560' }}>Sync</span>
            </span>
          </Link>

          {/* Desktop Links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px', padding: '8px 14px', cursor: 'pointer', color: 'white',
                  }}
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e94560, #0f3460)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute', top: '110%', right: 0, minWidth: '180px',
                        background: 'rgba(16,16,32,0.95)', backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
                        overflow: 'hidden', zIndex: 999,
                      }}
                    >
                      <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#a0a0a0', textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <FiUser /> Profile
                      </Link>
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: '#e94560', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.875rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(233,69,96,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Hamburger */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', display: 'flex', padding: '4px' }}
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <FiX /> : <FiMenu />}
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(10,10,20,0.97)', backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column', padding: '80px 24px 40px',
              gap: '8px',
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={link.to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '16px 20px', borderRadius: '14px', fontSize: '1.1rem',
                    fontWeight: 600, color: location.pathname === link.to ? '#e94560' : '#a0a0a0',
                    textDecoration: 'none',
                    background: location.pathname === link.to ? 'rgba(233,69,96,0.1)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {link.icon} {link.label}
                </Link>
              </motion.div>
            ))}
            {!isAuthenticated && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <Link to="/login" style={{ flex: 1 }}>
                  <button className="btn-secondary" style={{ width: '100%' }}>Login</button>
                </Link>
                <Link to="/register" style={{ flex: 1 }}>
                  <button className="btn-primary" style={{ width: '100%' }}>Sign Up</button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
