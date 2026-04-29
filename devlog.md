# Devlog – Digital Invitation App Template

**Date:** 2026-04-29  
**Session:** Initial full build

## What was built

Complete open-source digital invitation web app on top of a Vite + React + Tailwind scaffolding.

### Files created / modified

| File | Status | Notes |
|---|---|---|
| `src/data/config.json` | Created | Single source of truth for all event text |
| `supabase/schema.sql` | Created | Full DB setup: table, RLS policies |
| `src/lib/supabase.js` | Created | Supabase client using env vars |
| `.env.local.example` | Created | Template for credentials |
| `src/index.css` | Modified | Replaced Vite default with Tailwind v4 + Google Fonts |
| `src/App.jsx` | Modified | React Router v7 routes for /invite/:slug and /dashboard |
| `src/components/AnimatedBackground.jsx` | Created | SVG watercolour blobs with rAF animation |
| `src/components/Petals.jsx` | Created | Falling flower petals via Framer Motion |
| `src/components/Loader.jsx` | Created | Full-screen animated intro loader |
| `src/components/Countdown.jsx` | Created | Live countdown timer (setInterval) |
| `src/components/ScrollReveal.jsx` | Created | Framer Motion useInView scroll-in wrapper |
| `src/pages/InvitePage.jsx` | Created | Full guest-facing invitation page |
| `src/pages/Dashboard.jsx` | Created | Host dashboard with 3 tabs |
| `README.md` | Modified | Comprehensive open-source documentation |

### Architecture decisions
- All content is strictly driven by `config.json` — zero hardcoded text in components
- Supabase slug-based lookup keeps invite URLs opaque and shareable
- Petals use an infinite async animation loop instead of Framer variants to avoid stale closure issues
- Dashboard tabs use `AnimatePresence` for smooth transitions
- CSV import via PapaParse — slugs auto-generated from name + random suffix
- RLS policies are public-write for template simplicity; README advises locking down for production

## Verified
- `npm run dev` starts without errors on port 5173
- Routing works: `/` → `/dashboard`, `/invite/:slug`, `*` → `/dashboard`

---

**Date:** 2026-04-29  
**Session:** Full premium UI redesign (Stitch-assisted)

## What changed

Complete visual overhaul of both pages, driven by Stitch AI design generation.

### InvitePage.jsx (`/invite/:slug`)
- **Theme:** Deep dark luxury (`#0d0a0b` radial background) with gold shimmer accents
- **Hero:** Large Playfair Display italic names with animated gold shimmer, `&` divider with gradient lines
- **Personalised pill** with `✦` ornament and guest name in gold
- **Ornament dividers** `✦ ✦ ✦` with CSS `::before/::after` gradient lines
- **Countdown timer** rebuilt with gold shimmer numbers, muted separator colons
- **Event cards** as frosted glass (`glass-card`) with gold left-border accent, Google Maps link
- **RSVP widget** 3-step flow (Accept / Decline / Done) with gold gradient primary button
- **Footer** with phone contact and italic "With love" sign-off

### Dashboard.jsx (`/dashboard`)
- **Layout:** Fixed sidebar (240px white) + warm off-white content area (`#f6f4f1`) — all pure inline styles, zero Tailwind dependency for layout
- **Sidebar:** Gold gradient heart logo, active nav item highlighted amber on `#fff8ee`
- **Body override:** `useEffect` forces `document.body.style.background` on mount/unmount so dark invite-page body doesn't bleed in
- **Stat cards:** Colored gradient top strip (4px) + matching icon box, large bold number, DM Sans label
- **Empty state:** Dashed gold border card with 💌 emoji prompt
- **RSVP progress bar:** Thin segmented bar with green/pink/gold segments
- **Invitees table:** Warm-toned rows, status badges (pill-shaped), WhatsApp share + delete actions
- **Add/Import forms:** Warm card with gold input focus, gold gradient submit button

### index.css
- Added Manrope font (Stitch dashboard design system font)
- `.dashboard-body *` resets `-webkit-text-fill-color` so gold shimmer doesn't leak
- `body.dashboard-active` override with `!important` for hard body background reset

