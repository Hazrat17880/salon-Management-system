// component/Customer/Overview.jsx
import { motion, AnimatePresence } from "framer-motion";
import AppointmentCard from "./Appointment";
import {
  FiCalendar, FiCheckCircle, FiMapPin, FiMessageCircle,
  FiDollarSign, FiTrendingUp, FiClock, FiStar,
  FiArrowRight, FiZap, FiAward, FiChevronRight
} from 'react-icons/fi';

/* ─── shared design tokens (must match page.js) ─── */
const T = {
  cream:   '#FAF7F2',
  warm50:  '#F5EFE6',
  warm100: '#EBE0D0',
  amber:   '#C9973A',
  amberD:  '#A67C28',
  amberPale: 'rgba(201,151,58,0.10)',
  amberBorder: 'rgba(201,151,58,0.22)',
  cocoa:   '#3D2B1F',
  cocoaLt: '#6B4C3B',
  mist:    '#8A9BA8',
  glass:   'rgba(255,255,255,0.72)',
  glassSolid: 'rgba(255,255,255,0.92)',
  shadowSm: '0 2px 10px rgba(61,43,31,0.07)',
  shadowMd: '0 8px 32px rgba(61,43,31,0.11)',
  shadowLg: '0 20px 56px rgba(61,43,31,0.15)',
  shadowAmber: '0 8px 28px rgba(201,151,58,0.28)',
};

/* ─── inline style block ─── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

    .ov-stat-card {
      background: ${T.glassSolid};
      backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.9);
      border-radius: 20px;
      padding: 24px 20px;
      box-shadow: ${T.shadowSm};
      position: relative;
      overflow: hidden;
      transition: box-shadow 0.3s, transform 0.25s;
      cursor: default;
    }
    .ov-stat-card:hover {
      box-shadow: ${T.shadowMd};
      transform: translateY(-4px);
    }
    .ov-stat-card::before {
      content: '';
      position: absolute; inset: 0;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.5), transparent);
      pointer-events: none;
    }

    .ov-panel {
      background: ${T.glassSolid};
      backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,0.9);
      border-radius: 22px;
      box-shadow: ${T.shadowMd};
    }

    .ov-btn-gold {
      background: linear-gradient(135deg, ${T.amber} 0%, ${T.amberD} 100%);
      color: #FFF8EE;
      border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.03em;
      border-radius: 12px;
      padding: 9px 18px;
      display: inline-flex; align-items: center; gap: 6px;
      box-shadow: ${T.shadowAmber};
      transition: box-shadow 0.25s, transform 0.15s;
    }
    .ov-btn-gold:hover { box-shadow: 0 12px 32px rgba(201,151,58,0.4); }

    .ov-btn-ghost {
      background: ${T.amberPale};
      border: 1px solid ${T.amberBorder};
      color: ${T.amberD};
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 13px;
      border-radius: 10px;
      padding: 7px 14px;
      display: inline-flex; align-items: center; gap: 5px;
      transition: background 0.2s, box-shadow 0.2s;
    }
    .ov-btn-ghost:hover {
      background: rgba(201,151,58,0.16);
      box-shadow: 0 2px 12px rgba(201,151,58,0.15);
    }

    .ov-action-row {
      display: flex; align-items: center; gap: 14px;
      padding: 13px 16px;
      border-radius: 14px;
      background: ${T.warm50};
      border: 1px solid transparent;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
      text-align: left; width: 100%;
    }
    .ov-action-row:hover {
      background: rgba(201,151,58,0.08);
      border-color: ${T.amberBorder};
      box-shadow: ${T.shadowSm};
    }

    .ov-icon-pip {
      width: 38px; height: 38px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .ov-spent-card {
      background: linear-gradient(145deg, ${T.cocoa} 0%, #5C3D2A 100%);
      border-radius: 22px;
      padding: 26px 24px;
      box-shadow: ${T.shadowLg};
      position: relative; overflow: hidden;
    }

    .ov-empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 52px 24px;
      text-align: center;
    }

    .ov-progress-track {
      height: 5px;
      background: rgba(255,255,255,0.18);
      border-radius: 100px;
      overflow: hidden;
    }
    .ov-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, ${T.amber}, #F5C97A);
      border-radius: 100px;
      transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ov-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${T.mist};
    }

    .ov-heading {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 600;
      color: ${T.cocoa};
    }

    .ov-body {
      font-family: 'DM Sans', sans-serif;
      color: ${T.cocoaLt};
    }

    .ov-num {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 700;
      line-height: 1;
    }

    .ov-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${T.warm100}, transparent);
      margin: 20px 0;
    }

    .ov-badge {
      display: inline-flex; align-items: center; gap: 5px;
      background: ${T.amberPale};
      border: 1px solid ${T.amberBorder};
      border-radius: 100px;
      padding: 3px 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 500;
      color: ${T.amberD};
    }

    .ov-section-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
      margin-bottom: 22px;
    }

    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ov-count-anim {
      animation: countUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
    }
  `}</style>
);

/* ─── stat icon configs ─── */
const STAT_CONFIGS = [
  {
    key: 'upcoming',
    name: 'Upcoming',
    icon: FiClock,
    iconBg: 'rgba(201,151,58,0.12)',
    iconColor: '#C9973A',
    accent: '#C9973A',
  },
  {
    key: 'completed',
    name: 'Completed',
    icon: FiCheckCircle,
    iconBg: 'rgba(52,168,92,0.12)',
    iconColor: '#34A85C',
    accent: '#34A85C',
  },
  {
    key: 'salons',
    name: 'Salons',
    icon: FiMapPin,
    iconBg: 'rgba(99,102,241,0.12)',
    iconColor: '#6366F1',
    accent: '#6366F1',
  },
  {
    key: 'messages',
    name: 'Messages',
    icon: FiMessageCircle,
    iconBg: 'rgba(239,100,73,0.12)',
    iconColor: '#EF6449',
    accent: '#EF6449',
  },
];

