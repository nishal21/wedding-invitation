// src/components/Countdown.jsx
// ------------------------------------------------------------------
// Live countdown timer to a target date string (e.g. "December 31, 2026").
// Recalculates every second using setInterval.
// ------------------------------------------------------------------
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function pad(n) {
  return String(n).padStart(2, '0');
}

function calcTimeLeft(targetDate) {
  const target = new Date(targetDate).getTime();
  const now    = Date.now();
  const diff   = target - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
  };
}

function Block({ value, label }) {
  return (
    <motion.div
      key={value}
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0,  opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <span
        className="font-display leading-none gold-shimmer"
        style={{ fontSize: 'clamp(2.8rem,10vw,5rem)', minWidth: '2ch', display: 'block', textAlign: 'center' }}
      >
        {pad(value)}
      </span>
      <span className="font-sans-app text-[10px] uppercase tracking-[0.3em] mt-2"
        style={{ color: 'rgba(232,221,212,0.4)' }}>
        {label}
      </span>
    </motion.div>
  );
}

export default function Countdown({ targetDate }) {
  const [time, setTime] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-8 justify-center items-center">
      <Block value={time.days}    label="Days"    />
      <span className="font-display text-3xl mb-4" style={{ color: 'rgba(201,169,110,0.4)' }}>:</span>
      <Block value={time.hours}   label="Hours"   />
      <span className="font-display text-3xl mb-4" style={{ color: 'rgba(201,169,110,0.4)' }}>:</span>
      <Block value={time.minutes} label="Minutes" />
      <span className="font-display text-3xl mb-4" style={{ color: 'rgba(201,169,110,0.4)' }}>:</span>
      <Block value={time.seconds} label="Seconds" />
    </div>
  );
}
