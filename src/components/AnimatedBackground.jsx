// src/components/AnimatedBackground.jsx
// ------------------------------------------------------------------
// Renders an animated canvas of soft watercolor-like blobs that
// drift gently around the screen. Runs entirely in CSS animations
// to keep the main thread free for other Framer Motion work.
// ------------------------------------------------------------------
import { useEffect, useRef } from 'react';

const BLOBS = [
  { cx: '20%', cy: '20%', r: 320, color: 'rgba(255,200,180,0.35)', dur: 18 },
  { cx: '75%', cy: '15%', r: 280, color: 'rgba(200,180,255,0.30)', dur: 22 },
  { cx: '50%', cy: '60%', r: 360, color: 'rgba(255,220,150,0.25)', dur: 26 },
  { cx: '10%', cy: '75%', r: 260, color: 'rgba(180,230,200,0.28)', dur: 20 },
  { cx: '85%', cy: '70%', r: 300, color: 'rgba(255,180,210,0.30)', dur: 24 },
];

export default function AnimatedBackground() {
  const svgRef = useRef(null);

  /* Animate blob positions with requestAnimationFrame for a fluid feel */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const circles = Array.from(svg.querySelectorAll('circle'));
    const states = circles.map((_, i) => ({
      angle: (i / circles.length) * Math.PI * 2,
      speed: 0.0003 + i * 0.00007,
      radiusX: 60 + i * 15,
      radiusY: 50 + i * 10,
      baseX: BLOBS[i].cx,
      baseY: BLOBS[i].cy,
    }));

    let raf;
    const tick = (ts) => {
      circles.forEach((circle, i) => {
        const s = states[i];
        s.angle += s.speed;
        const dx = Math.sin(s.angle) * s.radiusX;
        const dy = Math.cos(s.angle * 0.7) * s.radiusY;
        const baseXPx = parseFloat(s.baseX) / 100;
        const baseYPx = parseFloat(s.baseY) / 100;
        circle.setAttribute('cx', `${baseXPx * 100 + dx * 0.05}%`);
        circle.setAttribute('cy', `${baseYPx * 100 + dy * 0.05}%`);
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="blob-blur">
          <feGaussianBlur stdDeviation="60" />
        </filter>
      </defs>
      <g filter="url(#blob-blur)">
        {BLOBS.map((b, i) => (
          <circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={b.color}
          />
        ))}
      </g>
    </svg>
  );
}
