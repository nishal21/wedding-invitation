import { motion } from "framer-motion";
import { useMemo } from "react";

export function FallingPetals({ count = 18 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 14 + Math.random() * 10,
        size: 10 + Math.random() * 14,
        sway: 30 + Math.random() * 60,
        rotate: Math.random() * 360,
        hue: Math.random() > 0.5 ? "oklch(0.88 0.06 25)" : "oklch(0.85 0.09 80)",
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute -top-10"
          style={{ left: `${p.left}%` }}
          initial={{ y: -40, x: 0, rotate: p.rotate, opacity: 0 }}
          animate={{
            y: ["-5%", "110%"],
            x: [0, p.sway, -p.sway / 2, p.sway / 1.5, 0],
            rotate: [p.rotate, p.rotate + 360],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.hue}>
            <path d="M12 2 C16 6 18 12 12 22 C6 12 8 6 12 2 Z" opacity="0.85" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
