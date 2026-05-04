import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const SPORT_IMAGES = {
  Cricket:      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
  Football:     'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
  Volleyball:   'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80',
  Kabaddi:      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
  'Kho-Kho':    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  'Throw Ball': 'https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=600&q=80',
  Basketball:   'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
  'Table Tennis':'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=600&q=80',
  Gym:          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  Carrom:       'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=600&q=80',
  Chess:        'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80',
};

const SportCard = ({ sport, index }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/booking/${sport._id}`, { state: { sport } });
  };

  const imageUrl = SPORT_IMAGES[sport.name] || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80';

  return (
    <motion.div
      className="sport-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{
        y: -8, scale: 1.02,
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(233,69,96,0.15)',
      }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: 'pointer' }}
      onClick={handleBook}
      role="button"
      aria-label={`Book ${sport.name}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleBook()}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
        <motion.img
          src={imageUrl}
          alt={`${sport.name} court`}
          className="card-image"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,20,0.85) 0%, transparent 60%)',
        }} />
        {/* Category badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className={`badge badge-${sport.category}`}>
            {sport.category === 'outdoor' ? '🌿 Outdoor' : '🏠 Indoor'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem',
          color: 'white', marginBottom: '6px',
        }}>
          {sport.name}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#606060', marginBottom: '14px', lineHeight: 1.4 }}>
          {sport.description || `${sport.courtCount || 1} court${sport.courtCount > 1 ? 's' : ''} available`}
        </p>

        <motion.button
          whileHover={{ x: 4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', color: '#e94560',
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            padding: 0, fontFamily: 'Outfit, sans-serif',
          }}
          onClick={e => { e.stopPropagation(); handleBook(); }}
        >
          Book Now <FiArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SportCard;
