import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";

interface Props {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  index: number;
}

export function EventCard({ title, date, time, venue, address, mapsUrl, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.3, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl relative overflow-hidden"
      style={{
        background: "color-mix(in oklab, var(--theme-bg) 65%, var(--theme-accent) 10%)",
        border: "1px solid color-mix(in oklab, var(--theme-accent) 30%, transparent)",
        boxShadow: "0 20px 60px -20px color-mix(in oklab, var(--theme-accent) 12%, transparent)",
        padding: 'clamp(2rem, 5vw, 3.5rem)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 128, height: 1, background: 'linear-gradient(90deg, transparent, var(--theme-accent), transparent)' }} />
      <div style={{ textAlign: 'center' }}>
        <div className="font-serif-elegant italic text-sm tracking-[0.3em] uppercase" style={{ color: 'var(--theme-accent)', marginBottom: 16 }}>
          Join Us
        </div>
        <h3 className="font-display" style={{ color: 'var(--theme-fg)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', marginBottom: 28, lineHeight: 1.1 }}>{title}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} className="font-serif-elegant text-lg">
            <Calendar style={{ width: 16, height: 16, color: 'var(--theme-accent)', flexShrink: 0 }} />
            <span style={{ color: 'var(--theme-fg)' }}>{date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, letterSpacing: '0.05em' }}>
            <Clock style={{ width: 16, height: 16, color: 'var(--theme-accent)', flexShrink: 0 }} />
            <span style={{ color: 'var(--theme-fg)' }}>{time}</span>
          </div>
        </div>

        <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, color-mix(in oklab, var(--theme-accent) 50%, transparent))' }} />
          <div style={{ color: 'var(--theme-accent)' }}>❋</div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, color-mix(in oklab, var(--theme-accent) 50%, transparent))' }} />
        </div>

        <div className="font-serif-elegant" style={{ color: 'var(--theme-fg)', fontSize: '1.2rem', marginBottom: 6 }}>{venue}</div>
        <div style={{ fontSize: 13, color: 'color-mix(in oklab, var(--theme-fg) 60%, transparent)', marginBottom: 28 }}>{address}</div>

        <motion.a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8,
            borderRadius: 999, border: '1px solid color-mix(in oklab, var(--theme-accent) 50%, transparent)',
            background: 'color-mix(in oklab, var(--theme-accent) 12%, transparent)',
            padding: '8px 24px', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em',
            color: 'var(--theme-fg)', textDecoration: 'none',
          }}
        >
          <MapPin style={{ width: 14, height: 14 }} />
          Open in Google Maps
        </motion.a>
      </div>
    </motion.div>
  );
}
