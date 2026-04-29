// src/components/Loader.jsx
// ------------------------------------------------------------------
// Full-screen animated loader that displays before the invitation
// is revealed. Fades out once `done` prop becomes true.
// ------------------------------------------------------------------
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #fdf0ec 0%, #f5e6f8 50%, #edf5ff 100%)',
            zIndex: 100,
          }}
        >
          {/* Animated ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-transparent mb-8"
            style={{
              borderTopColor: '#c9a96e',
              borderRightColor: '#e8b4c5',
            }}
          />
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="font-serif text-2xl italic text-rose-400 tracking-widest"
          >
            Opening your invitation…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
