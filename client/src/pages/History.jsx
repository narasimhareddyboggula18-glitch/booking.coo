import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { useBooking } from '../context/BookingContext';
import { FiCalendar, FiClock, FiMapPin, FiFilter, FiX, FiRefreshCw } from 'react-icons/fi';

const SPORT_EMOJIS = {
  Cricket:'🏏', Football:'⚽', Volleyball:'🏐', Kabaddi:'🤼', 'Kho-Kho':'🏃',
  'Throw Ball':'🏐', Basketball:'🏀', 'Table Tennis':'🏓', Gym:'💪', Carrom:'🎯', Chess:'♟️',
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    {status === 'upcoming' ? '⏳ Upcoming' : status === 'completed' ? '✅ Completed' : '❌ Cancelled'}
  </span>
);

const BookingCard = ({ booking, onCancel, index }) => {
  const sportName = booking.sportId?.name || 'Sport';
  const emoji = SPORT_EMOJIS[sportName] || '🏅';
  const isUpcoming = booking.status === 'upcoming';
  const bookingDate = new Date(booking.date);
  const isPastDate = isPast(bookingDate);

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
      transition={{ delay: index * 0.06 }}
      style={{ padding: '20px', marginBottom: '12px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
          {emoji}
        </div>

        <div style={{ flex: 1, minWidth: '160px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'white' }}>{sportName}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { icon: <FiCalendar size={12} />, text: format(bookingDate, 'EEE, MMM d yyyy') },
              { icon: <FiClock size={12} />, text: `${booking.timeSlot?.start} – ${booking.timeSlot?.end}` },
              { icon: <FiMapPin size={12} />, text: `Court ${booking.courtNumber}` },
            ].map(item => (
              <span key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.78rem' }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>

        {isUpcoming && !isPastDate && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onCancel(booking._id)}
            style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.25)', borderRadius: '10px', padding: '8px 14px', color: '#e94560', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            aria-label={`Cancel booking for ${sportName}`}
          >
            <FiX size={12} /> Cancel
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const History = () => {
  const { fetchMyBookings, cancelBooking } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, [fetchMyBookings]);

  useEffect(() => { load(); }, [load]);

  const filtered = bookings.filter(b => filter === 'all' ? true : b.status === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      await cancelBooking(cancelModal);
      toast.success('Booking cancelled');
      setBookings(bs => bs.map(b => b._id === cancelModal ? { ...b, status: 'cancelled' } : b));
      setCancelModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    } finally {
      setCancelling(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: '⏳ Upcoming' },
    { key: 'completed', label: '✅ Completed' },
    { key: 'cancelled', label: '❌ Cancelled' },
  ];

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', padding: '100px 24px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="section-title" style={{ fontSize: '2rem', color: 'white', marginBottom: '4px' }}>My <span className="gradient-text">Bookings</span></h1>
            <p style={{ color: '#555', fontSize: '0.875rem' }}>{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
          <motion.button whileHover={{ rotate: 180 }} onClick={load}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#666' }}
            aria-label="Refresh bookings">
            <FiRefreshCw size={18} />
          </motion.button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <motion.button key={tab.key} whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 16px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 500,
                background: filter === tab.key ? 'linear-gradient(135deg,#e94560,#c0392b)' : 'transparent',
                borderColor: filter === tab.key ? 'transparent' : 'rgba(255,255,255,0.1)',
                color: filter === tab.key ? 'white' : '#666',
                transition: 'all 0.2s',
              }}>{tab.label}</motion.button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px' }} className="animate-bounce-ball">⚽</div>
            <p style={{ color: '#444', marginTop: '16px' }}>Loading bookings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ color: 'white', fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '8px' }}>No bookings yet</h3>
            <p style={{ color: '#444', fontSize: '0.875rem' }}>Head to Sports to book your first court!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filtered.map((b, i) => (
              <BookingCard key={b._id} booking={b} index={i} onCancel={id => setCancelModal(id)} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Cancel modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Cancel Booking?</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '28px' }}>This action cannot be undone. The slot will be freed for others.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setCancelModal(null)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>Keep It</button>
                <button onClick={handleCancel} className="btn-primary" disabled={cancelling} style={{ flex: 1, padding: '12px', opacity: cancelling ? 0.7 : 1 }}>
                  {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default History;
