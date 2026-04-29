-- ============================================================
-- Invitation App – Neon Postgres Schema
-- Run this entire file in your Neon SQL Editor (console.neon.tech)
-- to set up the required database table for the application.
-- ============================================================

-- Enable pgcrypto for UUID generation (available on Neon by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Table: invitees
-- Stores every invited guest together with their RSVP state.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invitees (
  -- Unique row identifier – automatically generated
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Guest's full display name shown on the invitation
  full_name    TEXT        NOT NULL,

  -- URL-safe unique token used in /invite/:slug
  -- Example: "alice-johnson-abc12"
  slug         TEXT        NOT NULL UNIQUE,

  -- RSVP state: one of 'pending' | 'attending' | 'declined'
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'attending', 'declined')),

  -- How many people the guest is bringing (including themselves)
  -- Set to 0 when declined, >= 1 when attending
  guest_count  INTEGER     NOT NULL DEFAULT 1 CHECK (guest_count >= 0),

  -- Row creation timestamp (UTC)
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Index: fast slug lookups (used by every /invite/:slug page load)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS invitees_slug_idx ON invitees (slug);

-- ------------------------------------------------------------
-- Table: event_settings
-- Stores event-wide configuration (single row, id=1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_settings (
  id           INTEGER     PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  default_theme TEXT       NOT NULL DEFAULT 'kerala'
                           CHECK (default_theme IN ('kerala', 'western', 'fusion')),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO event_settings (id, default_theme) VALUES (1, 'kerala')
ON CONFLICT (id) DO NOTHING;
