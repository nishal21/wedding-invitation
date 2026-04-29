import { motion } from "framer-motion";

interface Props {
  groom: string;
  bride: string;
  date: string;
  hashtag: string;
}

export function HeroWestern({ groom, bride, date, hashtag }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8 }}
        className="max-w-4xl w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3 }}
          className="font-label text-[10px] theme-fg/60 mb-16 md:mb-24"
        >
          VOLUME I &nbsp; · &nbsp; MMXXVI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "-0.03em" }}
          transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif-elegant font-extralight text-[5rem] md:text-[9rem] leading-[0.85] theme-fg"
        >
          {groom}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.2 }}
          className="my-4 md:my-6 flex items-center justify-center gap-4"
        >
          <div className="h-px w-16 md:w-24" style={{ background: "var(--theme-accent)" }} />
          <span className="font-serif-elegant italic text-xl md:text-2xl theme-accent">and</span>
          <div className="h-px w-16 md:w-24" style={{ background: "var(--theme-accent)" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "-0.03em" }}
          transition={{ duration: 1.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif-elegant font-extralight text-[5rem] md:text-[9rem] leading-[0.85] theme-fg"
        >
          {bride}
        </motion.h1><br/>
<center>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2 }}
          className="mt-16 md:mt-20 font-serif-elegant italic text-base md:text-lg theme-fg/80 max-w-md mx-auto leading-relaxed"
        >
          An intimate celebration of two souls,<br/>on the thirty-first of May, two thousand twenty-six.
        </motion.p></center>
<br/>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.4 }}
          className="mt-12 flex justify-center items-center gap-2 md:gap-6 font-label text-[10px] theme-fg/60"
        >
          <span>THALASSERY</span><span className="theme-accent">·</span>
          <span>KERALA</span><span className="theme-accent">·</span>
          <span>{date}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.7 }}
          className="mt-3 font-serif-elegant italic text-sm theme-accent"
        >
          {hashtag}
        </motion.div>
      </motion.div>
    </section>
  );
}
