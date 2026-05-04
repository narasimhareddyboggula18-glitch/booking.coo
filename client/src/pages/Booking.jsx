import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import CalendarPicker from '../components/CalendarPicker';
import TimeSlotGrid from '../components/TimeSlotGrid';
import { useBooking } from '../context/BookingContext';
import { FiCheck, FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

const STEPS = ['Sport', 'Date', 'Time', 'Confirm'];

const StepIndicator = ({ current }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' }}>
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <motion.div
            className={`step-indicator ${i < current ? 'completed' : i === current ? 'active' : ''}`}
            animate={{ scale: i === current ? 1.15 : 1 }}
          >
            {i < current ? <FiCheck size={14} /> : i + 1}
          </motion.div>
          <span style={{ fontSize: '0.68rem', color: i === current ? 'white' : '#444', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div style={{ flex: 1, height: '1px', maxWidth: '80px', margin: '0 8px 20px', background: i < current ? '#00b894' : 'rgba(255,255,255,0.1)', transition: 'background 0.5s' }} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const slide = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

const Booking = () => {
  const { sportId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchSports, fetchAvailableSlots, createBooking, fetchEvents } = useBooking();

  const [step, setStep] = useState(1);
  const [sport, setSport] = useState(location.state?.sport || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotData, setSlotData] = useState({ bookedSlots: [], blockedByEvent: false, eventName: null });
  const [events, setEvents] = useState([]);
  const [sloading, setSloading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sport) {
      fetchSports().then(sports => {
        const found = sports.find(s => s._id === sportId);
        if (found) setSport(found);
        else navigate('/sports');
      });
    }
    fetchEvents().then(setEvents);
  }, [sportId]);

  useEffect(() => {
    if (selectedDate && sport) {
      setSloading(true);
      setSelectedSlot(null);
      fetchAvailableSlots(sport._id, format(selectedDate, 'yyyy-MM-dd'))
        .then(data => setSlotData(data))
        .finally(() => setSloading(false));
    }
  }, [selectedDate, sport]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot || !sport) return;
    setSubmitting(true);
    try {
      const data = await createBooking({
        sportId: sport._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: { start: selectedSlot.start, end: selectedSlot.end },
      });
      setBooking(data.booking);
      setStep(4);
      setTimeout(() => confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#e94560','#00b894','#74b9ff'] }), 300);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!sport) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh' }}><div style={{ fontSize:'48px' }} className="animate-bounce-ball">⚽</div></div>;

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', padding: '100px 24px 60px', maxWidth: '720px', margin: '0 auto' }}>
        <motion.button whileHover={{ x: -4 }} onClick={() => navigate('/sports')}
          style={{ display:'flex',alignItems:'center',gap:'8px',background:'none',border:'none',color:'#666',cursor:'pointer',marginBottom:'32px',fontSize:'0.875rem' }}>
          <FiArrowLeft /> Back to Sports
        </motion.button>

        <h1 className="section-title" style={{ fontSize:'2rem',color:'white',marginBottom:'8px' }}>
          Book <span className="gradient-text">{sport.name}</span>
        </h1>
        <p style={{ color:'#555',marginBottom:'40px',fontSize:'0.875rem' }}>
          {sport.category === 'outdoor' ? '🌿 Outdoor' : '🏠 Indoor'} · Presidency University
        </p>

        <StepIndicator current={step === 4 ? 3 : step - 1} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <div className="glass-card" style={{ padding:'32px',textAlign:'center',marginBottom:'24px' }}>
                <div style={{ fontSize:'64px',marginBottom:'16px' }}>{sport.category === 'outdoor' ? '🌿' : '🏠'}</div>
                <h2 style={{ fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:'1.5rem',color:'white',marginBottom:'8px' }}>{sport.name}</h2>
                <p style={{ color:'#666',fontSize:'0.875rem',marginBottom:'24px' }}>{sport.description}</p>
                <div style={{ display:'inline-flex',gap:'24px',background:'rgba(255,255,255,0.04)',borderRadius:'12px',padding:'16px 24px' }}>
                  {[{ v: sport.courtCount || 1, l:'Courts' }, { v:'Free', l:'Cost', c:'#00b894' }, { v:'1hr', l:'Per Slot' }].map(x => (
                    <div key={x.l} style={{ textAlign:'center' }}>
                      <div style={{ fontSize:'1.25rem',fontWeight:700,color: x.c || 'white' }}>{x.v}</div>
                      <div style={{ fontSize:'0.72rem',color:'#555' }}>{x.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                className="btn-primary" onClick={() => setStep(2)}
                style={{ width:'100%',padding:'16px',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}>
                Select Date <FiArrowRight />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 style={{ color:'white',fontFamily:'Outfit,sans-serif',fontWeight:700,marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px' }}>
                <FiCalendar style={{ color:'#e94560' }} /> Pick a Date
              </h2>
              <CalendarPicker selectedDate={selectedDate} onChange={setSelectedDate}
                events={events.filter(e => (e.sportId?._id || e.sportId) === sport._id)} />
              <div style={{ display:'flex',gap:'12px',marginTop:'20px' }}>
                <motion.button onClick={() => setStep(1)} className="btn-secondary" style={{ flex:1,padding:'14px' }}>← Back</motion.button>
                <motion.button whileHover={{ scale: selectedDate ? 1.02 : 1 }} className="btn-primary"
                  onClick={() => selectedDate && setStep(3)} disabled={!selectedDate}
                  style={{ flex:2,padding:'14px',opacity: selectedDate ? 1 : 0.4,cursor: selectedDate ? 'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}>
                  {selectedDate ? `Continue · ${format(selectedDate,'MMM d')}` : 'Select a date'} <FiArrowRight />
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <h2 style={{ color:'white',fontFamily:'Outfit,sans-serif',fontWeight:700,marginBottom:'6px',display:'flex',alignItems:'center',gap:'8px' }}>
                <FiClock style={{ color:'#e94560' }} /> Select Time Slot
              </h2>
              <p style={{ color:'#555',fontSize:'0.8rem',marginBottom:'20px' }}>{selectedDate && format(selectedDate,'EEEE, MMMM d, yyyy')}</p>
              {sloading
                ? <div style={{ textAlign:'center',padding:'40px',color:'#555' }}><div style={{ fontSize:'36px' }} className="animate-bounce-ball">⏳</div><p style={{ marginTop:'12px',fontSize:'0.875rem' }}>Checking availability…</p></div>
                : <TimeSlotGrid bookedSlots={slotData.bookedSlots || []} blockedByEvent={slotData.blockedByEvent} eventName={slotData.eventName} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
              }
              <div style={{ display:'flex',gap:'12px',marginTop:'24px' }}>
                <motion.button onClick={() => setStep(2)} className="btn-secondary" style={{ flex:1,padding:'14px' }}>← Back</motion.button>
                <motion.button whileHover={{ scale: selectedSlot ? 1.02 : 1 }} className="btn-primary"
                  onClick={handleConfirm} disabled={!selectedSlot || submitting}
                  style={{ flex:2,padding:'14px',opacity: selectedSlot ? 1 : 0.4,cursor: selectedSlot ? 'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}>
                  {submitting ? 'Booking…' : 'Confirm Booking'} {!submitting && <FiCheck />}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} transition={{ type:'spring',stiffness:200 }}>
              <div className="glass-card" style={{ padding:'40px',textAlign:'center' }}>
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring',stiffness:300,delay:0.2 }}
                  style={{ width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#00b894,#00a381)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',boxShadow:'0 0 40px rgba(0,184,148,0.4)' }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <motion.path d="M8 18 L15 25 L28 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.5,delay:0.4 }} />
                  </svg>
                </motion.div>
                <motion.h2 initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }}
                  style={{ fontFamily:'Outfit,sans-serif',fontWeight:800,fontSize:'1.8rem',color:'white',marginBottom:'8px' }}>
                  Booking Confirmed! 🎉
                </motion.h2>
                <p style={{ color:'#666',marginBottom:'32px' }}>Your court is reserved. See you there!</p>
                <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.7 }}
                  style={{ background:'rgba(255,255,255,0.04)',borderRadius:'16px',padding:'24px',marginBottom:'28px',textAlign:'left' }}>
                  {[
                    { icon:<FiMapPin />, label:'Sport', value: sport.name },
                    { icon:<FiCalendar />, label:'Date', value: selectedDate ? format(selectedDate,'EEEE, MMMM d, yyyy') : '' },
                    { icon:<FiClock />, label:'Time', value: selectedSlot ? `${selectedSlot.start} – ${selectedSlot.end}` : '' },
                    { icon:<FiMapPin />, label:'Court', value: `Court ${booking?.courtNumber || 1}` },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color:'#e94560',fontSize:'14px' }}>{row.icon}</span>
                      <span style={{ color:'#555',fontSize:'0.8rem',minWidth:'56px' }}>{row.label}</span>
                      <span style={{ color:'white',fontSize:'0.9rem',fontWeight:500 }}>{row.value}</span>
                    </div>
                  ))}
                </motion.div>
                <div style={{ display:'flex',gap:'12px',flexWrap:'wrap' }}>
                  <motion.button whileHover={{ scale:1.03 }} onClick={() => navigate('/history')}
                    className="btn-primary" style={{ flex:1,padding:'14px',minWidth:'140px' }}>View My Bookings</motion.button>
                  <motion.button whileHover={{ scale:1.03 }} onClick={() => navigate('/sports')}
                    className="btn-secondary" style={{ flex:1,padding:'14px',minWidth:'140px' }}>Book Another</motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
};

export default Booking;
