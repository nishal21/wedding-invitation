// src/pages/Dashboard.jsx – Complete redesign: mobile-first, all features
import { useState, useEffect, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle, Clock, XCircle, Plus, Upload, Trash2,
  MessageCircle, Copy, LayoutDashboard, List, UserPlus,
  RefreshCw, Search, X, ExternalLink, Heart, ChevronDown,
  Menu, Bell, TrendingUp, Calendar, Settings, Download,
  Filter, Eye, AlertCircle, Sparkles,
} from 'lucide-react';
import config from '../data/config.json';

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function makeSlug(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}
function inviteUrl(slug) { return `${window.location.origin}/invite/${slug}`; }
function whatsappUrl(g) {
  return `https://wa.me/?text=${encodeURIComponent(`Hi ${g.full_name}! 🌸 Your personalised wedding invitation: ${inviteUrl(g.slug)}`)}`;
}
function exportCsv(invitees) {
  const rows = [['full_name','slug','status','guest_count'],
    ...invitees.map(g => [g.full_name, g.slug, g.status, g.guest_count])];
  const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'invitees.csv'; a.click();
}

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS (all inline – no Tailwind bleed)
═══════════════════════════════════════════════════════════════ */
const C = {
  bg:        '#f7f5f2',
  surface:   '#ffffff',
  border:    '#e8e4de',
  borderSoft:'#f0ece6',
  text:      '#1c1917',
  textMid:   '#6b6358',
  textSoft:  '#a89f95',
  gold:      '#c9a96e',
  goldLight: '#f5eddf',
  goldDark:  '#92700a',
  green:     '#16a34a',
  greenBg:   '#dcfce7',
  red:       '#dc2626',
  redBg:     '#fee2e2',
  amber:     '#d97706',
  amberBg:   '#fef3c7',
  purple:    '#7c3aed',
  purpleBg:  '#ede9fe',
  sidebar:   '#ffffff',
  sidebarW:  240,
};
const STATUS = {
  attending: { bg: C.greenBg,  color: C.green,  label: 'Attending' },
  declined:  { bg: C.redBg,    color: C.red,    label: 'Declined'  },
  pending:   { bg: C.amberBg,  color: C.amber,  label: 'Pending'   },
};
const ff = '"Manrope","DM Sans",sans-serif';