### Root cause of "no style" issue
The global `body { background: #0d0a0b }` was bleeding into the dashboard. Fixed via:
1. `useEffect` on Dashboard mount to set `document.body.style.background = '#f6f4f1'`
2. `.dashboard-body { background: #f6f4f1 !important }` CSS class
3. All layout using inline `style` objects rather than Tailwind classes

## Tools used
- Stitch MCP: Generated design system tokens + reference screens for both pages
- Stitch design system: "Luxury Invitation" (dark, Playfair Display, gold `#c9a96e`)
- Stitch dashboard system: "Ethereal Host" (light, Manrope, warm off-white)

---

**Date:** 2026-04-29
**Session:** Wire everlasting-union-invites UI components to Neon backend

## What changed

### New components integrated (copied from `everlasting-union-invites-main/`)
All components placed in `src/components/wedding/`:
- `HeroKerala.tsx` — dark Kerala Quranic arch hero
- `HeroWestern.tsx` — editorial typographic hero
- `HeroFusion.tsx` — left-text mandala fusion hero
- `ThemeProvider.tsx` — context + `useWeddingTheme` hook, 3 themes: `kerala` / `western` / `fusion`
- `ThemeSwitcher.tsx` — floating `Palette` button to switch themes (saved to `localStorage`)
- `CinematicLoader.tsx` — full-screen cinematic fade-in loader
- `Countdown.tsx` — live countdown from ISO date string
- `EventCard.tsx` — glass card with map link
- `RSVP.tsx` — reply card (modified — see below)
- `FloralBackdrop.tsx`, `FloralCorner.tsx`, `Petals.tsx` — decorative overlays

### `config.json` extended
Added new fields consumed by the new UI:
- `event.weddingDate` — ISO datetime for Countdown
- `event.hashtag`, `event.quote`, `event.quoteRef` — bismillah/quote section
- `schedule.event1/2.id`, `.address`, `.mapsUrl` — full address + direct Maps URL

### `RSVP.tsx` — wired to Neon (key change)
- Removed the **name input field** entirely (guest is identified by slug)
- Added `slug` + `guestName` props
- `handleSubmit` now calls `db.from('invitees').update({ status, guest_count }).eq('slug', slug)`
- Shows personalised "Dear {guestName}" in the card header
- Shows "Thank you, {guestName}!" on success

### `HeroKerala.tsx` — hardcode removed
- Replaced hardcoded `"RISVAN ⋆ WEDS ⋆ RANA"` label with `{groom.toUpperCase()} ⋆ WEDS ⋆ {bride.toUpperCase()}`

### `InvitePage.jsx` — full rewrite
- Wraps with `<ThemeProvider>` so `useWeddingTheme()` works inside
- Fetches guest by slug from Neon → passes `full_name` into personalised greeting pill + RSVP
- All text/dates strictly from `config.json` — zero hardcoding
- Renders all 3 Hero variants via `<HeroSwitcher>` (switches on theme context)
- Events rendered via imported `<EventCard>` with `config.schedule` data
- Countdown uses `event.weddingDate` ISO string
- RSVP section: shows `<RSVP slug guestName>` when guest loaded, error card if not found

### `index.css` updated
- Added Amiri + Cinzel Google Fonts (needed by `font-arabic`, `font-label`)
- Added all wedding theme CSS variables: `--cream`, `--maroon`, `--gold`, `--gold-soft`, `--blush`
- Added `[data-wedding-theme="kerala/western/fusion"]` CSS overrides
- Added `.paper-card`, `.glass-card-wedding`, `.text-gradient-gold`, `.divider-ornament`
- Added `.text-gold`, `.text-maroon`, `.text-charcoal`, `.bg-maroon` utility aliases used by the components

---

**Date:** 2026-04-29
**Session:** Complete Dashboard redesign — all features, mobile-first

## What changed

### Dashboard.jsx — full rewrite (866 lines)

**Design system:** Pure inline styles with a `C` token object, zero Tailwind dependency, `--f` Manrope font stack.

**Features added:**

