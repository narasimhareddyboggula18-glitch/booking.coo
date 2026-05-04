import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiLock, FiAlertCircle } from 'react-icons/fi';

const SLOTS = [
  { start: '09:30', end: '10:30', label: '09:30 AM – 10:30 AM' },
  { start: '10:30', end: '11:30', label: '10:30 AM – 11:30 AM' },
  { start: '11:30', end: '12:30', label: '11:30 AM – 12:30 PM' },
  { start: '12:30', end: '13:30', label: '12:30 PM – 01:30 PM' },
  { start: '13:30', end: '14:30', label: '01:30 PM – 02:30 PM' },
  { start: '14:30', end: '15:30', label: '02:30 PM – 03:30 PM' },
  { start: '15:30', end: '16:30', label: '03:30 PM – 04:30 PM' },
  { start: '16:30', end: '17:00', label: '04:30 PM – 05:00 PM' },
];

const TimeSlotGrid = ({
  bookedSlots = [],
  blockedByEvent = false,
  eventName = null,
  selectedSlot,
  onSelect,
}) => {
  const isBooked = (slot) =>
    bookedSlots.some(b => b.start === slot.start && b.end === slot.end);

  const getSlotState = (slot) => {
    if (blockedByEvent) return 'event-blocked';
    if (isBooked(slot)) return 'booked';
    if (selectedSlot?.start === slot.start) return 'selected';
    return 'available';
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    show:   { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  return (
    <div>
      {/* Event banner */}
      {blockedByEvent && eventName && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(253,203,110,0.1)',
            border: '1px solid rgba(253,203,110,0.3)',
            borderRadius: '12px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
            color: '#fdcb6e', fontSize: '0.875rem', marginBottom: '16px',
          }}
        >
          <FiAlertCircle />
          🏆 <strong>{eventName}</strong> is in progress — all slots are blocked.
        </motion.div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '10px',
        }}
      >
        {SLOTS.map((slot) => {
          const state = getSlotState(slot);
          const isClickable = state === 'available';

          return (
            <motion.button
              key={slot.start}
              variants={item}
              className={`time-slot ${state}`}
              onClick={() => isClickable && onSelect(slot)}
              disabled={!isClickable}
              style={{
                cursor: isClickable ? 'pointer' : 'not-allowed',
                background: 'none', fontFamily: 'Inter,sans-serif',
              }}
              whileHover={isClickable ? { scale: 1.04 } : {}}
              whileTap={isClickable ? { scale: 0.96 } : {}}
              aria-label={`Time slot ${slot.label}`}
              aria-disabled={!isClickable}
              aria-pressed={state === 'selected'}
            >
              <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                {state === 'available' && <span style={{ display: 'inline-block', width: 6, height: 6, background: '#00b894', borderRadius: '50%', marginRight: 6 }} />}
                {state === 'selected' && <FiCheck size={12} style={{ marginRight: 4 }} />}
                {state === 'booked' && <FiLock size={12} style={{ marginRight: 4 }} />}
                {state === 'event-blocked' && <FiAlertCircle size={12} style={{ marginRight: 4 }} />}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{slot.label}</div>
              <div style={{ fontSize: '0.7rem', marginTop: '3px', opacity: 0.7 }}>
                {state === 'available' && 'Available'}
                {state === 'selected' && 'Selected ✓'}
                {state === 'booked' && 'Booked'}
                {state === 'event-blocked' && 'Event Blocked'}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TimeSlotGrid;