/* ═══════════════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════════════ */
function Badge({ status }) {
  const s = STATUS[status] ?? { bg: '#f3f0ec', color: C.textMid, label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontFamily: ff,
      fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 999,
      letterSpacing: '0.02em', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

function Spinner() {
  return <div style={{ width: 20, height: 20, border: `2px solid ${C.border}`,
    borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;
}

function StatCard({ icon: Icon, label, value, color, gradient, delta }) {
  return (
    <motion.div whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.09)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`,
        overflow: 'hidden', cursor: 'default' }}>
      <div style={{ height: 3, background: gradient }} />
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: ff, fontSize: 12, color: C.textSoft, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, marginBottom: 8 }}>{label}</p>
          <p style={{ fontFamily: ff, fontSize: 32, fontWeight: 800, color: C.text,
            lineHeight: 1, margin: 0 }}>{value}</p>
          {delta != null && (
            <p style={{ fontFamily: ff, fontSize: 11, color: delta >= 0 ? C.green : C.red,
              margin: 0, marginTop: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
              <TrendingUp size={11} />{delta >= 0 ? '+' : ''}{delta} today
            </p>
          )}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} color="#fff" />
        </div>
      </div>
    </motion.div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', style: s = {} }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
        padding: '9px 14px', fontSize: 13.5, color: C.text, fontFamily: ff,
        outline: 'none', width: '100%', transition: 'border-color 0.15s', ...s }}
      onFocus={e => e.target.style.borderColor = C.gold}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  );
}

function Btn({ children, onClick, disabled, variant = 'primary', style: s = {}, type = 'button' }) {
  const base = { fontFamily: ff, fontWeight: 700, fontSize: 13.5, borderRadius: 10,
    padding: '9px 18px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
    opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap' };
  const variants = {
    primary:  { background: `linear-gradient(135deg,${C.gold},#e8b84b)`, color: '#1a1207' },
    ghost:    { background: 'transparent', color: C.textMid },
    danger:   { background: C.redBg, color: C.red },
    success:  { background: C.greenBg, color: C.green },
    outline:  { background: C.surface, color: C.textMid, border: `1px solid ${C.border}` },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: OVERVIEW
═══════════════════════════════════════════════════════════════ */
function OverviewTab({ invitees, onNavigate }) {
  const total     = invitees.length;
  const attending = invitees.filter(g => g.status === 'attending').length;
  const declined  = invitees.filter(g => g.status === 'declined').length;
  const pending   = invitees.filter(g => g.status === 'pending').length;
  const seats     = invitees.reduce((s, g) => s + (Number(g.guest_count) || 1), 0);
  const pct       = total ? Math.round((attending / total) * 100) : 0;
  const recent    = [...invitees].slice(0, 5);
  const { couple, event } = config;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.goldLight}, #fffcf7)`,
        border: `1px solid ${C.gold}44`, borderRadius: 16, padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: ff, fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>
            {couple.person1.name} &amp; {couple.person2.name}
          </p>
          <p style={{ fontFamily: ff, fontSize: 13, color: C.textMid, margin: 0, marginTop: 3 }}>
            <Calendar size={12} style={{ display: 'inline', marginRight: 5 }} />
            {event.type} · {new Date(event.weddingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Btn variant="outline" onClick={() => onNavigate('add')} style={{ fontSize: 12 }}>
            <Plus size={13} /> Add Guest
          </Btn>
          <Btn variant="primary" onClick={() => onNavigate('invitees')} style={{ fontSize: 12 }}>
            <List size={13} /> View All
          </Btn>
        </div>
      </div>

      {/* Stat cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14 }}>
        <StatCard icon={Users}       label="Total Invited" value={total}     gradient={`linear-gradient(135deg,${C.purple},#a78bfa)`} />
        <StatCard icon={CheckCircle} label="Attending"     value={attending} gradient="linear-gradient(135deg,#16a34a,#4ade80)" />
        <StatCard icon={Clock}       label="Pending"       value={pending}   gradient={`linear-gradient(135deg,${C.gold},#fcd34d)`} />
        <StatCard icon={XCircle}     label="Declined"      value={declined}  gradient="linear-gradient(135deg,#dc2626,#f87171)" />
        <StatCard icon={Heart}       label="Total Seats"   value={seats}     gradient="linear-gradient(135deg,#db2777,#f9a8d4)" />
      </div>

      {/* RSVP progress */}
      {total > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 14, color: C.text, margin: 0 }}>RSVP Response Rate</p>
            <span style={{ fontFamily: ff, fontSize: 22, fontWeight: 800, color: C.gold }}>{pct}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 99, background: C.bg, overflow: 'hidden', display: 'flex' }}>
            {attending > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(attending/total)*100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg,#16a34a,#4ade80)', height: '100%' }} />}
            {declined > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(declined/total)*100}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg,#dc2626,#f87171)', height: '100%' }} />}
            {pending > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(pending/total)*100}%` }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              style={{ background: `linear-gradient(90deg,${C.gold},#fcd34d)`, height: '100%' }} />}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            {[['#16a34a','Attending', attending],['#dc2626','Declined', declined],[C.gold,'Pending', pending]].map(([col, lbl, val]) => (
              <span key={lbl} style={{ fontFamily: ff, fontSize: 12, color: C.textMid, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, display: 'inline-block' }} />
                {lbl} <strong style={{ color: C.text }}>{val}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent guests */}
      {recent.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.borderSoft}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 14, color: C.text, margin: 0 }}>Recent Guests</p>
            <button onClick={() => onNavigate('invitees')}
              style={{ fontFamily: ff, fontSize: 12, color: C.gold, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View all →
            </button>
          </div>
          {recent.map((g, i) => (
            <div key={g.id} style={{ padding: '12px 20px', borderBottom: i < recent.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.goldLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: ff, fontWeight: 700, fontSize: 13, color: C.goldDark }}>
                  {g.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontFamily: ff, fontSize: 13.5, fontWeight: 600, color: C.text, margin: 0 }}>{g.full_name}</p>
                  <p style={{ fontFamily: ff, fontSize: 11, color: C.textSoft, margin: 0 }}>{g.guest_count} seat{g.guest_count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <Badge status={g.status} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {total === 0 && (
        <div style={{ background: C.surface, border: `2px dashed ${C.border}`, borderRadius: 16,
          padding: '40px 24px', textAlign: 'center' }}>
          <Sparkles size={36} style={{ color: C.gold, opacity: 0.5, margin: '0 auto 12px' }} />
          <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 15, color: C.text, margin: '0 0 6px' }}>No guests yet</p>
          <p style={{ fontFamily: ff, fontSize: 13, color: C.textSoft, margin: '0 0 20px' }}>Add guests to get started</p>
          <Btn onClick={() => onNavigate('add')}><Plus size={14} /> Add First Guest</Btn>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: INVITEES
═══════════════════════════════════════════════════════════════ */
function InviteesTab({ invitees, onDelete, loading }) {
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [copied,  setCopied]  = useState(null);

  const copyLink = (slug) => {
    navigator.clipboard.writeText(inviteUrl(slug));
    setCopied(slug); setTimeout(() => setCopied(null), 2000);
  };

  const visible = invitees
    .filter(g => filter === 'all' || g.status === filter)
    .filter(g => g.full_name.toLowerCase().includes(search.toLowerCase()));

  const filters = ['all','attending','pending','declined'];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textSoft, pointerEvents: 'none' }} />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search guests…" style={{ paddingLeft: 34 }} />
          {search && <button onClick={() => setSearch('')}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: C.textSoft, padding: 2 }}>
            <X size={13} />
          </button>}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, padding: '6px 14px',
                borderRadius: 99, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: filter === f ? C.gold : C.surface,
                color: filter === f ? '#1a1207' : C.textMid,
                outline: filter !== f ? `1px solid ${C.border}` : 'none' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{ marginLeft: 5, opacity: 0.7, fontWeight: 400 }}>
                ({f === 'all' ? invitees.length : invitees.filter(g => g.status === f).length})
              </span>
            </button>
          ))}
        </div>
        <Btn variant="outline" onClick={() => exportCsv(invitees)} style={{ marginLeft: 'auto' }}>
          <Download size={13} /> Export
        </Btn>
      </div>

      {/* Table / Cards */}
      {visible.length === 0 ? (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '40px 24px', textAlign: 'center' }}>
          <Users size={32} style={{ color: C.textSoft, opacity: 0.4, margin: '0 auto 10px' }} />
          <p style={{ fontFamily: ff, fontSize: 13, color: C.textSoft, margin: 0 }}>No guests match your filters</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="dash-table" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#faf9f7', borderBottom: `1px solid ${C.border}` }}>
                  {['Guest','Status','Seats','Invite Link','Actions'].map(h => (
                    <th key={h} style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: C.textSoft,
                      letterSpacing: '0.06em', textTransform: 'uppercase', padding: '12px 16px',
                      textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((g, i) => (
                  <motion.tr key={g.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: i < visible.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                      transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#faf8f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.goldLight,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          fontFamily: ff, fontWeight: 700, fontSize: 12, color: C.goldDark }}>
                          {g.full_name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontFamily: ff, fontSize: 13.5, fontWeight: 600, color: C.text }}>{g.full_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}><Badge status={g.status} /></td>
                    <td style={{ padding: '13px 16px', fontFamily: ff, fontSize: 13, color: C.textMid }}>{g.guest_count}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <button onClick={() => copyLink(g.slug)}
                        style={{ fontFamily: ff, fontSize: 12, color: copied === g.slug ? C.green : C.gold,
                          background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Copy size={11} />
                        {copied === g.slug ? 'Copied!' : `…/${g.slug.slice(-14)}`}
                      </button>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={inviteUrl(g.slug)} target="_blank" rel="noreferrer"
                          title="Preview invite"
                          style={{ width: 30, height: 30, borderRadius: 8, background: C.purpleBg,
                            color: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            textDecoration: 'none', flexShrink: 0 }}>
                          <Eye size={13} />
                        </a>
                        <a href={whatsappUrl(g)} target="_blank" rel="noreferrer"
                          title="Share via WhatsApp"
                          style={{ width: 30, height: 30, borderRadius: 8, background: C.greenBg,
                            color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            textDecoration: 'none', flexShrink: 0 }}>
                          <MessageCircle size={13} />
                        </a>
                        <button onClick={() => onDelete(g.id)} title="Delete"
                          style={{ width: 30, height: 30, borderRadius: 8, background: C.redBg,
                            color: C.red, border: 'none', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="dash-cards" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map((g, i) => (
              <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.goldLight,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: ff, fontWeight: 700, fontSize: 14, color: C.goldDark }}>
                      {g.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 14, color: C.text, margin: 0 }}>{g.full_name}</p>
                      <p style={{ fontFamily: ff, fontSize: 11, color: C.textSoft, margin: 0 }}>{g.guest_count} seat{g.guest_count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <Badge status={g.status} />
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => copyLink(g.slug)}
                    style={{ fontFamily: ff, fontSize: 11, color: copied === g.slug ? C.green : C.gold,
                      background: C.goldLight, border: 'none', cursor: 'pointer', borderRadius: 8,
                      padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Copy size={10} />{copied === g.slug ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a href={inviteUrl(g.slug)} target="_blank" rel="noreferrer"
                    style={{ fontFamily: ff, fontSize: 11, color: C.purple, background: C.purpleBg,
                      borderRadius: 8, padding: '5px 10px', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={10} /> Preview
                  </a>
                  <a href={whatsappUrl(g)} target="_blank" rel="noreferrer"
                    style={{ fontFamily: ff, fontSize: 11, color: C.green, background: C.greenBg,
                      borderRadius: 8, padding: '5px 10px', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MessageCircle size={10} /> WhatsApp
                  </a>
                  <button onClick={() => onDelete(g.id)}
                    style={{ fontFamily: ff, fontSize: 11, color: C.red, background: C.redBg,
                      border: 'none', cursor: 'pointer', borderRadius: 8, padding: '5px 10px',
                      display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <p style={{ fontFamily: ff, fontSize: 12, color: C.textSoft, textAlign: 'right', margin: 0 }}>
            Showing {visible.length} of {invitees.length} guests
          </p>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: ADD / IMPORT
═══════════════════════════════════════════════════════════════ */
function AddImportTab({ onAdded }) {
  const [name,      setName]      = useState('');
  const [adding,    setAdding]    = useState(false);
  const [addMsg,    setAddMsg]    = useState(null);
  const [csvRows,   setCsvRows]   = useState([]);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const [dragOver,  setDragOver]  = useState(false);

  const handleSingleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true); setAddMsg(null);
    const slug = makeSlug(name.trim());
    try {
      const res = await fetch('/api/invitees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name.trim(), slug, status: 'pending', guest_count: 1 })
      });
      const { error } = await res.json();
      setAdding(false);
      if (error) { setAddMsg({ ok: false, text: `Error: ${error}` }); return; }
      setAddMsg({ ok: true, text: `✓ ${name.trim()} added! Invite: ${window.location.origin}/invite/${slug}` });
      setName(''); onAdded();
    } catch (err) {
      setAdding(false);
      setAddMsg({ ok: false, text: `Error: ${err.message}` });
    }
  };

  const parseCsv = (file) => {
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: ({ data }) => {
        const rows = data.filter(r => r.full_name?.trim()).map(r => ({
          full_name: r.full_name.trim(),
          slug: r.slug?.trim() || makeSlug(r.full_name.trim()),
          status: 'pending',
          guest_count: parseInt(r.guest_count, 10) || 1,
        }));
        setCsvRows(rows); setImportMsg(null);
      },
    });
  };

  const handleFile = (e) => { if (e.target.files?.[0]) parseCsv(e.target.files[0]); e.target.value = ''; };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) parseCsv(e.dataTransfer.files[0]); };

  const handleBulkImport = async () => {
    if (!csvRows.length) return;
    setImporting(true); setImportMsg(null);
    const res = await fetch('/api/invitees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(csvRows)
    });
    const { error } = await res.json();
    setImporting(false);
    if (error) { setImportMsg({ ok: false, text: `Error: ${error.message}` }); return; }
    setImportMsg({ ok: true, text: `✓ ${csvRows.length} guests imported!` });
    setCsvRows([]); onAdded();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>

      {/* Single add */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.goldLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={16} style={{ color: C.goldDark }} />
          </div>
          <div>
            <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 14, color: C.text, margin: 0 }}>Add Single Guest</p>
            <p style={{ fontFamily: ff, fontSize: 11, color: C.textSoft, margin: 0 }}>A unique invite link will be generated</p>
          </div>
        </div>
        <form onSubmit={handleSingleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, color: C.textMid,
              textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Full Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah & Ahmed" />
          </div>
          <Btn type="submit" disabled={adding || !name.trim()} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            <Plus size={14} />{adding ? 'Adding…' : 'Add Guest'}
          </Btn>
        </form>
        {addMsg && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10,
            background: addMsg.ok ? C.greenBg : C.redBg, wordBreak: 'break-all' }}>
            <p style={{ fontFamily: ff, fontSize: 12, color: addMsg.ok ? C.green : C.red, margin: 0 }}>{addMsg.text}</p>
          </div>
        )}
      </div>

      {/* CSV import */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fce7f3',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={16} style={{ color: '#db2777' }} />
          </div>
          <div>
            <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 14, color: C.text, margin: 0 }}>Bulk Import via CSV</p>
            <p style={{ fontFamily: ff, fontSize: 11, color: C.textSoft, margin: 0 }}>Required column: <code style={{ background: C.bg, padding: '1px 5px', borderRadius: 4 }}>full_name</code></p>
          </div>
        </div>

        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '28px 16px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
            border: `2px dashed ${dragOver ? C.gold : C.border}`,
            background: dragOver ? C.goldLight : C.bg }}>
          <Upload size={24} style={{ color: dragOver ? C.goldDark : C.textSoft }} />
          <p style={{ fontFamily: ff, fontSize: 13, color: C.textMid, margin: 0, textAlign: 'center' }}>
            Drop CSV here or <span style={{ color: C.gold, fontWeight: 600 }}>click to browse</span>
          </p>
          <p style={{ fontFamily: ff, fontSize: 11, color: C.textSoft, margin: 0 }}>Optional columns: guest_count, slug</p>
          <input type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} />
        </label>

        {csvRows.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: C.textMid, margin: 0 }}>
                {csvRows.length} guests ready
              </p>
              <button onClick={() => setCsvRows([])}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSoft }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ maxHeight: 160, overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: 10 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead style={{ background: '#faf9f7', position: 'sticky', top: 0 }}>
                  <tr>
                    {['Name','Guests'].map(h => (
                      <th key={h} style={{ fontFamily: ff, fontSize: 10, fontWeight: 700, color: C.textSoft,
                        textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.borderSoft}` }}>
                      <td style={{ padding: '7px 12px', fontFamily: ff, color: C.text }}>{r.full_name}</td>
                      <td style={{ padding: '7px 12px', fontFamily: ff, color: C.textMid }}>{r.guest_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Btn onClick={handleBulkImport} disabled={importing}
              style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
              <Upload size={13} />{importing ? 'Importing…' : `Import ${csvRows.length} Guests`}
            </Btn>
          </div>
        )}
        {importMsg && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10,
            background: importMsg.ok ? C.greenBg : C.redBg }}>
            <p style={{ fontFamily: ff, fontSize: 12, color: importMsg.ok ? C.green : C.red, margin: 0 }}>{importMsg.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: SETTINGS
═══════════════════════════════════════════════════════════════ */
const THEMES = [
  { id: 'kerala',  label: 'Kerala Quranic',     desc: 'Sacred arch with Bismillah — deep green & gold', color: '#0d2b1f' },
  { id: 'western', label: 'Western Editorial',  desc: 'Vogue minimalist — cream & elegant typography', color: '#f5f0e8' },
  { id: 'fusion',  label: 'Global Fusion',      desc: 'Mandala geometry — navy & contemporary', color: '#0f172a' },
];

function SettingsTab() {
  const { couple, event, schedule } = config;
  const [defaultTheme, setDefaultTheme] = useState('kerala');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchTheme() {
      const res = await fetch('/api/theme');
      const { data, error } = await res.json();
      if (!error && data?.default_theme) setDefaultTheme(data.default_theme);
    }
    fetchTheme();
  }, []);

  async function handleSaveTheme(themeId) {
    setSaving(true);
    const res = await fetch('/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ default_theme: themeId })
    });
    const { data, error } = await res.json();
    console.log('[Theme Save]', { themeId, data, error });
    if (error) {
      console.error('[Theme Save Error]', error);
      alert('Failed to save theme. Check console for details.');
      setSaving(false);
      return;
    }
    setDefaultTheme(themeId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>
      {/* Theme Selection Card */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', background: `linear-gradient(90deg, ${C.goldLight}, transparent)`, borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 13, color: C.text, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} style={{ color: C.gold }} /> Default Invitation Theme
          </p>
        </div>
        <div style={{ padding: '18px' }}>
          <p style={{ fontFamily: ff, fontSize: 12, color: C.textMid, margin: '0 0 14px' }}>
            Choose the theme guests see when they open their invitation link. This applies to all invitees.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSaveTheme(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, border: `2px solid ${defaultTheme === t.id ? C.gold : C.border}`,
                  background: defaultTheme === t.id ? C.goldLight : C.bg,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10, background: t.color,
                  border: `2px solid ${defaultTheme === t.id ? C.gold : 'transparent'}`,
                  boxShadow: defaultTheme === t.id ? `0 0 0 2px ${C.goldLight}` : 'none',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 13, color: C.text, margin: '0 0 2px' }}>{t.label}</p>
                  <p style={{ fontFamily: ff, fontSize: 11, color: C.textMid, margin: 0 }}>{t.desc}</p>
                </div>
                {defaultTheme === t.id && (
                  <CheckCircle size={18} style={{ color: C.gold, flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>
          {saved && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 12, padding: '8px 12px', background: C.greenBg, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: C.green }} />
              <span style={{ fontFamily: ff, fontSize: 12, color: C.green }}>Default theme saved</span>
            </motion.div>
          )}
          {saving && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Spinner />
              <span style={{ fontFamily: ff, fontSize: 12, color: C.textSoft }}>Saving...</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: C.amberBg, border: `1px solid ${C.amber}44`, borderRadius: 12, padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertCircle size={16} style={{ color: C.amber, flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontFamily: ff, fontSize: 12.5, color: C.text, margin: 0 }}>
          To update event details (names, dates, venues), edit <strong>src/data/config.json</strong> in your project. Changes take effect after saving the file.
        </p>
      </div>

      {[
        { label: 'Couple', rows: [
          ['Person 1', couple.person1.name],
          ['Person 1 Parents', couple.person1.parents],
          ['Person 2', couple.person2.name],
          ['Person 2 Parents', couple.person2.parents],
        ]},
        { label: 'Event', rows: [
          ['Type', event.type],
          ['Wedding Date', event.weddingDate],
          ['Hashtag', event.hashtag],
          ['Contact', event.contact],
          ['Hosts', event.primaryHosts],
        ]},
        { label: 'Ceremony', rows: [
          ['Title', schedule.event1.title],
          ['Date', schedule.event1.date],
          ['Time', schedule.event1.time],
          ['Venue', schedule.event1.venue],
          ['Address', schedule.event1.address],
        ]},
        { label: 'Reception', rows: [
          ['Title', schedule.event2.title],
          ['Date', schedule.event2.date],
          ['Time', schedule.event2.time],
          ['Venue', schedule.event2.venue],
          ['Address', schedule.event2.address],
        ]},
      ].map(({ label, rows }) => (
        <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', background: '#faf9f7', borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: ff, fontWeight: 700, fontSize: 13, color: C.text, margin: 0 }}>{label}</p>
          </div>
          <div>
            {rows.map(([k, v]) => (
              <div key={k} style={{ padding: '11px 18px', display: 'flex', gap: 16, alignItems: 'flex-start',
                borderBottom: `1px solid ${C.borderSoft}`, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: C.textSoft,
                  textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 130, flexShrink: 0 }}>{k}</span>
                <span style={{ fontFamily: ff, fontSize: 13, color: C.text, wordBreak: 'break-word' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'overview',  label: 'Overview',    icon: LayoutDashboard },
  { id: 'invitees',  label: 'Guests',      icon: List            },
  { id: 'add',       label: 'Add / Import',icon: UserPlus        },
  { id: 'settings',  label: 'Settings',    icon: Settings        },
];

export default function Dashboard() {
  const [tab,      setTab]      = useState('overview');
  const [invitees, setInvitees] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sideOpen, setSideOpen] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const fetchInvitees = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/invitees');
    const { data, error } = await res.json();
    if (!error) { setInvitees(data ?? []); setLastSync(new Date()); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchInvitees(); }, [fetchInvitees]);

  useEffect(() => {
    document.body.style.background = C.bg;
    document.body.style.color = C.text;
    return () => { document.body.style.background = ''; document.body.style.color = ''; };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Remove this guest?')) return;
    await fetch(`/api/invitees?id=${id}`, { method: 'DELETE' });
    setInvitees(prev => prev.filter(g => g.id !== id));
  };

  const navigate = (t) => { setTab(t); setSideOpen(false); };

  const pending = invitees.filter(g => g.status === 'pending').length;

  return (
    <>
      {/* Global styles injected once */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-table { display: block; }
        .dash-cards  { display: none; }
        @media (max-width: 640px) {
          .dash-table { display: none !important; }
          .dash-cards { display: flex !important; }
        }
        .dash-overlay { display: none; }
        @media (max-width: 768px) {
          .dash-overlay { display: block; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', fontFamily: ff }}>

        {/* Mobile overlay */}
        {sideOpen && (
          <div className="dash-overlay"
            onClick={() => setSideOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }} />
        )}

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <aside style={{
          width: C.sidebarW, flexShrink: 0,
          background: C.sidebar, borderRight: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
          transform: sideOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.25s ease',
        }}
        className={sideOpen ? '' : 'dash-sidebar'}>
          {/* Brand */}
          <div style={{ padding: '18px 16px', borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg,${C.gold},#fffff)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img width="64" height="64" src="https://img.icons8.com/glyph-neue/64/newlyweds.png" alt="newlyweds"/>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, fontSize: 13.5, color: C.text, margin: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {config.couple.person1.name} &amp; {config.couple.person2.name}
              </p>
              <p style={{ fontSize: 10.5, color: C.textSoft, margin: 0, marginTop: 1 }}>Host Dashboard</p>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => navigate(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '9px 12px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', width: '100%', textAlign: 'left',
                  transition: 'all 0.15s',
                  background: active ? C.goldLight : 'transparent',
                  color: active ? C.goldDark : C.textMid,
                  fontWeight: active ? 700 : 500, fontSize: 13.5,
                  position: 'relative',
                }}>
                  <Icon size={15} style={{ color: active ? C.gold : C.textSoft, flexShrink: 0 }} />
                  {label}
                  {id === 'invitees' && pending > 0 && (
                    <span style={{ marginLeft: 'auto', background: C.gold, color: '#1a1207',
                      borderRadius: 99, fontSize: 10, fontWeight: 700, padding: '1px 7px', flexShrink: 0 }}>
                      {pending}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Refresh + stats */}
          <div style={{ padding: '10px 8px 16px', borderTop: `1px solid ${C.border}` }}>
            <button onClick={fetchInvitees}
              style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%',
                padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'transparent', color: C.textSoft, fontSize: 12.5, fontFamily: ff }}>
              <RefreshCw size={13} style={{ color: C.gold }} /> Refresh data
            </button>
            {lastSync && (
              <p style={{ fontFamily: ff, fontSize: 10.5, color: C.textSoft, margin: '6px 12px 0',
                display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={10} style={{ color: C.green }} />
                Synced {lastSync.toLocaleTimeString()}
              </p>
            )}
          </div>
        </aside>

        {/* ── MAIN AREA ────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh',
          marginLeft: C.sidebarW, transition: 'margin-left 0.25s' }}
          className="dash-main">

          {/* Header */}
          <header style={{ position: 'sticky', top: 0, zIndex: 30, padding: '0 20px',
            background: `${C.surface}f0`, backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${C.border}`, height: 58,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            {/* Mobile menu button */}
            <button onClick={() => setSideOpen(o => !o)}
              className="dash-menuBtn"
              style={{ display: 'none', padding: 6, border: 'none', background: 'none',
                cursor: 'pointer', borderRadius: 8, color: C.text }}>
              <Menu size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              {/* Breadcrumb */}
              <span style={{ fontFamily: ff, fontSize: 11, color: C.textSoft }}>Dashboard</span>
              <span style={{ color: C.border }}>/</span>
              <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 700, color: C.text,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {TABS.find(t => t.id === tab)?.label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {pending > 0 && (
                <button onClick={() => navigate('invitees')}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                    borderRadius: 99, background: C.amberBg, border: 'none', cursor: 'pointer',
                    fontFamily: ff, fontSize: 11.5, fontWeight: 600, color: C.amber }}>
                  <Bell size={12} />{pending} pending
                </button>
              )}
              <Btn variant="outline" onClick={fetchInvitees} style={{ padding: '6px 12px', fontSize: 12 }}>
                <RefreshCw size={12} />
                <span className="dash-refreshLabel">Refresh</span>
              </Btn>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, padding: '24px 20px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
            <AnimatePresence mode="wait">
              <motion.div key={tab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                {tab === 'overview' && <OverviewTab invitees={invitees} onNavigate={navigate} />}
                {tab === 'invitees' && <InviteesTab invitees={invitees} onDelete={handleDelete} loading={loading} />}
                {tab === 'add'      && <AddImportTab onAdded={() => { fetchInvitees(); setTab('invitees'); }} />}
                {tab === 'settings' && <SettingsTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .dash-sidebar { transform: translateX(-${C.sidebarW}px) !important; }
          .dash-main    { margin-left: 0 !important; }
          .dash-menuBtn { display: flex !important; }
        }
        @media (max-width: 480px) {
          .dash-refreshLabel { display: none; }
        }
      `}</style>
    </>
  );
}
