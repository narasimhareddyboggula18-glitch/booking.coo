import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import AnimatedPage from '../components/AnimatedPage';
import { FiArrowRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: '🎓', title: 'Students Only', desc: 'Exclusively for Presidency University students with verified college email.', color: '#e94560' },
  { icon: '💰', title: 'Completely Free', desc: 'No charges, no subscriptions. Book any court at zero cost, always.', color: '#00b894' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Real-time slot availability. Book in under 30 seconds.', color: '#74b9ff' },
  { icon: '📅', title: 'Flexible Scheduling', desc: '9:30 AM – 5:00 PM. One-hour slots, Mon–Sat.', color: '#fdcb6e' },
];

const SPORTS_PREVIEW = [
  { emoji: '🏏', name: 'Cricket' },
  { emoji: '⚽', name: 'Football' },
  { emoji: '🏀', name: 'Basketball' },
  { emoji: '🏐', name: 'Volleyball' },
  { emoji: '🏓', name: 'Table Tennis' },
  { emoji: '♟️', name: 'Chess' },
];

const Home = () => {
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 50, duration: 0.6, delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        });
      });
    }, featuresRef);
    return () => ctx.revert();
  }, []);

  return (
    <AnimatedPage>
      <Hero />

      {/* Scrolling sports strip */}
      <section style={{ padding: '60px 0', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: '48px', width: 'max-content' }}>
          {[...SPORTS_PREVIEW, ...SPORTS_PREVIEW].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '28px' }}>{s.emoji}</span>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600, fontSize: '1.1rem', color: '#333' }}>{s.name}</span>
              <span style={{ color: '#222', margin: '0 8px' }}>·</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section ref={featuresRef} style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ color: '#e94560', fontWeight: 600, letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '12px' }}>
            WHY SPORTSYNC
          </motion.p>
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white' }}>
            Built for <span className="gradient-text">Presidency</span>
          </motion.h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} className="feature-card glass-card" style={{ padding: '28px' }}
              whileHover={{ borderColor: f.color + '44', boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${f.color}22` }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', fontSize: '24px', background: f.color + '1a', border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'white', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 100px' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '28px', padding: '60px 48px', background: 'linear-gradient(135deg, rgba(233,69,96,0.15) 0%, rgba(15,52,96,0.3) 100%)', border: '1px solid rgba(233,69,96,0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(233,69,96,0.15), transparent 70%)' }} />
          <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', marginBottom: '16px', position: 'relative' }}>Ready to play? Book now.</h2>
          <p style={{ color: '#a0a0a0', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 32px', position: 'relative' }}>
            Join hundreds of students already booking their favourite sports at Presidency University.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link to="/sports">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-primary" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                View All Sports <FiArrowRight />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.05 }} className="btn-secondary" style={{ padding: '14px 32px' }}>Create Account</motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: '#333', fontSize: '0.8rem' }}>
          🏆 <strong style={{ color: '#555' }}>SportSync</strong> — Presidency University Sports Facility Booking
        </div>
      </footer>
    </AnimatedPage>
  );
};

export default Home;
