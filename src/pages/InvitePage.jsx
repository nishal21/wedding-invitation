// src/pages/InvitePage.jsx – wired to everlasting-union wedding components
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/db.js';
import config from '../data/config.json';
import { ThemeProvider, useWeddingTheme } from '../components/wedding/ThemeProvider.tsx';
import { CinematicLoader } from '../components/wedding/Loader.tsx';
import { HeroKerala } from '../components/wedding/HeroKerala.tsx';
import { HeroWestern } from '../components/wedding/HeroWestern.tsx';
import { HeroFusion } from '../components/wedding/HeroFusion.tsx';
import { Countdown } from '../components/wedding/Countdown.tsx';
import { EventCard } from '../components/wedding/EventCard.tsx';
import { RSVP } from '../components/wedding/RSVP.tsx';
import { FloralBackdrop } from '../components/wedding/FloralBackdrop.tsx';

function HeroSwitcher({ groom, bride, date, hashtag }) {
  const { theme } = useWeddingTheme();
  const props = { groom, bride, date, hashtag };
  return (
    <AnimatePresence mode="wait">
      <motion.div key={theme} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
        {theme === 'kerala'  && <HeroKerala  {...props} />}
        {theme === 'western' && <HeroWestern {...props} />}
        {theme === 'fusion'  && <HeroFusion  {...props} />}
      </motion.div>
    </AnimatePresence>
  );
}

