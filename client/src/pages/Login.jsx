import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/sports';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!form.email.endsWith('@presidencyuniversity.in')) e.email = 'Only @presidencyuniversity.in emails allowed';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🏆');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
        {/* Background glow */}
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 40% 50%, rgba(233,69,96,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '440px', position: 'relative' }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'white' }}>
                Sport<span style={{ color: '#e94560' }}>Sync</span>
              </span>
            </Link>
            <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '4px' }}>Presidency University</p>
          </div>

          <div className="glass-card" style={{ padding: '36px' }}>
            <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.6rem', color: 'white', marginBottom: '6px' }}>Welcome back</h1>
            <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '28px' }}>Sign in to book your court</p>

            {errors.general && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#e94560', fontSize: '0.875rem', marginBottom: '20px' }}>
                {errors.general}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '6px', fontWeight: 500 }}>College Email</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  <input
                    type="email" className={`input-field ${errors.email ? 'error' : ''}`}
                    value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                    placeholder="you@presidencyuniversity.in"
                    style={{ paddingLeft: '40px' }} aria-label="Email address" autoComplete="email"
                  />
                </div>
                {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#e94560', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</motion.p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 500 }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#e94560', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  <input
                    type={showPwd ? 'text' : 'password'} className={`input-field ${errors.password ? 'error' : ''}`}
                    value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                    placeholder="Your password"
                    style={{ paddingLeft: '40px', paddingRight: '44px' }} aria-label="Password" autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}>
                    {showPwd ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#e94560', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password}</motion.p>}
              </div>

              <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing in…' : <><span>Sign In</span><FiArrowRight /></>}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', color: '#444', fontSize: '0.875rem', marginTop: '24px' }}>
              No account?{' '}
              <Link to="/register" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Login;
