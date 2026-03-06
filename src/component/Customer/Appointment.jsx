"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────
   Design tokens — warm luxury palette
───────────────────────────────────────── */
const T = {
  cream:       '#FAF7F2',
  warm50:      '#F5EFE6',
  warm100:     '#EBE0D0',
  warm200:     '#D9C9B4',
  amber:       '#C9973A',
  amberD:      '#A67C28',
  amberPale:   'rgba(201,151,58,0.10)',
  amberBorder: 'rgba(201,151,58,0.22)',
  cocoa:       '#3D2B1F',
  cocoaMid:    '#5C3D2A',
  cocoaLt:     '#6B4C3B',
  mist:        '#9A8C82',
  glass:       'rgba(255,255,255,0.82)',
  glassSolid:  'rgba(255,255,255,0.96)',
  shadowSm:    '0 2px 10px rgba(61,43,31,0.07)',
  shadowMd:    '0 8px 28px rgba(61,43,31,0.11)',
  shadowAmber: '0 6px 22px rgba(201,151,58,0.28)',
};

/* ─────────────────────────────────────────
   Status config
───────────────────────────────────────── */
const STATUS = {
  pending: {
    label: 'Pending',
    dot:   '#F5A623',
    bg:    'rgba(245,166,35,0.10)',
    text:  '#A67C28',
    border:'rgba(245,166,35,0.22)',
  },
  confirmed: {
    label: 'Confirmed',
    dot:   '#34A85C',
    bg:    'rgba(52,168,92,0.10)',
    text:  '#1E7A3E',
    border:'rgba(52,168,92,0.22)',
  },
  completed: {
    label: 'Completed',
    dot:   '#4A90D9',
    bg:    'rgba(74,144,217,0.10)',
    text:  '#2563A8',
    border:'rgba(74,144,217,0.22)',
  },
  rejected: {
    label: 'Rejected',
    dot:   '#E05252',
    bg:    'rgba(224,82,82,0.10)',
    text:  '#B83232',
    border:'rgba(224,82,82,0.22)',
  },
};

/* ─────────────────────────────────────────
   Sample data
───────────────────────────────────────── */
const sampleAppointments = [
  { id:1, salon:'Luxury Hair Studio',    service:'Premium Haircut & Styling',    status:'confirmed', date:'2023-06-15', time:'10:30 AM', price:'$65' },
  { id:2, salon:'Beauty Nails Spa',      service:'Deluxe Manicure & Pedicure',   status:'pending',   date:'2023-06-16', time:'2:00 PM',  price:'$45' },
  { id:3, salon:'Royal Massage Center',  service:'60min Deep Tissue Massage',    status:'completed', date:'2023-06-10', time:'4:30 PM',  price:'$85' },
  { id:4, salon:'Elite Barber Shop',     service:'Beard Trim & Shave',           status:'rejected',  date:'2023-06-18', time:'11:00 AM', price:'$30' },
  { id:5, salon:'Glamour Beauty Lounge', service:'Full Face Makeup',             status:'confirmed', date:'2023-06-20', time:'3:45 PM',  price:'$55' },
  { id:6, salon:'Organic Skin Care',     service:'Facial Treatment',             status:'pending',   date:'2023-06-22', time:'9:15 AM',  price:'$75' },
];

