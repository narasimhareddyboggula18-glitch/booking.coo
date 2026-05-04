import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit2, FiCheck } from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await axios.patch('/api/auth/profile', { name });
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', padding: '100px 24px 60px', maxWidth: '600px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title" style={{ fontSize: '2rem', color: 'white', marginBottom: '32px' }}>
            My <span className="gradient-text">Profile</span>
          </h1>

          <div className="glass-card" style={{ padding: '32px', marginBottom: '20px' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'white', marginBottom: '4px' }}>{user.name}</h2>
                <span className={`badge ${user.role === 'admin' ? 'badge-upcoming' : 'badge-completed'}`}>
                  {user.role === 'admin' ? '⚙️ Admin' : '🎓 Student'}
                </span>
              </div>
            </div>

            {/* Info rows */}
            {[
              { icon: <FiUser />, label: 'Name', value: user.name, editable: true },
              { icon: <FiMail />, label: 'Email', value: user.email },
              { icon: <FiShield />, label: 'Status', value: user.isVerified ? '✅ Verified' : '❌ Not Verified' },
              { icon: <FiCalendar />, label: 'Member Since', value: format(new Date(user.createdAt || Date.now()), 'MMMM yyyy') },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#e94560', minWidth: '20px' }}>{row.icon}</span>
                <span style={{ color: '#555', fontSize: '0.8rem', minWidth: '100px' }}>{row.label}</span>
                {row.editable && editing ? (
                  <input className="input-field" value={name} onChange={e => setName(e.target.value)}
                    style={{ flex: 1, padding: '6px 12px', fontSize: '0.9rem' }} autoFocus />
                ) : (
                  <span style={{ color: 'white', fontSize: '0.9rem', flex: 1 }}>{row.value}</span>
                )}
                {row.editable && (
                  <motion.button whileHover={{ scale: 1.1 }}
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    style={{ background: 'none', border: 'none', color: editing ? '#00b894' : '#555', cursor: 'pointer' }}>
                    {editing ? <FiCheck /> : <FiEdit2 size={14} />}
                  </motion.button>
                )}
              </div>
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={logout}
            style={{ width: '100%', padding: '14px', background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: '12px', color: '#e94560', cursor: 'pointer', fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Profile;
