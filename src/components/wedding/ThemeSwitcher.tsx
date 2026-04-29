import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { THEMES, useWeddingTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useWeddingTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-16 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-64 rounded-2xl border border-[var(--theme-accent)]/40 bg-[var(--theme-bg)]/95 backdrop-blur-xl p-2 shadow-2xl"
          >
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--theme-accent)]">
              Choose Theme
            </div>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-left hover:bg-[var(--theme-accent)]/10 transition-colors"
              >
                <div>
                  <div className="font-medium text-sm text-[var(--theme-fg)]">{t.label}</div>
                  <div className="text-[11px] text-[var(--theme-fg)]/60 italic">{t.tagline}</div>
                </div>
                {theme === t.id && <Check className="h-4 w-4 text-[var(--theme-accent)]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="h-12 w-12 rounded-full bg-[var(--theme-accent)] text-[var(--theme-bg)] shadow-xl flex items-center justify-center"
        aria-label="Switch theme"
      >
        <Palette className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
