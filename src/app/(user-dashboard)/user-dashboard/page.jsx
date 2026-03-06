// app/user-dashboard/page.js
"use client"
import DashboardContent from '@/component/Customer/Overview';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/component/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiBell, FiUser, FiRefreshCw, FiScissors } from 'react-icons/fi';

/* ─── tiny inline style block for Google Fonts + custom props ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    :root {
      --cream:   #FAF7F2;
      --warm-50: #F5EFE6;
      --warm-100:#EBE0D0;
      --amber:   #C9973A;
      --amber-d: #A67C28;
      --cocoa:   #3D2B1F;
      --cocoa-lt:#6B4C3B;
      --mist:    #8A9BA8;
      --glass:   rgba(255,255,255,0.72);
      --shadow-sm: 0 2px 8px rgba(61,43,31,0.08);
      --shadow-md: 0 8px 32px rgba(61,43,31,0.12);
      --shadow-lg: 0 20px 60px rgba(61,43,31,0.16);
    }

    body { background-color: var(--cream); }

    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body    { font-family: 'DM Sans', sans-serif; }

    /* noise grain overlay */
    .grain::after {
      content: '';
      position: fixed; inset: 0;
      pointer-events: none; z-index: 999;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 200px;
      opacity: 0.4;
      mix-blend-mode: multiply;
    }

    .btn-gold {
      background: linear-gradient(135deg, var(--amber) 0%, var(--amber-d) 100%);
      color: #FFF8EE;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: box-shadow 0.25s, transform 0.15s;
      box-shadow: 0 4px 16px rgba(201,151,58,0.35);
    }
    .btn-gold:hover {
      box-shadow: 0 6px 24px rgba(201,151,58,0.5);
    }

    .icon-btn {
      background: var(--glass);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.9);
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.2s, transform 0.15s;
    }
    .icon-btn:hover {
      box-shadow: var(--shadow-md);
    }

    .badge-pill {
      background: #E74C3C;
      font-size: 10px;
      font-weight: 600;
      line-height: 1;
      min-width: 18px;
      height: 18px;
      border: 2px solid var(--cream);
    }

    .header-card {
      background: var(--glass);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.85);
      box-shadow: var(--shadow-md);
    }

    .divider-line {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--warm-100), transparent);
    }

    .error-card {
      background: var(--glass);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.85);
      box-shadow: var(--shadow-lg);
    }

    /* animated shimmer for loading state substitute */
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .text-gradient {
      background: linear-gradient(135deg, var(--cocoa) 0%, var(--amber) 50%, var(--cocoa-lt) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `}</style>
);

/* ─── decorative background blobs ─── */
const BackgroundDecor = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* warm amber blob top-right */}
    <div style={{
      position:'absolute', top:'-120px', right:'-100px',
      width:'520px', height:'520px',
      background:'radial-gradient(circle, rgba(201,151,58,0.13) 0%, transparent 70%)',
      borderRadius:'50%',
    }}/>
    {/* cocoa blob bottom-left */}
    <div style={{
      position:'absolute', bottom:'-160px', left:'-120px',
      width:'600px', height:'600px',
      background:'radial-gradient(circle, rgba(61,43,31,0.07) 0%, transparent 70%)',
      borderRadius:'50%',
    }}/>
    {/* subtle warm mid */}
    <div style={{
      position:'absolute', top:'40%', left:'55%',
      width:'320px', height:'320px',
      background:'radial-gradient(circle, rgba(235,224,208,0.5) 0%, transparent 70%)',
      borderRadius:'50%',
    }}/>
    {/* scattered tiny circles */}
    {[
      {top:'8%',  left:'12%', size:6,  opacity:0.18},
      {top:'22%', left:'88%', size:10, opacity:0.12},
      {top:'65%', left:'6%',  size:8,  opacity:0.15},
      {top:'80%', left:'80%', size:6,  opacity:0.12},
    ].map((c, i) => (
      <div key={i} style={{
        position:'absolute', top:c.top, left:c.left,
        width:c.size, height:c.size,
        borderRadius:'50%',
        background:'var(--amber)',
        opacity:c.opacity,
      }}/>
    ))}
  </div>
);

/* ─── animated scissors divider ─── */
const ScissorsDivider = () => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 divider-line"/>
    <motion.div
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
    >
      <FiScissors style={{ color:'var(--amber)', fontSize:'14px', opacity:0.7 }} />
    </motion.div>
    <div className="flex-1 divider-line"/>
  </div>
);

/* ─── date badge ─── */
const DateBadge = () => {
  const now = new Date();
  const day  = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:'8px',
      background:'rgba(201,151,58,0.1)',
      border:'1px solid rgba(201,151,58,0.25)',
      borderRadius:'100px',
      padding:'5px 14px',
    }}>
      <FiCalendar style={{ color:'var(--amber)', fontSize:'12px' }} />
      <span style={{
        fontFamily:'DM Sans, sans-serif',
        fontSize:'12px', fontWeight:500,
        color:'var(--cocoa-lt)',
        letterSpacing:'0.03em',
      }}>
        {day}, {date}
      </span>
    </div>
  );
};

/* ════════════════════════════════════════════
   Main Page Component
═══════════════════════════════════════════ */
const Page = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    upcoming: 0, completed: 0, salons: 0,
    messages: 0, totalSpent: 0, totalAppointments: 0,
  });
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const response = await fetch('/api/user/dashboard-data');

      const result = await response.json();

    // Debug logs
    console.log("🔵 Full API Response:", result);
    console.log("📊 Stats:", result.data?.stats);
    console.log("📅 Appointments:", result.data?.appointments);

      if (result.success) {
        setAppointments(result.data.appointments || []);
        setStats(result.data.stats || {
          upcoming:0, completed:0, salons:0,
          messages:0, totalSpent:0, totalAppointments:0,
        });
        setError(null);
      } else {
        setError(result.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ── Loading ── */
  if (loading) return <LoadingSpinner text="Preparing your dashboard…" />;

  /* ── Error ── */
  if (error) return (
    <>
      <GlobalStyles />
      <div className="grain" />
      <BackgroundDecor />
      <div style={{
        minHeight:'100vh', display:'flex',
        alignItems:'center', justifyContent:'center',
        padding:'24px',
        fontFamily:'DM Sans, sans-serif',
      }}>
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          transition={{ type:'spring', stiffness:260, damping:20 }}
          className="error-card"
          style={{ borderRadius:'24px', padding:'48px 40px', maxWidth:'420px', textAlign:'center' }}
        >
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>✦</div>
          <h2 style={{
            fontFamily:'Cormorant Garamond, serif',
            fontSize:'28px', fontWeight:600,
            color:'var(--cocoa)', marginBottom:'10px',
          }}>
            Something went wrong
          </h2>
          <p style={{ color:'var(--cocoa-lt)', fontSize:'14px', marginBottom:'32px', lineHeight:1.6 }}>
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => fetchDashboardData()}
            className="btn-gold"
            style={{ padding:'12px 32px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'14px' }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    </>
  );

  /* ── Dashboard ── */
  return (
    <>
      <GlobalStyles />
      <div className="grain" />
      <BackgroundDecor />

      <div style={{
        minHeight:'100vh',
        backgroundColor:'var(--cream)',
        fontFamily:'DM Sans, sans-serif',
      }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'32px 24px 64px' }}>

          {/* ── Top Header Card ── */}
          <motion.div
            initial={{ opacity:0, y:-24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
            className="header-card"
            style={{
              borderRadius:'20px',
              padding:'28px 32px',
              marginBottom:'28px',
              display:'flex',
              flexWrap:'wrap',
              gap:'20px',
              alignItems:'center',
              justifyContent:'space-between',
            }}
          >
            {/* Left: title + date */}
            <div>
              <motion.div
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                transition={{ delay:0.1 }}
                style={{ marginBottom:'10px' }}
              >
                <DateBadge />
              </motion.div>

              <h1
                className="font-display text-gradient"
                style={{ fontSize:'clamp(28px, 4vw, 42px)', fontWeight:700, lineHeight:1.1, margin:0 }}
              >
                My Dashboard
              </h1>

              <p style={{
                marginTop:'8px', fontSize:'14px',
                color:'var(--cocoa-lt)', fontWeight:400, letterSpacing:'0.01em',
              }}>
                Welcome back — here's everything happening with your appointments.
              </p>
            </div>

            {/* Right: action buttons */}
            <motion.div
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:0.2 }}
              style={{ display:'flex', alignItems:'center', gap:'10px' }}
            >
              {/* Refresh */}
              <motion.button
                whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
                onClick={() => fetchDashboardData(true)}
                className="icon-btn"
                style={{
                  width:'42px', height:'42px', borderRadius:'12px',
                  border:'none', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
                title="Refresh dashboard"
              >
                <motion.div animate={refreshing ? { rotate:360 } : {}} transition={{ duration:0.8, repeat: refreshing ? Infinity : 0, ease:'linear' }}>
                  <FiRefreshCw style={{ color:'var(--cocoa-lt)', fontSize:'16px' }} />
                </motion.div>
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
                className="icon-btn"
                style={{
                  position:'relative',
                  width:'42px', height:'42px', borderRadius:'12px',
                  border:'none', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >
                <FiBell style={{ color:'var(--cocoa-lt)', fontSize:'16px' }} />
                <AnimatePresence>
                  {stats.messages > 0 && (
                    <motion.span
                      initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                      className="badge-pill"
                      style={{
                        position:'absolute', top:'-4px', right:'-4px',
                        borderRadius:'100px',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'#fff', fontFamily:'DM Sans, sans-serif',
                      }}
                    >
                      {stats.messages}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Profile */}
              <motion.button
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                className="btn-gold"
                style={{
                  display:'flex', alignItems:'center', gap:'8px',
                  padding:'10px 20px', borderRadius:'12px',
                  border:'none', cursor:'pointer', fontSize:'14px',
                }}
              >
                <FiUser style={{ fontSize:'15px' }} />
                Profile
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ── Scissors divider ── */}
          <ScissorsDivider />

          {/* ── Main Content ── */}
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3, duration:0.5, ease:[0.22,1,0.36,1] }}
          >
            <DashboardContent
              appointments={appointments}
              stats={stats}
            />
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Page;