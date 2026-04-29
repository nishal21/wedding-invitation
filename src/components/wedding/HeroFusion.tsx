import { motion } from "framer-motion";

interface Props {
  groom: string;
  bride: string;
  date: string;
  hashtag: string;
}

export function HeroFusion({ groom, bride, date, hashtag }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Geometric mandala */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-[-8rem] md:right-[-4rem] top-1/2 -translate-y-1/2 w-[28rem] md:w-[36rem] h-[28rem] md:h-[36rem] pointer-events-none"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--theme-accent)" />
              <stop offset="1" stopColor="var(--theme-accent)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.4 }}
            cx="100" cy="100" r="90" fill="none" stroke="url(#fg)" strokeWidth="0.4" />
          <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.6 }}
            cx="100" cy="100" r="70" fill="none" stroke="url(#fg)" strokeWidth="0.4" />
          <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            cx="100" cy="100" r="50" fill="none" stroke="url(#fg)" strokeWidth="0.4" />
          <motion.polygon initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2, delay: 1 }}
            points="100,15 185,100 100,185 15,100" fill="none" stroke="var(--theme-accent)" strokeWidth="0.4" />
          <motion.polygon initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: 1.2 }}
            points="100,35 165,100 100,165 35,100" fill="none" stroke="var(--theme-accent)" strokeWidth="0.4" />
          <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 1.6 }}
            cx="100" cy="100" r="14" fill="var(--theme-accent)" opacity="0.35" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-3xl w-full grid grid-cols-[auto_1fr] gap-4 md:gap-8 items-center">
        {/* Vertical Arabic */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          className="font-arabic theme-accent text-xl md:text-2xl tracking-[0.15em] border-r border-[var(--theme-accent)]/60 pr-3 md:pr-5 py-4"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          نِكَاح ٢٠٢٦
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.4 }}
            className="font-label text-[10px] theme-accent mb-4"
          >
            SAVE THE DATE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-5xl md:text-7xl leading-[0.95] theme-fg"
          >
            {groom}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="font-display italic text-2xl md:text-3xl theme-accent my-1"
          >
            &
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-5xl md:text-7xl leading-[0.95] theme-fg mb-6"
          >
            {bride}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.4, delay: 1.6 }}
            className="flex items-center gap-3 mb-5 origin-left"
          ><br></br><br></br>
            <div className="h-px w-8 md:w-12" style={{ background: "var(--theme-accent)" }} />
            <div className="font-label text-[10px] theme-fg">31.05.2026 · THALASSERY</div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.9 }}
            className="font-serif-elegant italic text-sm md:text-base theme-fg/80 leading-relaxed max-w-sm"
          >
            A union where Kerala tradition meets the elegance of the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3, delay: 2.2 }}
            className="mt-6 flex gap-2 font-label text-[9px] theme-accent"
          >
            <span>NIKAH</span>·<span>RECEPTION</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3, delay: 2.5 }}
            className="mt-3 font-serif-elegant italic text-xs theme-fg/60"
          >
            {hashtag} · {date}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
