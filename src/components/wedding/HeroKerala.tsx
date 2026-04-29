import { motion } from "framer-motion";

interface Props {
  groom: string;
  bride: string;
  date: string;
  hashtag: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function HeroKerala({ groom, bride, date, hashtag }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Ornamental backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, var(--theme-accent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.18, scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full"
          style={{ background: "radial-gradient(closest-side, var(--theme-accent), transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl w-full text-center"
      >
        <motion.div {...fadeUp} transition={{ duration: 1.4, delay: 0.3 }} className="font-label text-[10px] theme-accent mb-6" style={{ textAlign: 'center' }}>
          ﷽  &nbsp;  THE WEDDING OF&nbsp; ﷽
        </motion.div>
        <br></br>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
          className="font-arabic theme-accent text-3xl md:text-5xl leading-[1.6] mb-8"
          style={{ textAlign: 'center' }}
        >
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </motion.div>
<center>
        {/* Mihrab arch */}
        <div className="relative mx-auto w-full max-w-md">
          <svg viewBox="0 0 400 480" className="w-full h-auto">
            <defs>
              <linearGradient id="kg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--theme-accent)" stopOpacity="0.9" />
                <stop offset="1" stopColor="var(--theme-accent)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
              d="M40,470 L40,200 Q40,40 200,40 Q360,40 360,200 L360,470"
              fill="none" stroke="url(#kg)" strokeWidth="1.2"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 1.1, ease: "easeInOut" }}
              d="M60,470 L60,210 Q60,60 200,60 Q340,60 340,210 L340,470"
              fill="none" stroke="var(--theme-accent)" strokeWidth="0.5" opacity="0.45"
            />
            
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-20 px-8">
            <motion.div {...fadeUp} transition={{ duration: 1.4, delay: 1.4 }}
              className="font-label text-[9px] theme-accent mb-4">{groom.toUpperCase()} ⋆ WEDS ⋆ {bride.toUpperCase()}</motion.div>
            <motion.h1 {...fadeUp} transition={{ duration: 1.4, delay: 1.6 }}
              className="font-display text-5xl md:text-6xl theme-fg leading-none">{groom}</motion.h1>
            <motion.div {...fadeUp} transition={{ duration: 1.2, delay: 1.9 }}
              className="font-arabic theme-accent text-2xl my-2 italic">&</motion.div>
            <motion.h1 {...fadeUp} transition={{ duration: 1.4, delay: 2.1 }}
              className="font-display text-5xl md:text-6xl theme-fg leading-none">{bride}</motion.h1>
          </div>
        </div></center>

        <motion.div {...fadeUp} transition={{ duration: 1.3, delay: 2.5 }} className="mt-6 font-label text-[11px] theme-accent">
          {date}
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 1.3, delay: 2.7 }} className="mt-2 font-serif-elegant italic theme-fg/80 text-sm">
          {hashtag}
        </motion.div>
      </motion.div>
    </section>
  );
}
