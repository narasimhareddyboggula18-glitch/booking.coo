import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import SportCard from '../components/SportCard';
import { useBooking } from '../context/BookingContext';
import { FiSearch } from 'react-icons/fi';

const CategoryToggle = ({ active, onChange }) => (
  <div style={{
    display: 'inline-flex', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
    padding: '6px', gap: '4px', position: 'relative',
  }}>
    {['outdoor', 'indoor'].map(cat => (
      <motion.button
        key={cat}
        onClick={() => onChange(cat)}
        style={{
          padding: '10px 24px', borderRadius: '12px', border: 'none',
          cursor: 'pointer', position: 'relative', zIndex: 1,
          fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: '0.9rem',
          color: active === cat ? 'white' : '#666',
          background: 'none', transition: 'color 0.3s',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {cat === 'outdoor' ? '🌿 Outdoor' : '🏠 Indoor'}
        {active === cat && (
          <motion.div
            layoutId="category-pill"
            style={{
              position: 'absolute', inset: 0, borderRadius: '12px',
              background: 'linear-gradient(135deg, #e94560, #0f3460)',
              zIndex: -1,
            }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
          />
        )}
      </motion.button>
    ))}
  </div>
);

const Sports = () => {
  const { sports, fetchSports } = useBooking();
  const [category, setCategory] = useState('outdoor');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports().finally(() => setLoading(false));
  }, [fetchSports]);

  const filtered = sports.filter(s =>
    s.category === category &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', paddingTop: '100px', maxWidth: '1280px', margin: '0 auto', padding: '100px 24px 60px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: '#e94560', fontWeight: 600, letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '12px' }}>
            ALL SPORTS
          </motion.p>
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', marginBottom: '24px' }}
          >
            Choose Your <span className="gradient-text">Sport</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}
            style={{ color: '#666', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Select a sport, pick a date and time, and your court is reserved instantly.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ position: 'relative', maxWidth: '320px', margin: '0 auto 32px' }}
          >
            <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            <input
              className="input-field"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search sports..."
              style={{ paddingLeft: '40px' }}
              aria-label="Search sports"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }}>
            <CategoryToggle active={category} onChange={setCategory} />
          </motion.div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                height: '280px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                animation: 'pulse-ring 1.5s ease infinite',
              }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}
            >
              {filtered.length > 0 ? filtered.map((sport, i) => (
                <SportCard key={sport._id} sport={sport} index={i} />
              )) : (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0', color: '#444' }}
                >
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                  <p>No sports found for "{search}"</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Sports;
