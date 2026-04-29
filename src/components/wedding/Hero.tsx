import { motion } from "framer-motion";
import { FallingPetals } from "./Petals";
import { FloralCorner } from "./FloralCorner";

interface Props {
  groom: string;
  bride: string;
  date: string;
  hashtag: string;
}

export function Hero({ groom, bride, date, hashtag }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
      <FallingPetals count={20} />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="paper-card rounded-[2rem] relative max-w-3xl w-full px-6 py-16 md:px-16 md:py-24 text-center overflow-hidden"
      >
        <FloralCorner position="tl" />
        <FloralCorner position="tr" />
        <FloralCorner position="bl" />
        <FloralCorner position="br" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="font-serif-elegant italic text-sm md:text-base tracking-[0.4em] uppercase text-gold"
        >
          The Wedding Of
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
          className="mt-8 font-display text-6xl md:text-8xl text-maroon leading-none"
        >
          {groom}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, delay: 1.2, ease: "easeOut" }}
          className="my-6 font-serif-elegant italic text-3xl md:text-4xl text-gradient-gold"
        >
          &amp;
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.4, ease: "easeOut" }}
          className="font-display text-6xl md:text-8xl text-maroon leading-none"
        >
          {bride}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.7, ease: "easeInOut" }}
          className="mx-auto mt-10 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent origin-center"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2 }}
          className="mt-6 font-sans text-sm md:text-base tracking-[0.3em] uppercase text-charcoal"
        >
          {date}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.3 }}
          className="mt-3 font-serif-elegant italic text-gold"
        >
          {hashtag}
        </motion.div>
      </motion.div>
    </section>
  );
}