function InviteInner({ slug }) {
  const { theme } = useWeddingTheme();
  const [guest,    setGuest]    = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { event, couple, schedule } = config;
  const events = Object.values(schedule);
  const weddingDateObj = new Date(event.weddingDate);
  const heroDate = `${weddingDateObj.getDate()} · ${weddingDateObj.toLocaleString('en', { month: 'short' }).toUpperCase()} · ${weddingDateObj.getFullYear()}`;

  useEffect(() => {
    async function fetchGuest() {
      try {
        const res = await fetch(`/api/guests?slug=${slug}`);
        const { data, error } = await res.json();
        if (error || !data) setNotFound(true);
        else setGuest(data);
      } catch (err) {
        console.error('[InvitePage fetch]', err);
        setNotFound(true);
      }
    }
    fetchGuest();
  }, [slug]);

  /* ── shared section styles ───────────────────────────────── */
  const section = (extra = {}) => ({
    width: '100%',
    maxWidth: 1000,
    margin: '0 auto',
    padding: '64px 24px',
    textAlign: 'center',
    ...extra,
  });

  const sectionWide = (extra = {}) => ({
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '64px 24px',
    ...extra,
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--theme-bg)', color: 'var(--theme-fg)' }}>
      <CinematicLoader />
      {theme === 'western' && <FloralBackdrop />}

      <main style={{ position: 'relative', zIndex: 10, isolation: 'isolate' }}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <HeroSwitcher
          groom={couple.person1.name}
          bride={couple.person2.name}
          date={heroDate}
          hashtag={event.hashtag}
        />

        {/* ── Personalised greeting ─────────────────────────── */}
        {guest && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            style={{ textAlign: 'center', padding: '0 24px 32px' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 20px', borderRadius: 999,
              border: '1px solid color-mix(in oklab, var(--theme-accent) 40%, transparent)',
              color: 'var(--theme-accent)',
              fontFamily: "'Cinzel','Inter',sans-serif",
              fontSize: 11, letterSpacing: '0.25em',
            }}>
               &nbsp; Dear {guest.full_name}, you are cordially invited &nbsp; 
            </span>
          </motion.div>
        )}

        {/* ── Quranic quote ─────────────────────────────────── */}
        <div style={section()}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            <p style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: 'italic', fontSize: 'clamp(1rem,2.5vw,1.25rem)',
              color: 'var(--theme-fg)', lineHeight: 1.8, margin: 0,
            }}>
              "{event.quote}"
            </p>
            <p style={{
              marginTop: 16,
              fontFamily: "'Cinzel','Inter',sans-serif",
              fontSize: 10, letterSpacing: '0.25em',
              color: 'var(--theme-accent)',
            }}>
              {event.quoteRef}
            </p>
          </motion.div>
        </div>

        {/* ── Countdown ─────────────────────────────────────── */}
        <div style={section()}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.2 }}
          >
            <p style={{ fontFamily: "'Cinzel','Inter',sans-serif", fontSize: 10,
              letterSpacing: '0.25em', color: 'var(--theme-accent)', marginBottom: 12 }}>
              COUNTING DOWN TO
            </p>
            <h2 style={{ fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(1.75rem,5vw,3rem)', color: 'var(--theme-fg)',
              margin: '0 0 32px' }}>
              Our Special Day
            </h2>
          </motion.div>
          <Countdown date={event.weddingDate} />
        </div>

        {/* ── Events ────────────────────────────────────────── */}
        <div style={sectionWide()}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.2 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <p style={{ fontFamily: "'Cinzel','Inter',sans-serif", fontSize: 10,
              letterSpacing: '0.25em', color: 'var(--theme-accent)', marginBottom: 12 }}>
              WEDDING EVENTS
            </p>
            <h2 style={{ fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(1.75rem,5vw,3rem)', color: 'var(--theme-fg)', margin: 0 }}>
              Save the Moments
            </h2>
          </motion.div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}>
            {events.map((e, i) => (
              <EventCard key={e.id ?? i} {...e} index={i} />
            ))}
          </div>
        </div>

        {/* ── RSVP ──────────────────────────────────────────── */}
        <div style={section({ maxWidth: 860 })}>
          {notFound ? (
            <div style={{
              background: 'color-mix(in oklab, var(--theme-bg) 60%, transparent)',
              border: '1px solid color-mix(in oklab, var(--theme-accent) 30%, transparent)',
              borderRadius: 24, padding: '40px 32px',
            }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem',
                color: 'var(--theme-fg)', fontStyle: 'italic', margin: '0 0 8px' }}>
                Invitation not found
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '0.9rem',
                color: 'var(--theme-accent)' }}>
                Please check your link or contact{' '}
                <a href={`tel:${event.contact}`} style={{ color: 'var(--theme-accent)', textDecoration: 'underline' }}>
                  {event.contact}
                </a>.
              </p>
            </div>
          ) : guest ? (
            <RSVP slug={slug} guestName={guest.full_name} />
          ) : (
            <p style={{ fontFamily: "'Cinzel','Inter',sans-serif", fontSize: 11,
              letterSpacing: '0.25em', color: 'var(--theme-accent)',
              animation: 'pulse 2s ease-in-out infinite' }}>
              Loading your invitation…
            </p>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer style={{ textAlign: 'center', padding: '48px 24px 64px' }}>
          <div style={{
            width: 120, height: 1, margin: '0 auto 24px',
            background: 'linear-gradient(90deg, transparent, var(--theme-accent), transparent)',
          }} />
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic',
            fontSize: '1.1rem', color: 'var(--theme-fg)', margin: '0 0 6px' }}>
            With love, from the families of {couple.person1.name} &amp; {couple.person2.name}
          </p>
          <p style={{ fontFamily: "'Cinzel','Inter',sans-serif", fontSize: 10,
            letterSpacing: '0.25em', color: 'var(--theme-accent)', margin: '0 0 12px' }}>
            {event.hashtag}
          </p>
          <p style={{ fontSize: 12, color: 'var(--theme-fg)', opacity: 0.4,
            fontFamily: "'Cormorant Garamond',serif" }}>
            Any questions?{' '}
            <a href={`tel:${event.contact}`} style={{ color: 'var(--theme-accent)', textDecoration: 'underline' }}>
              {event.contact}
            </a>
          </p>
        </footer>

      </main>
    </div>
  );
}

export default function InvitePage() {
  const { slug } = useParams();
  return (
    <ThemeProvider>
      <InviteInner slug={slug} />
    </ThemeProvider>
  );
}
