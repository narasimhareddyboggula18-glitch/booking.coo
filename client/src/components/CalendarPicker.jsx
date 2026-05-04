import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval,
         isSameDay, isBefore, isToday, getDay, addMonths, subMonths } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPicker = ({ selectedDate, onChange, blockedDates = [], events = [] }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const [direction, setDirection] = useState(1);

  const days = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end   = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  const firstDayOfWeek = getDay(startOfMonth(viewDate));
  const today = new Date();

  const isBlocked = (day) => blockedDates.some(d => isSameDay(new Date(d), day));
  const isEventDay = (day) => events.some(ev =>
    day >= new Date(ev.startDate) && day <= new Date(ev.endDate)
  );
  const isSunday = (day) => getDay(day) === 0;
  const isPast = (day) => isBefore(day, new Date(today.getFullYear(), today.getMonth(), today.getDate()));

  const handlePrev = () => {
    setDirection(-1);
    setViewDate(v => subMonths(v, 1));
  };
  const handleNext = () => {
    setDirection(1);
    setViewDate(v => addMonths(v, 1));
  };

  const handleDayClick = (day) => {
    if (isPast(day) || isSunday(day) || isBlocked(day)) return;
    onChange(day);
  };

  const getDayClass = (day) => {
    if (isPast(day) || isSunday(day)) return 'calendar-day disabled';
    if (isBlocked(day)) return 'calendar-day disabled';
    if (isEventDay(day)) return 'calendar-day event-blocked';
    if (selectedDate && isSameDay(day, selectedDate)) return 'calendar-day selected';
    return 'calendar-day available';
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '24px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center',
          }}
          aria-label="Previous month"
        >
          <FiChevronLeft size={18} />
        </motion.button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.h3
            key={format(viewDate, 'MMMM-yyyy')}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: 'Outfit,sans-serif', fontWeight: 700,
              fontSize: '1.1rem', color: 'white',
            }}
          >
            {format(viewDate, 'MMMM yyyy')}
          </motion.h3>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center',
          }}
          aria-label="Next month"
        >
          <FiChevronRight size={18} />
        </motion.button>
      </div>

      {/* Day names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: '0.72rem', color: '#555',
            fontWeight: 600, letterSpacing: '0.5px', padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={format(viewDate, 'MMMM-yyyy')}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}
        >
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => (
            <motion.button
              key={day.toISOString()}
              whileHover={!isPast(day) && !isSunday(day) && !isBlocked(day) ? { scale: 1.1 } : {}}
              whileTap={!isPast(day) && !isSunday(day) && !isBlocked(day) ? { scale: 0.95 } : {}}
              className={`${getDayClass(day)} ${isToday(day) ? 'today' : ''}`}
              onClick={() => handleDayClick(day)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0 auto' }}
              aria-label={format(day, 'PPPP')}
              aria-selected={selectedDate && isSameDay(day, selectedDate)}
              aria-disabled={isPast(day) || isSunday(day)}
            >
              {format(day, 'd')}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
        {[
          { color: '#00b894', label: 'Available' },
          { color: '#e94560', label: 'Selected' },
          { color: '#fdcb6e', label: 'Event day' },
          { color: '#333', label: 'Blocked' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '0.72rem', color: '#666' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPicker;