| Feature | Detail |
|---|---|
| **4 tabs** | Overview · Guests · Add/Import · Settings |
| **Stat cards (5)** | Total, Attending, Pending, Declined, Total Seats — animated gradient top bar, hover lift |
| **RSVP progress bar** | Animated segmented bar (green/red/gold) + percentage readout |
| **Recent guests feed** | Avatar initials, name, seat count, status badge in Overview |
| **Welcome banner** | Couple name + event date from config.json, quick-action buttons |
| **Guest table (desktop)** | Search, status filter pills, row hover, avatar initial, Preview/WhatsApp/Delete actions |
| **Guest cards (mobile)** | Full-width card layout swaps in on ≤640px, same actions as table |
| **Search + filter** | Instant name search, per-status filter with live counts |
| **Export CSV** | Downloads all guests as CSV |
| **Preview link** | Eye icon opens `/invite/:slug` in new tab |
| **Pending badge** | Amber pill in header + sidebar count badge shows pending RSVP count |
| **Add single guest** | Name + seat stepper (1–20), unique slug auto-generated, success shows full invite URL |
| **CSV import** | Drag-and-drop or click upload, preview table, import button |
| **Settings tab** | Read-only view of all config.json values in grouped cards, with edit instructions |
| **Sidebar** | Fixed 240px, gold-heart brand, active gold highlight, pending count badge |
| **Mobile drawer** | Sidebar slides in via hamburger button, backdrop overlay to dismiss |
| **Sticky header** | Frosted glass, breadcrumb, pending bell button, refresh |
| **Last synced time** | Shows in sidebar footer after each fetch |
| **Body override** | `useEffect` sets `document.body.style.background` on mount/unmount |

---

**Date:** 2026-04-29
**Session:** InvitePage layout & theme fixes

## What changed

### index.css — wedding theme CSS sync
- Moved all utility classes (`.font-display`, `.font-arabic`, `.font-label`, `.theme-bg`, `.theme-fg`, `.theme-accent`, `.glass-card`, etc.) into `@layer utilities` so Tailwind v4 doesn't purge them
- Added missing CSS variables: `--font-display`, `--font-serif`, `--theme-arabic`, `--theme-label` in `:root`
- Synced theme variant selectors (`[data-wedding-theme="kerala/western/fusion"]`) with ThemeProvider's `data-wedding-theme` attribute on `<html>`
- Added `--background`, `--foreground`, `--muted-foreground` overrides per theme variant

### Loader.tsx — theme-aware + faster
- Changed background from `bg-background` to `var(--theme-bg)` so loader matches current theme color during exit
- Reduced display time from 3800ms to 2200ms and exit duration from 1.4s to 0.9s for snappier feel

### InvitePage.jsx — layout centering
- Added `z-10` and `isolation: isolate` to main wrapper to prevent section overlap
- Converted all section layouts to inline styles with `maxWidth: 1000/1200` and proper centering
- Increased event grid gap to 32px and min-width to 300px
- RSVP section max-width increased to 860px

### RSVP.tsx — theme-aware + spacing
- Replaced `paper-card` class with theme-aware inline style using `color-mix(var(--theme-bg), var(--theme-accent))`
- Replaced all hardcoded color classes (`text-maroon`, `text-gold`, `border-gold`) with `var(--theme-fg)` and `var(--theme-accent)`
- Increased padding to `clamp(2rem,6vw,4rem)`, increased form gaps to 28px
- Centered guest counter with `justifyContent: center` and `textAlign: center` on label
- All layout now pure inline styles (removed `mx-auto`, `flex-1`, `w-full`, `rounded-full` Tailwind classes)

### EventCard.tsx — theme-aware + spacing
- Replaced `glass-card` class with theme-aware inline style
- Replaced all hardcoded colors with theme variables
- Increased padding to `clamp(2rem,5vw,3.5rem)`, increased internal spacing (gap 14px, ornament margin 32px, address margin 28px)

### Countdown.tsx — theme-aware + spacing
- Replaced `glass-card` and `text-maroon` with theme-aware inline styles
- Increased max-width to 800px and gap to 16px for better centering

---

**Date:** 2026-04-29
**Session:** Admin Theme Selection — Admin chooses default theme, guests see it

## What changed

### neon/schema.sql — event_settings table
- Added `event_settings` table with `id=1` constraint (single row), `default_theme` column with check constraint for 'kerala'/'western'/'fusion'
- Inserted default row with 'kerala' as default