/* ─── stat card ─── */
const StatCard = ({ config, value, index }) => {
  const Icon = config.icon;
  return (
    <motion.div
      className="ov-stat-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22,1,0.36,1] }}
    >
      {/* icon pip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 40, height: 40, borderRadius: 13,
        background: config.iconBg, marginBottom: 16,
      }}>
        <Icon style={{ fontSize: 18, color: config.iconColor }} />
      </div>

      {/* label */}
      <div className="ov-label" style={{ marginBottom: 6 }}>{config.name}</div>

      {/* number */}
      <div className="ov-num ov-count-anim" style={{
        fontSize: 'clamp(32px,4vw,44px)',
        color: config.accent,
        animationDelay: `${index * 0.08 + 0.2}s`,
      }}>
        {value}
      </div>

      {/* subtle trend line */}
      <div style={{
        marginTop: 14,
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <FiTrendingUp style={{ fontSize: 11, color: config.iconColor, opacity: 0.7 }} />
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, color: T.mist,
        }}>
          Last 30 days
        </span>
      </div>

      {/* accent bar bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 20, right: 20,
        height: 3, borderRadius: '3px 3px 0 0',
        background: `linear-gradient(90deg, ${config.accent}44, ${config.accent})`,
        opacity: 0.6,
      }} />
    </motion.div>
  );
};

/* ─── empty state ─── */
const EmptyState = () => (
  <div className="ov-empty-state">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={{
        width: 80, height: 80, borderRadius: 24,
        background: T.amberPale,
        border: `1.5px solid ${T.amberBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}
    >
      <FiCalendar style={{ fontSize: 30, color: T.amber }} />
    </motion.div>
    <div className="ov-heading" style={{ fontSize: 22, marginBottom: 8 }}>
      No appointments yet
    </div>
    <p className="ov-body" style={{ fontSize: 14, maxWidth: 240, lineHeight: 1.6, marginBottom: 24 }}>
      Book your first salon visit and it'll appear right here.
    </p>
    <motion.button
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      className="ov-btn-gold"
    >
      Browse Salons <FiArrowRight />
    </motion.button>
  </div>
);

/* ─── quick-action row ─── */
const ActionRow = ({ icon: Icon, iconBg, iconColor, label, sub, delay }) => (
  <motion.button
    className="ov-action-row"
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22,1,0.36,1] }}
    whileHover={{ x: 4 }}
  >
    <div className="ov-icon-pip" style={{ background: iconBg }}>
      <Icon style={{ fontSize: 16, color: iconColor }} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500, fontSize: 14, color: T.cocoa,
      }}>{label}</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, color: T.mist, marginTop: 2,
      }}>{sub}</div>
    </div>
    <FiChevronRight style={{ fontSize: 15, color: T.mist, flexShrink: 0 }} />
  </motion.button>
);

/* ════════════════════════════════════════════
   Main component
═══════════════════════════════════════════ */
const DashboardContent = ({ appointments = [], stats = {} }) => {

  console.log("your appointment in overview :",appointments);

  const getDisplayStatus = (appt) => {
    const s = appt.appointment_status;
    if (!s || s === '') return 'pending';
    if (s === 'accept')  return 'confirmed';
    if (s === 'reject')  return 'rejected';
    return s;
  };

  const upcomingAppointments = appointments
    .filter(a => { const s = getDisplayStatus(a); return s === 'confirmed' || s === 'pending'; })
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .slice(0, 5);

  const displayAppointments = upcomingAppointments.length > 0 ? upcomingAppointments : recentAppointments;
  const isUpcoming = upcomingAppointments.length > 0;
  const progressPct = Math.min(((stats.totalAppointments || 0) / 20) * 100, 100);

  return (
    <>
      <Styles />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── Stats Row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
        }}>
          {STAT_CONFIGS.map((cfg, i) => (
            <StatCard
              key={cfg.key}
              config={cfg}
              value={stats[cfg.key] || 0}
              index={i}
            />
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: 20,
        }}
          className="ov-main-grid"
        >
          <style>{`
            @media(min-width:1024px){
              .ov-main-grid {
                grid-template-columns: minmax(0,1.9fr) minmax(0,1fr) !important;
              }
            }
          `}</style>

          {/* ── Appointments Panel ── */}
          <motion.div
            className="ov-panel"
            style={{ padding: '28px 26px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.22,1,0.36,1] }}
          >
            <div className="ov-section-header">
              <div>
                <div className="ov-label" style={{ marginBottom: 6 }}>
                  {isUpcoming ? 'Coming up' : 'History'}
                </div>
                <h2 className="ov-heading" style={{ fontSize: 22, margin: 0 }}>
                  {isUpcoming ? 'Upcoming Appointments' : 'Recent Appointments'}
                </h2>
                <p className="ov-body" style={{ fontSize: 13, marginTop: 5, lineHeight: 1.5 }}>
                  {isUpcoming
                    ? `${upcomingAppointments.length} appointment${upcomingAppointments.length > 1 ? 's' : ''} scheduled`
                    : 'Your most recent salon visits'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="ov-btn-ghost"
              >
                View all <FiArrowRight style={{ fontSize: 12 }} />
              </motion.button>
            </div>

            <div className="ov-divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AnimatePresence>
                {appointments.length > 0 ? (
                  displayAppointments.slice(0, 3).map((appt, i) => (
                    <motion.div
                      key={appt.id}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 18 }}
                      transition={{ delay: 0.35 + i * 0.08, duration: 0.4, ease: [0.22,1,0.36,1] }}
                    >
                      <AppointmentCard appointment={appt} />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Right Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Total Spent */}
            {(stats.totalSpent > 0) && (
              <motion.div
                className="ov-spent-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.22,1,0.36,1] }}
              >
                {/* decorative orbs */}
                <div style={{
                  position:'absolute', top:-40, right:-40,
                  width:140, height:140, borderRadius:'50%',
                  background:'rgba(201,151,58,0.15)',
                  pointerEvents:'none',
                }}/>
                <div style={{
                  position:'absolute', bottom:-30, left:-30,
                  width:100, height:100, borderRadius:'50%',
                  background:'rgba(201,151,58,0.08)',
                  pointerEvents:'none',
                }}/>

                <div style={{ position:'relative' }}>
                  <div style={{
                    display:'flex', alignItems:'center',
                    justifyContent:'space-between', marginBottom:18,
                  }}>
                    <div className="ov-icon-pip" style={{
                      background:'rgba(201,151,58,0.2)',
                    }}>
                      <FiDollarSign style={{ fontSize:17, color:T.amber }} />
                    </div>
                    <span style={{
                      fontFamily:"'DM Sans',sans-serif",
                      fontSize:11, fontWeight:600,
                      letterSpacing:'0.08em', textTransform:'uppercase',
                      color:'rgba(255,255,255,0.45)',
                    }}>
                      Total Spent
                    </span>
                  </div>

                  <div className="ov-num" style={{
                    fontSize:'clamp(34px,4vw,46px)',
                    color:'#FAF7F2',
                    marginBottom:6,
                  }}>
                    ${stats.totalSpent.toLocaleString()}
                  </div>

                  <div style={{
                    display:'flex', alignItems:'center', gap:6,
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize:13, color:'rgba(255,255,255,0.55)',
                  }}>
                    <FiZap style={{ fontSize:12, color:T.amber }} />
                    Across {stats.totalAppointments} appointment{stats.totalAppointments !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              className="ov-panel"
              style={{ padding:'24px 20px' }}
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.4, duration:0.5, ease:[0.22,1,0.36,1] }}
            >
              <div className="ov-label" style={{ marginBottom:4 }}>Actions</div>
              <div className="ov-heading" style={{ fontSize:18, marginBottom:16 }}>Quick Access</div>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <ActionRow
                  icon={FiCalendar}
                  iconBg="rgba(201,151,58,0.12)" iconColor={T.amber}
                  label="Book Appointment"
                  sub="Schedule your next visit"
                  delay={0.45}
                />
                <ActionRow
                  icon={FiStar}
                  iconBg="rgba(99,102,241,0.11)" iconColor="#6366F1"
                  label="Write a Review"
                  sub="Share your experience"
                  delay={0.5}
                />
                <ActionRow
                  icon={FiMessageCircle}
                  iconBg="rgba(52,168,92,0.11)" iconColor="#34A85C"
                  label="Contact Support"
                  sub="Get help with your booking"
                  delay={0.55}
                />
              </div>
            </motion.div>

            {/* Loyalty card — shown when ≥5 appointments */}
            <AnimatePresence>
              {(stats.totalAppointments >= 5) && (
                <motion.div
                  className="ov-panel"
                  style={{ padding:'24px 20px', overflow:'hidden', position:'relative' }}
                  initial={{ opacity:0, y:16 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:16 }}
                  transition={{ delay:0.6, duration:0.5, ease:[0.22,1,0.36,1] }}
                >
                  {/* corner watermark */}
                  <div style={{
                    position:'absolute', top:-8, right:-6,
                    fontSize:64, opacity:0.07, pointerEvents:'none',
                    userSelect:'none', lineHeight:1,
                  }}>✦</div>

                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                    <div className="ov-icon-pip" style={{
                      background:T.amberPale,
                      border:`1px solid ${T.amberBorder}`,
                    }}>
                      <FiAward style={{ fontSize:16, color:T.amber }} />
                    </div>
                    <div>
                      <div className="ov-label">Loyalty</div>
                      <div className="ov-heading" style={{ fontSize:16 }}>Loyal Customer</div>
                    </div>
                  </div>

                  <p className="ov-body" style={{ fontSize:13, lineHeight:1.6, marginBottom:14 }}>
                    You've completed{' '}
                    <strong style={{ color:T.cocoa }}>{stats.totalAppointments}</strong>{' '}
                    appointments. Keep going!
                  </p>

                  {/* progress bar */}
                  <div className="ov-progress-track">
                    <motion.div
                      className="ov-progress-fill"
                      initial={{ width:0 }}
                      animate={{ width:`${progressPct}%` }}
                      transition={{ delay:0.8, duration:1.2, ease:[0.16,1,0.3,1] }}
                    />
                  </div>

                  <div style={{
                    display:'flex', justifyContent:'space-between',
                    marginTop:8,
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize:11, color:T.mist,
                  }}>
                    <span>{stats.totalAppointments} done</span>
                    <span>Next reward at 20</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>{/* end right col */}
        </div>{/* end main grid */}
      </div>
    </>
  );
};

export default DashboardContent;