import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';

const COLLEGE_REGEX = /^[a-zA-Z0-9._%+-]+@presidencyuniversity\.in$/;

const Register = () => {
  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('form'); // form | verify
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp, setOtp] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!COLLEGE_REGEX.test(form.email)) e.email = 'Only @presidencyuniversity.in emails allowed!';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setPhase('verify');
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (ev) => {
    ev.preventDefault();
    if (!otp) return;
    setLoading(true);
    try {
      await verifyEmail(form.email, otp);
      toast.success('Email verified! Welcome 🏆');
      navigate('/sports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ icon, label, name, type, placeholder, autoComplete }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '6px', fontWeight: 500 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }}>{icon}</span>
        <input
          type={name === 'password' || name === 'confirm' ? (showPwd ? 'text' : 'password') : type}
          className={`input-field ${errors[name] ? 'error' : ''}`}
          value={form[name]}
          onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }}
          placeholder={placeholder}
          style={{ paddingLeft: '40px', paddingRight: (name === 'password' || name === 'confirm') ? '44px' : '16px' }}
          aria-label={label} autoComplete={autoComplete}
        />
        {(name === 'password' || name === 'confirm') && (
          <button type="button" onClick={() => setShowPwd(v => !v)}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
            {showPwd ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {errors[name] && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#e94560', fontSize: '0.75rem', marginTop: '4px' }}>{errors[name]}</motion.p>}
      {name === 'email' && form.email && COLLEGE_REGEX.test(form.email) && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#00b894', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FiCheck size={12} /> Valid college email
        </motion.p>
      )}
    </div>
  );

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, rgba(15,52,96,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '460px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'white' }}>Sport<span style={{ color: '#e94560' }}>Sync</span></span>
            </Link>
            <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '4px' }}>Presidency University</p>
          </div>

          <div className="glass-card" style={{ padding: '36px' }}>
            <AnimatePresence mode="wait">
              {phase === 'form' ? (
                <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.6rem', color: 'white', marginBottom: '6px' }}>Create account</h1>
                  <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '28px' }}>Join with your college email — it's free</p>

                  <form onSubmit={handleRegister} noValidate>
                    <Field icon={<FiUser />} label="Full Name" name="name" type="text" placeholder="Your full name" autoComplete="name" />
                    <Field icon={<FiMail />} label="College Email" name="email" type="email" placeholder="you@presidencyuniversity.in" autoComplete="email" />
                    <Field icon={<FiLock />} label="Password" name="password" type="password" placeholder="Min 6 characters" autoComplete="new-password" />
                    <Field icon={<FiLock />} label="Confirm Password" name="confirm" type="password" placeholder="Repeat password" autoComplete="new-password" />

                    <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, marginTop: '8px' }}>
                      {loading ? 'Creating account…' : <><span>Create Account</span><FiArrowRight /></>}
                    </motion.button>
                  </form>

                  <p style={{ textAlign: 'center', color: '#444', fontSize: '0.875rem', marginTop: '24px' }}>
                    Already have one?{' '}
                    <Link to="/login" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div key="verify" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
                    <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.5rem', color: 'white', marginBottom: '8px' }}>Check your email</h1>
                    <p style={{ color: '#555', fontSize: '0.875rem' }}>We sent a 6-digit OTP to<br /><strong style={{ color: '#a0a0a0' }}>{form.email}</strong></p>
                  </div>

                  <form onSubmit={handleVerify}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '6px', fontWeight: 500 }}>Enter OTP</label>
                      <input className="input-field" type="text" maxLength={6} value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                        placeholder="6-digit code" style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 700 }}
                        aria-label="OTP verification code" />
                    </div>
                    <motion.button type="submit" className="btn-success" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      disabled={loading || otp.length < 6}
                      style={{ width: '100%', padding: '14px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: otp.length < 6 ? 0.5 : 1 }}>
                      {loading ? 'Verifying…' : <><FiCheck /><span>Verify Email</span></>}
                    </motion.button>
                  </form>

                  <button onClick={() => setPhase('form')} style={{ display: 'block', margin: '20px auto 0', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.875rem' }}>
                    ← Back to registration
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Register;