/* ─────────────────────────────────────────
   Inline styles
───────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

    /* ── filter pills ── */
    .ap-pill {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 6px 14px;
      border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 500;
      letter-spacing: 0.02em;
      cursor: pointer; border: none;
      transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
      white-space: nowrap;
    }
    .ap-pill:hover { transform: translateY(-1px); }
    .ap-pill-inactive {
      background: rgba(61,43,31,0.06);
      color: ${T.cocoaLt};
    }
    .ap-pill-inactive:hover {
      background: rgba(61,43,31,0.10);
    }

    /* ── appointment card ── */
    .ap-card {
      background: ${T.glassSolid};
      border: 1px solid rgba(235,224,208,0.8);
      border-radius: 18px;
      padding: 20px 22px;
      transition: box-shadow 0.22s, transform 0.18s, border-color 0.2s;
      cursor: default;
      position: relative;
      overflow: hidden;
    }
    .ap-card:hover {
      box-shadow: ${T.shadowMd};
      border-color: ${T.amberBorder};
      transform: translateY(-3px);
    }
    .ap-card::before {
      content: '';
      position: absolute; top: 0; left: 0;
      width: 3px; height: 100%;
      border-radius: 3px 0 0 3px;
      transition: opacity 0.2s;
    }

    /* ── action buttons ── */
    .ap-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 500;
      cursor: pointer; border: none;
      transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
    }
    .ap-btn:hover { transform: translateY(-1px); }

    .ap-btn-primary {
      background: linear-gradient(135deg, ${T.amber} 0%, ${T.amberD} 100%);
      color: #FFF8EE;
      box-shadow: ${T.shadowAmber};
    }
    .ap-btn-primary:hover {
      box-shadow: 0 10px 28px rgba(201,151,58,0.38);
    }

    .ap-btn-cancel {
      background: rgba(61,43,31,0.06);
      color: ${T.cocoaLt};
      border: 1px solid rgba(61,43,31,0.1);
    }
    .ap-btn-cancel:hover {
      background: rgba(224,82,82,0.08);
      color: #B83232;
      border-color: rgba(224,82,82,0.2);
    }

    /* ── meta chip ── */
    .ap-meta {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px;
      background: ${T.amberPale};
      border: 1px solid ${T.amberBorder};
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 400;
      color: ${T.cocoaLt};
    }

    /* ── view toggle ── */
    .ap-toggle {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 6px 12px;
      border-radius: 10px;
      background: ${T.amberPale};
      border: 1px solid ${T.amberBorder};
      color: ${T.amberD};
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 500;
      cursor: pointer;
      transition: background 0.18s, box-shadow 0.18s;
    }
    .ap-toggle:hover {
      background: rgba(201,151,58,0.16);
      box-shadow: 0 2px 10px rgba(201,151,58,0.15);
    }

    /* ── divider ── */
    .ap-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${T.warm100}, transparent);
      margin: 18px 0;
    }

    /* ── count badge ── */
    .ap-count {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 20px; height: 20px;
      background: ${T.amberPale};
      border: 1px solid ${T.amberBorder};
      border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 600;
      color: ${T.amberD};
      padding: 0 5px;
    }

    /* ── empty state ── */
    .ap-empty {
      display: flex; flex-direction: column; align-items: center;
      padding: 60px 24px;
      text-align: center;
    }

    /* ── scroll container for pills ── */
    .ap-pills-scroll {
      display: flex; gap: 6px; flex-wrap: wrap;
    }
    @media(max-width:600px) {
      .ap-pills-scroll {
        flex-wrap: nowrap; overflow-x: auto;
        padding-bottom: 4px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .ap-pills-scroll::-webkit-scrollbar { display: none; }
    }
  `}</style>
);

/* ─────────────────────────────────────────
   SVG Icons (inline, no external dep)
───────────────────────────────────────── */
const IconCalendar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClock = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
  </svg>
);
const IconScissors = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);
const IconX = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconChevronDown = ({ size = 13, flip = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: flip ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconTag = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const IconMapPin = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

/* ─────────────────────────────────────────
   Status badge
───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 100,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      color: cfg.text,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: cfg.dot, flexShrink: 0,
        boxShadow: `0 0 0 2px ${cfg.dot}30`,
      }}/>
      {cfg.label}
    </span>
  );
};

/* ─────────────────────────────────────────
   Filter pill
───────────────────────────────────────── */
const FILTERS = [
  { key: 'all',       label: 'All',       dot: T.cocoa      },
  { key: 'pending',   label: 'Pending',   dot: '#F5A623'    },
  { key: 'confirmed', label: 'Confirmed', dot: '#34A85C'    },
  { key: 'completed', label: 'Completed', dot: '#4A90D9'    },
  { key: 'rejected',  label: 'Rejected',  dot: '#E05252'    },
];

const FilterPill = ({ cfg, active, onClick, count }) => {
  const isActive = active;
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      className={`ap-pill ${isActive ? '' : 'ap-pill-inactive'}`}
      onClick={onClick}
      style={isActive ? {
        background: cfg.key === 'all'
          ? `linear-gradient(135deg, ${T.amber}, ${T.amberD})`
          : STATUS[cfg.key]
            ? `linear-gradient(135deg, ${STATUS[cfg.key].dot}, ${STATUS[cfg.key].dot}cc)`
            : `linear-gradient(135deg, ${T.amber}, ${T.amberD})`,
        color: '#FFF8EE',
        boxShadow: cfg.key === 'all' ? T.shadowAmber : `0 4px 14px ${cfg.dot}44`,
      } : {}}
    >
      {isActive && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)', flexShrink: 0,
        }}/>
      )}
      {cfg.label}
      {count > 0 && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          minWidth: 16, height: 16, borderRadius: 100,
          background: isActive ? 'rgba(255,255,255,0.25)' : T.amberPale,
          color: isActive ? '#FFF8EE' : T.amberD,
          fontSize: 9, fontWeight: 700, padding: '0 4px',
        }}>
          {count}
        </span>
      )}
    </motion.button>
  );
};

/* ─────────────────────────────────────────
   Appointment Card
───────────────────────────────────────── */
const AppointmentCard = ({ appointment, showActions = false, onCancel, index = 0 }) => {
  const cfg = STATUS[appointment.status] || STATUS.pending;
  const dateObj = new Date(appointment.date);
  const dayNum  = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
  const month   = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <motion.div
      className="ap-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22,1,0.36,1] }}
      style={{ '--accent': cfg.dot }}
    >
      {/* left accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 3, height: '100%',
        background: `linear-gradient(180deg, ${cfg.dot}, ${cfg.dot}88)`,
        borderRadius: '18px 0 0 18px',
      }}/>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* date block */}
        <div style={{
          flexShrink: 0,
          width: 52, height: 58,
          background: T.amberPale,
          border: `1px solid ${T.amberBorder}`,
          borderRadius: 14,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 2,
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.1em',
            color: T.amberD,
            textTransform: 'uppercase',
          }}>{month}</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24, fontWeight: 700, lineHeight: 1,
            color: T.cocoa,
          }}>{dayNum}</span>
        </div>

        {/* main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <IconMapPin size={12} color={T.mist} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: T.mist,
                }}>
                  {appointment.salon}
                </span>
              </div>
              <h4 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18, fontWeight: 600,
                color: T.cocoa, margin: 0, lineHeight: 1.2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {appointment.service}
              </h4>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          {/* meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span className="ap-meta">
              <IconClock size={11} />
              {appointment.time}
            </span>
            <span className="ap-meta">
              <IconTag size={11} />
              {appointment.price}
            </span>
          </div>
        </div>
      </div>

      {/* actions */}
      {showActions && (appointment.status === 'confirmed' || appointment.status === 'pending') && (
        <>
          <div className="ap-divider" style={{ marginTop: 16, marginBottom: 14 }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} className="ap-btn ap-btn-primary">
              <IconCalendar size={12} /> Reschedule
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              className="ap-btn ap-btn-cancel"
              onClick={onCancel}
            >
              <IconX size={12} /> Cancel
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   Empty state
───────────────────────────────────────── */
const EmptyState = ({ filter }) => (
  <div className="ap-empty">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={{
        width: 72, height: 72, borderRadius: 22,
        background: T.amberPale,
        border: `1.5px solid ${T.amberBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}
    >
      <IconCalendar size={28} />
    </motion.div>
    <div style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 20, fontWeight: 600, color: T.cocoa,
      marginBottom: 8,
    }}>
      No {filter !== 'all' ? filter : ''} appointments
    </div>
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13, color: T.mist,
      lineHeight: 1.6, maxWidth: 220,
    }}>
      {filter === 'all' ? "You haven't booked any appointments yet." : `No ${filter} appointments to display.`}
    </p>
  </div>
);

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const AppointmentsContent = ({ appointments = sampleAppointments, cancelAppointment }) => {
  const [showAll, setShowAll] = useState(false);
  const [filter,  setFilter]  = useState('all');

  console.log("your appointment in cards :",appointments);

  const safe = Array.isArray(appointments) ? appointments : [];

  const getCounts = (key) =>
    key === 'all' ? safe.length : safe.filter(a => a.status === key).length;

  const filtered = filter === 'all' ? safe : safe.filter(a => a.status === filter);
  const displayed = showAll ? filtered : filtered.slice(0, 3);

  return (
    <>
      <Styles />
      <div style={{
        background: T.glassSolid,
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: 24,
        boxShadow: T.shadowMd,
        padding: 'clamp(20px, 3vw, 32px)',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, marginBottom: 22,
        }}>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: T.mist, marginBottom: 5,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <IconScissors size={11} />
              Appointments
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700,
              color: T.cocoa, margin: 0, lineHeight: 1.1,
            }}>
              My Bookings
            </h2>
            <p style={{ fontSize: 13, color: T.mist, marginTop: 5 }}>
              {safe.length} total · {safe.filter(a => a.status === 'upcoming' || a.status === 'confirmed' || a.status === 'pending').length} active
            </p>
          </div>

          {/* View-all toggle */}
          {filtered.length > 3 && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="ap-toggle"
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? 'Show less' : `View all (${filtered.length})`}
              <IconChevronDown size={12} flip={showAll} />
            </motion.button>
          )}
        </div>

        {/* ── Filter pills ── */}
        <div className="ap-pills-scroll" style={{ marginBottom: 22 }}>
          {FILTERS.map(cfg => (
            <FilterPill
              key={cfg.key}
              cfg={cfg}
              active={filter === cfg.key}
              onClick={() => { setFilter(cfg.key); setShowAll(false); }}
              count={getCounts(cfg.key)}
            />
          ))}
        </div>

        {/* divider */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${T.warm100}, transparent)`,
          marginBottom: 20,
        }}/>

        {/* ── Cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence mode="popLayout">
            {displayed.length > 0 ? (
              displayed.map((appt, i) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  showActions={true}
                  onCancel={() => cancelAppointment?.(appt.id)}
                  index={i}
                />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <EmptyState filter={filter} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom "show more" bar ── */}
        <AnimatePresence>
          {!showAll && filtered.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{
                marginTop: 20,
                padding: '14px 16px',
                background: T.amberPale,
                border: `1px solid ${T.amberBorder}`,
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => setShowAll(true)}
              whileHover={{ scale: 1.01 }}
            >
              <span style={{ fontSize: 13, color: T.cocoaLt }}>
                {filtered.length - 3} more appointment{filtered.length - 3 > 1 ? 's' : ''} hidden
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 600, color: T.amberD,
              }}>
                Show all <IconChevronDown size={12} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default AppointmentsContent;