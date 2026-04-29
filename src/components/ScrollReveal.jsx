// src/components/ScrollReveal.jsx
// ------------------------------------------------------------------
// Wrapper component that animates its children into view when they
// enter the viewport. Uses Framer Motion's useInView hook.
// ------------------------------------------------------------------
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
}) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-60px' });

  const offsets = {
    up:    { y: 40,   x: 0   },
    down:  { y: -40,  x: 0   },
    left:  { y: 0,    x: 40  },
    right: { y: 0,    x: -40 },
    none:  { y: 0,    x: 0   },
  };

  const { x, y } = offsets[direction] ?? offsets.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
