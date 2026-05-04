import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import { FiUsers, FiCalendar, FiGrid, FiActivity, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const API = '/api';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div className="stat-card" whileHover={{ scale: 1.02 }}
    style={{ borderColor: color + '22' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '8px' }}>{label}</p>
        <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '2rem', color: 'white' }}>{value}</p>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: '12px', background: color + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: '20px' }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ eventName: '', sportId: '', startDate: '', endDate: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [s, b, sp, ev] = await Promise.all([
        axios.get(`${API}/admin/dashboard`),
        axios.get(`${API}/admin/bookings`),
        axios.get(`${API}/sports`),
        axios.get(`${API}/events`),
      ]);
      setStats(s.data);
      setBookings(b.data.bookings || []);
      setSports(sp.data.sports || []);
      setEvents(ev.data.events || []);
    } catch { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createEvent = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${API}/events`, eventForm);
      toast.success('Event created!');
      setShowEventModal(false);
      setEventForm({ eventName: '', sportId: '', startDate: '', endDate: '', description: '' });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API}/events/${id}`);
      toast.success('Event deleted');
      setEvents(ev => ev.filter(e => e._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const TABS = [
    { key: 'dashboard', label: 'Dashboard', icon: <FiActivity /> },
    { key: 'bookings', label: 'Bookings', icon: <FiCalendar /> },
    { key: 'events', label: 'Events', icon: <FiGrid /> },
  ];

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', padding: '100px 24px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ color: '#e94560', fontWeight: 600, letterSpacing: '2px', fontSize: '0.8rem' }}>ADMIN PANEL</span>
          <h1 className="section-title" style={{ fontSize: '2.2rem', color: 'white', marginTop: '4px' }}>Sports <span className="gradient-text">Dashboard</span></h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '6px', marginBottom: '32px', width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, background: tab === t.key ? 'linear-gradient(135deg,#e94560,#c0392b)' : 'transparent', color: tab === t.key ? 'white' : '#555', transition: 'all 0.2s' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px' }} className="animate-bounce-ball">⚽</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
                  <StatCard icon={<FiCalendar />} label="Total Bookings" value={stats?.totalBookings || 0} color="#e94560" />
                  <StatCard icon={<FiActivity />} label="Today's Bookings" value={stats?.todayBookings || 0} color="#00b894" />
                  <StatCard icon={<FiUsers />} label="Total Students" value={stats?.totalUsers || 0} color="#74b9ff" />
                  <StatCard icon={<FiGrid />} label="Active Sports" value={stats?.activeSports || 0} color="#fdcb6e" />
                </div>

                {/* Recent bookings mini-table */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Recent Bookings</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr>{['Student','Sport','Date','Time','Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', color: '#444', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 8).map(b => (
                          <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '10px 12px', color: '#a0a0a0' }}>{b.userId?.name || '—'}</td>
                            <td style={{ padding: '10px 12px', color: 'white', fontWeight: 600 }}>{b.sportId?.name || '—'}</td>
                            <td style={{ padding: '10px 12px', color: '#a0a0a0', whiteSpace: 'nowrap' }}>{format(new Date(b.date), 'MMM d, yyyy')}</td>
                            <td style={{ padding: '10px 12px', color: '#a0a0a0', whiteSpace: 'nowrap' }}>{b.timeSlot?.start} – {b.timeSlot?.end}</td>
                            <td style={{ padding: '10px 12px' }}><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'bookings' && (
              <motion.div key="bk" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
                  <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: 'white', marginBottom: '16px' }}>All Bookings ({bookings.length})</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr>{['Student','Email','Sport','Date','Time','Court','Status'].map(h => (
                        <th key={h} style={{ textAlign: 'left', color: '#444', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 12px', color: '#a0a0a0' }}>{b.userId?.name || '—'}</td>
                          <td style={{ padding: '10px 12px', color: '#666', fontSize: '0.75rem' }}>{b.userId?.email || '—'}</td>
                          <td style={{ padding: '10px 12px', color: 'white', fontWeight: 600 }}>{b.sportId?.name || '—'}</td>
                          <td style={{ padding: '10px 12px', color: '#a0a0a0', whiteSpace: 'nowrap' }}>{format(new Date(b.date), 'MMM d, yyyy')}</td>
                          <td style={{ padding: '10px 12px', color: '#a0a0a0', whiteSpace: 'nowrap' }}>{b.timeSlot?.start}–{b.timeSlot?.end}</td>
                          <td style={{ padding: '10px 12px', color: '#a0a0a0' }}>{b.courtNumber}</td>
                          <td style={{ padding: '10px 12px' }}><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {tab === 'events' && (
              <motion.div key="ev" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: 'white' }}>Sports Events ({events.length})</h3>
                  <motion.button whileHover={{ scale: 1.03 }} onClick={() => setShowEventModal(true)}
                    className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiPlus /> Add Event
                  </motion.button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {events.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#444' }}>No events. Create one to block slots.</div>
                  ) : events.map(ev => (
                    <div key={ev._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '4px' }}>🏆 {ev.eventName}</h4>
                        <p style={{ color: '#555', fontSize: '0.78rem' }}>
                          {ev.sportId?.name} · {format(new Date(ev.startDate), 'MMM d')} – {format(new Date(ev.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => deleteEvent(ev._id)}
                        style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.25)', borderRadius: '10px', padding: '8px 14px', color: '#e94560', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        <FiTrash2 size={12} /> Delete
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>Create Sports Event</h3>
                <button onClick={() => setShowEventModal(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><FiX /></button>
              </div>

              {[
                { field: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g. Inter-College Cricket Cup' },
                { field: 'startDate', label: 'Start Date', type: 'date', placeholder: '' },
                { field: 'endDate', label: 'End Date', type: 'date', placeholder: '' },
                { field: 'description', label: 'Description', type: 'text', placeholder: 'Optional description' },
              ].map(f => (
                <div key={f.field} style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '6px' }}>{f.label}</label>
                  <input className="input-field" type={f.type} placeholder={f.placeholder}
                    value={eventForm[f.field]} onChange={e => setEventForm(ef => ({ ...ef, [f.field]: e.target.value }))} />
                </div>
              ))}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '6px' }}>Sport Affected</label>
                <select className="input-field" value={eventForm.sportId} onChange={e => setEventForm(ef => ({ ...ef, sportId: e.target.value }))}
                  style={{ cursor: 'pointer' }}>
                  <option value="">Select a sport</option>
                  {sports.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowEventModal(false)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={createEvent} className="btn-primary"
                  disabled={submitting || !eventForm.eventName || !eventForm.sportId}
                  style={{ flex: 1, padding: '12px', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Creating…' : 'Create Event'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default Admin;
