# 💌 Digital Invitation App — Open-Source Template

A beautiful, fully customisable digital invitation web application built with
React, Neon (serverless Postgres), Netlify Functions, and Framer Motion. Fork it,
edit one JSON file, and you have a personalised invitation site for any event.

---

## ✨ Features

| Feature | Detail |
|---|---|
| Personalised invite pages | `/invite/:slug` — guest's name fetched from database |
| Three theme options | Kerala (Quranic), Western (Editorial), Fusion (Global) |
| Admin theme selection | Host chooses default theme from Dashboard Settings |
| Animated background | Soft drifting watercolour blobs (SVG + rAF) |
| Falling petals | Framer Motion petal rain across the full page |
| Live countdown | Real-time counter to the event date |
| Scroll animations | Every section animates in with `useInView` |
| Event cards | Tap to open Google Maps directions |
| RSVP with confirmation | Yes/No → guest count → confirmation modal, saved to database |
| Host dashboard | Overview stats, full invitee table, WhatsApp share |
| CSV bulk import | Upload a guest list CSV → slugs auto-generated |
| Config-driven content | **All text lives in `src/data/config.json`** |
| Serverless API | Netlify Functions for secure database operations |

---

## 🛠 Tech Stack

- **React 19** — UI framework  
- **Vite 8** — Build tool  
- **Tailwind CSS v4** — Utility-first styling  
- **Framer Motion 12** — Animations  
- **React Router v7** — Client-side routing  
- **Neon** — Serverless Postgres database  
- **Netlify Functions** — Serverless API endpoints  
- **PapaParse** — CSV parsing  
- **Lucide React** — Icon set  

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/invitation-app.git
cd invitation-app
npm install
```

### 2. Set up Neon Database

1. Create a free project at [neon.tech](https://neon.tech).
2. Open the **SQL Editor** in your Neon console.
3. Paste and run the entire contents of `neon/schema.sql`.  
   This creates the `invitees` and `event_settings` tables.

### 3. Deploy to Netlify

1. Push your code to GitHub.
2. Go to [Netlify](https://netlify.com) and click "Add new site → Import from Git".
3. Connect your GitHub repository.
4. **Important:** Set environment variable:
   - Go to Site settings → Environment variables
   - Add `DATABASE_URL` with your Neon connection string
   - Find this in Neon under **Connection Details → Connection string**
   - Use the **Pooled connection** variant

5. Deploy! Netlify will:
   - Build the Vite app
   - Deploy the serverless functions
   - Configure routing automatically

### 4. Update Meta Tags

After deployment, update `index.html` with your actual details for social sharing:

```html
<title>Your Names - Wedding Invitation</title>
<meta name="title" content="Your Names - Wedding Invitation">
<meta name="description" content="Your custom description here">