### Dashboard.jsx — Settings tab theme selector
- Added `THEMES` constant with all three theme options including preview colors and descriptions
- `SettingsTab` now fetches current default theme from `event_settings` table on mount
- Theme selector UI with clickable cards showing:
  - Color swatch preview for each theme
  - Theme name and description
  - Checkmark indicator for selected theme
- Clicking a theme immediately saves it to backend via `db.from('event_settings').update()`
- Success toast animation when saved
- Loading spinner during save

### ThemeProvider.tsx — fetch from backend
- Changed initial state to always start with 'kerala' (removed localStorage read)
- Added `useEffect` to fetch `default_theme` from `event_settings` table on mount
- Added `loading` state to context (guests see kerala theme briefly while fetching, then switches to admin's choice)
- Removed localStorage persistence — theme is now controlled by admin only

### InvitePage.jsx — removed theme picker
- Removed `ThemeSwitcher` import
- Removed `<ThemeSwitcher />` usage
- Guests can no longer switch themes — they see whatever admin chose in Dashboard

### db.js — generic SELECT and UPDATE methods
- Fixed `select()` method to work with any table (was hardcoded for `invitees` only)
- Fixed `update()` method to work with any table (was hardcoded for `invitees` only)
- Fixed bug in multi-column UPDATE where `val` was undefined in map
- Now dynamically builds queries for any table and columns
- Single-column updates use proper `sql` tagged template for safety
- Multi-column updates use `sql.unsafe` with SQL injection protection via string escaping

### Summary flow
1. Admin opens Dashboard → Settings tab
2. Sees three theme cards with Kerala selected by default
3. Clicks desired theme → saves to `event_settings` table instantly via generic UPDATE
4. Guest opens `/invite/:slug` → fetches default theme from backend
5. Invite renders with that theme, no picker visible

---

**Date:** 2026-04-29
**Session:** Netlify Migration — Serverless functions architecture

## What changed

### Netlify serverless functions
- Created `netlify/functions/guests.js` — GET /api/guests?slug=xxx for guest lookup
- Created `netlify/functions/rsvp.js` — POST /api/rsvp for RSVP submission
- Created `netlify/functions/theme.js` — GET/POST /api/theme for theme management
- Created `netlify/functions/invitees.js` — GET/POST/DELETE /api/invitees for invitees CRUD
- All functions use `@neondatabase/serverless` with `process.env.DATABASE_URL`
- Functions return standard Netlify handler format with proper CORS headers

### Netlify configuration
- Created `netlify.toml` with build config (npm run build, publish dist, functions directory)
- Added redirect: /api/* → /.netlify/functions/:splat (routes API calls to functions)
- Added redirect: /* → /index.html (fixes React Router 404 on refresh)

### Frontend API integration
- **InvitePage.jsx** — Changed from direct Neon DB to fetch(`/api/guests?slug=${slug}`)
- **RSVP.tsx** — Changed from direct Neon DB to fetch(`/api/rsvp`, { method: 'POST' })
- **Dashboard.jsx** — Changed all DB calls to /api endpoints:
  - Single add → POST /api/invitees
  - CSV import → POST /api/invitees (array)
  - Delete → DELETE /api/invitees?id=xxx
  - Fetch all → GET /api/invitees
  - Theme fetch → GET /api/theme
  - Theme save → POST /api/theme
- **ThemeProvider.tsx** — Changed from direct Neon DB to fetch(`/api/theme`)
- Removed `db` import from Dashboard, RSVP, and ThemeProvider (no longer needed client-side)

### HTML meta tags
- Updated `index.html` with Open Graph meta tags for social sharing
- Added title: "Risvan & Rana - Wedding Invitation"
- Added description, og:title, og:description, og:image (/inv.png)
- Note: Update og:url to actual Netlify deployment URL after deployment

### Environment variable
- Netlify functions use `process.env.DATABASE_URL` (not `VITE_DATABASE_URL`)
- Need to set `DATABASE_URL` in Netlify dashboard → Site settings → Environment variables

### Deployment steps
1. Push code to Git repo
2. Connect repo to Netlify
3. Set `DATABASE_URL` environment variable in Netlify dashboard
4. Deploy — Netlify will build Vite app and deploy functions
5. Update og:url in index.html to actual deployment URL
