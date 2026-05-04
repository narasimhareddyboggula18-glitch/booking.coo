import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  in:      { opacity: 1,  y: 0 },
  out:     { opacity: 0,  y: -24 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.35,
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{ minHeight: '100vh' }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