<meta property="og:url" content="https://your-site.netlify.app">
<meta property="og:title" content="Your Names - Wedding Invitation">
<meta property="og:description" content="Your custom description here">
<meta property="og:image" content="https://your-site.netlify.app/your-image.png">
```

**What to update:**
- `<title>` — Couple names
- `og:title` — Couple names
- `og:description` — Custom invitation description
- `og:url` — Your actual Netlify deployment URL
- `og:image` — Your actual Netlify deployment URL + `/inv.png` (must be absolute URL for social sharing)

**Note:** Place your custom invitation image at `public/inv.png` for the social preview.

---

## 🎨 Customising Your Invitation

**You only need to edit one file: `src/data/config.json`.**

```json
{
  "event": {
    "type": "Wedding Ceremony & Reception",
    "primaryHosts": "The Smith Family",
    "contact": "+1 (555) 123-4567",
    "tagline": "Join us to celebrate a new beginning",
    "weddingDate": "2026-12-31T10:00:00",
    "mapsUrl": "https://maps.google.com/?q=Grand+Plaza+Hotel"
  },
  "couple": {
    "person1": { "name": "Alex", "parents": "Child of John & Mary" },
    "person2": { "name": "Sam",  "parents": "Child of David & Sarah" }
  },
  "schedule": {
    "ceremony": {
      "title": "Main Ceremony",
      "date": "December 31, 2026",
      "time": "10:00 AM",
      "venue": "Grand Plaza Hotel",
      "mapQuery": "Grand+Plaza+Hotel"
    },
    "reception": {
      "title": "Evening Reception",
      "date": "December 31, 2026",
      "time": "7:00 PM",
      "venue": "Sunset Gardens",
      "mapQuery": "Sunset+Gardens"
    }
  }
}
```

| Field | Purpose |
|---|---|
| `event.type` | Displayed as the event subtitle |
| `event.primaryHosts` | Shown in the hero and footer |
| `event.contact` | Clickable phone number in the footer |
| `event.tagline` | Italic subtitle under the couple names |
| `event.weddingDate` | ISO date string for countdown timer |
| `couple.person1/2.name` | Large hero names |
| `couple.person1/2.parents` | Displayed under each name |
| `schedule.eventN.date` | Event date for display |
| `schedule.eventN.mapQuery` | URL-encoded query sent to Google Maps |

> **Tip:** Add or remove events by adding/removing keys under `schedule`.
> The UI renders all of them automatically.

---

## 👥 Managing Guests

### Dashboard

Navigate to `/dashboard` to:
- View RSVP stats and progress
- See all invitees with their status
- Copy invite links
- Share invitations via WhatsApp
- Add guests individually or via CSV
- **Settings tab** — Choose default theme for all invitations

### CSV Format

Upload a file with at least a `full_name` column:

```csv
full_name,guest_count
Alice Johnson,2
Bob Smith,1
Carol Williams,3
```

Slugs are auto-generated if not provided.

### Sharing an Invite

Each guest gets a unique URL:

```
https://your-site.netlify.app/invite/alice-johnson-abc12
```

Share this link directly or use the **WhatsApp** button in the dashboard
to send a pre-filled message.

---

## 🎨 Theme System

The app includes three beautiful themes:

| Theme | Style | Best For |
|---|---|---|
| **Kerala** | Quranic, gold accents, traditional | Muslim weddings, cultural events |
| **Western** | Editorial, minimalist, Vogue-style | Modern weddings, formal events |
| **Fusion** | Global couture, bold colors | Multi-cultural celebrations |

**How it works:**
1. Admin goes to Dashboard → Settings tab
2. Selects a theme (Kerala, Western, or Fusion)
3. Theme is saved to database as default
4. All guests see the selected theme automatically
5. Guests cannot change themes (admin-controlled only)

---

## 📁 Project Structure

```
src/
├── components/
│   └── wedding/
│       ├── ThemeProvider.tsx     # Theme context + backend fetch
│       ├── HeroKerala.tsx        # Kerala theme hero
│       ├── HeroWestern.tsx       # Western theme hero
│       ├── HeroFusion.tsx        # Fusion theme hero
│       ├── Countdown.tsx         # Live countdown timer
│       ├── EventCard.tsx         # Event info cards
│       ├── RSVP.tsx              # RSVP form with confirmation
│       ├── Loader.tsx            # Cinematic intro loader
│       └── FloralBackdrop.tsx    # Animated background
├── data/
│   └── config.json               # ← Edit this to customise your event
├── pages/
│   ├── Dashboard.jsx             # Host management dashboard
│   └── InvitePage.jsx            # Guest invitation page
├── App.jsx                       # Route definitions
├── index.css                     # Global styles + Tailwind
└── main.jsx                      # React root

netlify/
└── functions/
    ├── guests.js                 # GET /api/guests?slug=xxx
    ├── rsvp.js                   # POST /api/rsvp
    ├── theme.js                  # GET/POST /api/theme
    └── invitees.js              # GET/POST/DELETE /api/invitees

neon/
└── schema.sql                    # Database setup script
```

---

## 🔌 API Endpoints

The app uses Netlify Functions for all database operations:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/guests?slug=xxx` | GET | Fetch guest by slug |
| `/api/rsvp` | POST | Submit RSVP response |
| `/api/theme` | GET | Fetch default theme |
| `/api/theme` | POST | Update default theme (admin) |
| `/api/invitees` | GET | Fetch all invitees |
| `/api/invitees` | POST | Add new invitee(s) |
| `/api/invitees?id=xxx` | DELETE | Delete invitee |

---

## 🌐 Deployment

This app is designed for **Netlify** deployment:

1. Push code to GitHub
2. Connect repo to Netlify
3. Set `DATABASE_URL` environment variable
4. Deploy automatically

The `netlify.toml` file handles:
- Build configuration (`npm run build`)
- API routing (`/api/*` → functions)
- SPA routing (all routes → `index.html`)

---

## 📄 License

MIT — free to use, fork, and modify.
