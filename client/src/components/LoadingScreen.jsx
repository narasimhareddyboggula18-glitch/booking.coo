import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const LoadingScreen = ({ onComplete }) => {
  const ballRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => onComplete?.(), 400);
      },
    });

    tl.from(ballRef.current, { opacity: 0, scale: 0, duration: 0.4 })
      .to(ballRef.current, {
        y: -40, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 3,
      })
      .from(textRef.current, { opacity: 0, y: 20, duration: 0.4 }, '-=0.3')
      .to('.loading-screen', { opacity: 0, duration: 0.5, delay: 0.3 });
  }, []);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div ref={ballRef} style={{ fontSize: '56px', marginBottom: '20px' }}>⚽</div>
      <div ref={textRef} style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.5rem',
          color: 'white', letterSpacing: '-0.5px', marginBottom: '8px',
        }}>
          Sport<span style={{ color: '#e94560' }}>Sync</span>
        </div>
        <div style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '2px' }}>
          LOADING...
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        style={{
          height: '2px', background: 'linear-gradient(90deg, #e94560, #f5a623)',
          borderRadius: '1px', marginTop: '32px',
        }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
