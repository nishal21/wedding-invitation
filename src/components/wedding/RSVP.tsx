import { motion } from "framer-motion";
import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  slug: string;
  guestName: string;
}

export function RSVP({ slug, guestName }: Props) {
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attending) return;
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError(null);

    const status = attending === "yes" ? "attending" : "declined";
    const guestCount = attending === "yes" ? guests : 0;

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, status, guest_count: guestCount })
      });
      const { error: apiErr } = await res.json();
      
      setLoading(false);
      if (apiErr) {
        setError("Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('[RSVP submit]', err);
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      style={{
        margin: '0 auto',
        width: '100%',
        maxWidth: 680,
        borderRadius: 24,
        position: 'relative',
        padding: 'clamp(2rem, 6vw, 4rem) clamp(1.5rem, 6vw, 4rem)',
        background: "color-mix(in oklab, var(--theme-bg) 70%, var(--theme-accent) 8%)",
        border: "1px solid color-mix(in oklab, var(--theme-accent) 35%, transparent)",
        boxShadow: "0 30px 80px -20px color-mix(in oklab, var(--theme-accent) 15%, transparent)",
      }}
    >
      <div className="text-center" style={{ marginBottom: 40 }}>
        <div className="font-serif-elegant italic text-sm tracking-[0.3em] uppercase" style={{ color: 'var(--theme-accent)', marginBottom: 14 }}>
          Reply Card
        </div>
        <h3 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--theme-fg)' }}>Kindly RSVP</h3>
       <br></br> <center><div className="mx-auto mt-4 h-px w-32" style={{ background: 'linear-gradient(90deg, transparent, var(--theme-accent), transparent)' }} /></center>
        <p className="font-serif-elegant italic" style={{ marginTop: 20, fontSize: 15, color: 'color-mix(in oklab, var(--theme-fg) 70%, transparent)', lineHeight: 1.7 }}>
          Dear <span style={{ color: 'var(--theme-accent)', fontWeight: 600 }}>{guestName}</span>, your presence will make our day complete
        </p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center py-10"
        >
          <center><Heart className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--theme-accent)' }} fill="currentColor" /></center>
          <p className="font-display text-2xl" style={{ color: 'var(--theme-fg)' }}>Thank you, {guestName}!</p>
          <p className="mt-2 font-serif-elegant italic" style={{ color: 'color-mix(in oklab, var(--theme-fg) 60%, transparent)' }}>
            Your response has been received with gratitude.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--theme-fg)', marginBottom: 16, display: 'block' }}>
              Will you attend?
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {(["yes", "no"] as const).map((opt) => (
                <motion.button
                  key={opt}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAttending(opt)}
                  className="font-serif-elegant"
                  style={{ flex: 1, borderRadius: 999, border: '1px solid', fontSize: '1rem', letterSpacing: '0.05em', transition: 'all 0.5s', cursor: 'pointer', padding: '14px 24px', ...(attending === opt ? { background: 'var(--theme-accent)', color: 'var(--theme-bg)', borderColor: 'var(--theme-accent)', boxShadow: '0 4px 20px color-mix(in oklab, var(--theme-accent) 30%, transparent)' } : { borderColor: 'color-mix(in oklab, var(--theme-accent) 50%, transparent)', color: 'var(--theme-fg)', background: 'transparent' }) }}
                >
                  {opt === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                </motion.button>
              ))}
            </div>
          </div>

          {attending === "yes" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <label style={{ display: 'block', textAlign: 'center', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--theme-fg)', marginBottom: 16 }}>
                Number of Guests
              </label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid color-mix(in oklab, var(--theme-accent) 50%, transparent)', color: 'var(--theme-fg)', background: 'transparent', cursor: 'pointer', fontSize: 20 }}
                >
                  −
                </button>
                <div className="font-display" style={{ fontSize: '2rem', color: 'var(--theme-fg)', minWidth: 48, textAlign: 'center' }}>{guests}</div>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(100, guests + 1))}
                  style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid color-mix(in oklab, var(--theme-accent) 50%, transparent)', color: 'var(--theme-fg)', background: 'transparent', cursor: 'pointer', fontSize: 20 }}
                >
                  +
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <p className="text-sm text-center font-serif-elegant italic" style={{ color: "oklch(0.55 0.22 27)" }}>
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={!attending || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="font-serif-elegant"
            style={{ width: '100%', borderRadius: 999, border: 'none', fontSize: '1.1rem', letterSpacing: '0.15em', cursor: 'pointer', background: 'var(--theme-accent)', color: 'var(--theme-bg)', padding: '18px 24px', boxShadow: '0 8px 30px color-mix(in oklab, var(--theme-accent) 25%, transparent)', opacity: (!attending || loading) ? 0.4 : 1 }}
          >
            {loading ? "Sending…" : "Send Reply"}
          </motion.button>
        </form>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            style={{
              background: 'var(--theme-bg)',
              border: '1px solid color-mix(in oklab, var(--theme-accent) 40%, transparent)',
              borderRadius: 20,
              padding: '32px',
              maxWidth: 400,
              width: '90%',
              color: 'var(--theme-fg)',
            }}
          >
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', margin: '0 0 16px' }}>
              Confirm Your Response
            </h3>
            <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px', color: 'color-mix(in oklab, var(--theme-fg) 70%, transparent)' }}>
              {attending === "yes" 
                ? `You're attending with ${guests} guest${guests > 1 ? 's' : ''}. Is this correct?`
                : "You're declining the invitation. Is this correct?"
              }
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 999,
                  border: '1px solid color-mix(in oklab, var(--theme-accent) 50%, transparent)',
                  background: 'transparent',
                  color: 'var(--theme-fg)',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans,sans-serif',
                  fontSize: 14,
                }}
              >
                Go Back
              </button>
              <button
                onClick={confirmSubmit}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'var(--theme-accent)',
                  color: 'var(--theme-bg)',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans,sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
