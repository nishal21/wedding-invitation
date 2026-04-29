import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function diff(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { d, h, m, s };
}

export function Countdown({ date }: { date: string }) {
  const target = new Date(date);
  const [t, setT] = useState(diff(target));

  useEffect(() => {
    const i = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(i);
  }, [date]);

  const items = [
    { label: "Days", value: t.d },
    { label: "Hours", value: t.h },
    { label: "Minutes", value: t.m },
    { label: "Seconds", value: t.s },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, maxWidth: 800, margin: '0 auto' }}>
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
          style={{
            borderRadius: 16, padding: '20px 8px', textAlign: 'center',
            background: "color-mix(in oklab, var(--theme-bg) 65%, var(--theme-accent) 10%)",
            border: "1px solid color-mix(in oklab, var(--theme-accent) 30%, transparent)",
          }}
        >
          <div className="font-display tabular-nums" style={{ fontSize: 'clamp(1.5rem,5vw,3rem)', color: 'var(--theme-fg)', lineHeight: 1 }}>
            {String(it.value).padStart(2, "0")}
          </div>
          <div style={{ marginTop: 8, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'color-mix(in oklab, var(--theme-fg) 55%, transparent)' }}>
            {it.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
