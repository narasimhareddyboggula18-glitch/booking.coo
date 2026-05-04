import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const FLOATERS = [
  { emoji: '🏏', x: '8%',  y: '20%', delay: 0,    dur: 4.5 },
  { emoji: '⚽', x: '85%', y: '15%', delay: 0.5,  dur: 5 },
  { emoji: '🏀', x: '75%', y: '65%', delay: 1,    dur: 4 },
  { emoji: '🏐', x: '12%', y: '70%', delay: 1.5,  dur: 5.5 },
  { emoji: '🏓', x: '50%', y: '10%', delay: 0.8,  dur: 3.8 },
  { emoji: '♟️', x: '92%', y: '45%', delay: 1.2,  dur: 4.2 },
];

const STATS = [
  { value: '11',    label: 'Sports' },
  { value: '500+',  label: 'Students' },
  { value: 'Free',  label: 'Always' },
  { value: '9:30–5',label: 'Timings' },
];

const Hero = () => {
  const heroRef    = useRef(null);
  const titleRef   = useRef(null);
  const subtitleRef= useRef(null);
  const btnRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([titleRef.current, subtitleRef.current, btnRef.current], {
        opacity: 0, y: 60, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.3,
      });
      gsap.to('.hero-bg-layer', {
        yPercent: -30, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '80px' }}>
      <div className="hero-bg-layer animate-gradient" style={{ position: 'absolute', inset: '-20%', background: 'linear-gradient(-45deg, #0a0a0a, #1a1a2e, #0f3460, #16213e, #1a0a2e)', backgroundSize: '400% 400%', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(233,69,96,0.18) 0%, transparent 70%)' }} />

      <div className="particles-bg" style={{ zIndex: 1 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" style={{ width: Math.random() * 6 + 2, height: Math.random() * 6 + 2, left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 15 + 10}s`, animationDelay: `${Math.random() * 10}s` }} />
        ))}
      </div>

      {FLOATERS.map((f, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: f.delay + 1 }}
          style={{ position: 'absolute', left: f.x, top: f.y, fontSize: 'clamp(24px, 4vw, 48px)', zIndex: 1, pointerEvents: 'none', filter: 'drop-shadow(0 0 12px rgba(233,69,96,0.3))' }}>
          <motion.span animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }} transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'block' }}>
            {f.emoji}
          </motion.span>
        </motion.div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: '900px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px', fontSize: '0.8rem', color: '#e94560', fontWeight: 600, letterSpacing: '1px' }}>
          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
          PRESIDENCY UNIVERSITY · SPORTS FACILITY
        </motion.div>

        <h1 ref={titleRef} className="section-title" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', marginBottom: '24px', lineHeight: 1.05, color: 'white' }}>
          Book Your Game.<br /><span className="gradient-text">Own Your Time.</span>
        </h1>

        <p ref={subtitleRef} style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#a0a0a0', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          Reserve sports courts & fields at Presidency University — 100% free for verified students. Cricket, Football, Basketball and 8 more.
        </p>

        <div ref={btnRef} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/sports">
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(233,69,96,0.5)' }} whileTap={{ scale: 0.97 }}
              className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Browse Sports <FiArrowRight />
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Get Started Free
            </motion.button>
          </Link>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 2, display: 'flex', marginTop: '80px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ padding: '20px 32px', textAlign: 'center', borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: 'white' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#606060', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.7rem', color: '#444', letterSpacing: '2px' }}>SCROLL</span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #e94560, transparent)' }} />
      </motion.div>
    </section>
  );
};

export default Hero;
