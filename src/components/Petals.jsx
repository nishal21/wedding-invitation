// src/components/Petals.jsx
// ------------------------------------------------------------------
// Renders an overlay of falling flower petals using Framer Motion.
// Each petal is an SVG path that drifts down with randomised
// horizontal sway, rotation, scale and duration.
// ------------------------------------------------------------------
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

/* Total number of petals rendered simultaneously */
const PETAL_COUNT = 22;

/* SVG path for a simple organic petal shape */
const PETAL_PATH =
  'M10 0 C14 5, 20 10, 10 20 C0 10, 6 5, 10 0Z';

/* Petal colour palette – soft florals */
const COLORS = [
  '#f9c5d1', '#f7b2c1', '#fdd5bb', '#e8c4e8',
  '#fae0d5', '#c8e6f5', '#fce4b3',
];

const rand = (min, max) => Math.random() * (max - min) + min;

function Petal({ index }) {
  const controls = useAnimation();

  const startX   = rand(0, 100);          // vw
  const size     = rand(10, 22);          // px
  const duration = rand(6, 14);           // s
  const delay    = rand(0, duration);     // stagger
  const color    = COLORS[index % COLORS.length];
  const swayAmp  = rand(30, 90);          // px horizontal sway

  useEffect(() => {
    const run = async () => {
      while (true) {
        await controls.start({
          y: ['−5vh', '105vh'],
          x: [
            `${startX}vw`,
            `${startX + swayAmp * 0.5}vw`,
            `${startX + swayAmp}vw`,
            `${startX + swayAmp * 0.7}vw`,
          ],
          rotate: [0, 180, 360],
          opacity: [0, 0.85, 0.85, 0],
          transition: {
            duration,
            delay,
            ease: 'linear',
            times: [0, 0.1, 0.9, 1],
            repeat: 0,
          },
        });
        /* Reset instantly and restart (creates an infinite loop) */
        controls.set({ y: '-5vh', x: `${rand(0, 100)}vw`, opacity: 0 });
      }
    };
    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.svg
      aria-hidden="true"
      animate={controls}
      width={size}
      height={size * 2}
      viewBox="0 0 20 20"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 5,
        willChange: 'transform',
      }}
    >
      <path d={PETAL_PATH} fill={color} />
    </motion.svg>
  );
}

export default function Petals() {
  return (
    <>
      {Array.from({ length: PETAL_COUNT }, (_, i) => (
        <Petal key={i} index={i} />
      ))}
    </>
  );
}
