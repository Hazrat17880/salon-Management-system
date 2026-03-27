'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  FiUser, FiUsers, FiCalendar, FiDollarSign,
  FiStar, FiTrendingUp, FiClock, FiCheckCircle,
  FiXCircle, FiRefreshCw, FiChevronRight, FiScissors,
  FiAlertCircle
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: fill any missing months so charts always show 6 data points
// ─────────────────────────────────────────────────────────────────────────────
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fillMissingMonths = (data = []) => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const label = MONTH_LABELS[d.getMonth()];
    return data.find(r => r.month === label) ?? { month: label, revenue: 0, appointments: 0 };
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, title, value, trend, trendUp, subtitle, accentClass }) => (
  <div className={`d-card d-stat-card ${accentClass}`}>
    <div className="d-stat-icon-row">
      <div className="d-stat-icon-wrap">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`d-trend ${trendUp ? 'd-trend-up' : 'd-trend-down'}`}>
          <FiTrendingUp size={11} className={trendUp ? '' : 'd-flip'} />
          {trend}
        </span>
      )}
    </div>
    <p className="d-stat-label">{title}</p>
    <p className="d-stat-value">{value}</p>
    {subtitle && <p className="d-stat-sub">{subtitle}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ProgressCard
// ─────────────────────────────────────────────────────────────────────────────
const ProgressCard = ({ icon: Icon, iconClass, label, value, total, barClass }) => {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="d-card d-progress-card">
      <div className="d-progress-row">
        <span className="d-progress-label">
          <Icon size={16} className={iconClass} /> {label}
        </span>
        <strong className="d-progress-val">{value}</strong>
      </div>
      <div className="d-progress-track">
        <div className={`d-progress-fill ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="d-progress-pct">{pct}% of total</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stars
// ─────────────────────────────────────────────────────────────────────────────
const Stars = ({ rating = 0, size = 12 }) => (
  <span className="d-stars">
    {[1, 2, 3, 4, 5].map(s => (
      <FiStar key={s} size={size} className={s <= Math.round(rating) ? 'd-star-on' : 'd-star-off'} />
    ))}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    completed: { cls: 'd-badge-green',  icon: <FiCheckCircle size={10} />, label: 'Completed' },
    pending:   { cls: 'd-badge-yellow', icon: <FiClock size={10} />,       label: 'Pending'   },
    cancelled: { cls: 'd-badge-red',    icon: <FiXCircle size={10} />,     label: 'Cancelled' },
  };
  const { cls, icon, label } = cfg[status] ?? cfg.pending;
  return <span className={`d-badge ${cls}`}>{icon}{label}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────────────────────
const EmptyState = ({ msg }) => (
  <div className="d-empty">
    <FiScissors size={26} className="d-empty-icon" />
    <p>{msg}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DashboardPage
// ─────────────────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSalons: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    revenue: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    averageRating: 0,
  });

  const [recentFeedback, setRecentFeedback]       = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [revenueData, setRevenueData]             = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [refreshing, setRefreshing]               = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fire all requests in parallel
      const [statsRes, feedbackRes, appointmentsRes, revenueRes] = await Promise.all([
        fetch('/api/admin/dashboard-cards'),
        fetch('/api/admin/recent-feedback?limit=5'),
        fetch('/api/admin/recent-appointments?limit=5'),
        fetch('/api/admin/revenue?months=6'),
      ]);

      // 2. Parse each body exactly once
      const [statsJson, feedbackJson, appointmentsJson, revenueJson] = await Promise.all([
        statsRes.json(),
        feedbackRes.json(),
        appointmentsRes.json(),
        revenueRes.json(),
      ]);

      // 3. Commit to state — support both { data: {...} } and flat shapes
      if (statsRes.ok)
        setStats(statsJson.data ?? statsJson);

      if (feedbackRes.ok && feedbackJson.success)
        setRecentFeedback(feedbackJson.data);

      if (appointmentsRes.ok && appointmentsJson.success)
        setRecentAppointments(appointmentsJson.data);

      if (revenueRes.ok && revenueJson.success)
        setRevenueData(fillMissingMonths(revenueJson.data));

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed');
  };

  // ── Chart data ─────────────────────────────────────────────────────────────
  const lineChartData = {
    labels: revenueData.map(r => r.month),
    datasets: [{
      label: 'Revenue ($)',
      data: revenueData.map(r => r.revenue),
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99,102,241,0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366F1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const barChartData = {
    labels: revenueData.map(r => r.month),
    datasets: [{
      label: 'Appointments',
      data: revenueData.map(r => r.appointments),
      backgroundColor: 'rgba(34,197,94,0.55)',
      borderColor: '#22C55E',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="d-loading">
          <div className="d-spinner" />
          <p>Loading dashboard…</p>
        </div>
      </>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>
      <div className="d-root">

        {/* Header */}
        <div className="d-header">
          <div>
            <h1 className="d-title">Dashboard Overview</h1>
            <p className="d-subtitle">Welcome back — here's what's happening today.</p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing} className="d-refresh-btn">
            <FiRefreshCw size={14} className={refreshing ? 'd-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="d-stats-grid">
          <StatCard
            icon={FiUser} title="Total Salons"
            value={stats.totalSalons} trend="+12%" trendUp
            accentClass="d-accent-indigo"
          />
          <StatCard
            icon={FiUsers} title="Total Customers"
            value={stats.totalCustomers} trend="+8%" trendUp
            accentClass="d-accent-green"
          />
          <StatCard
            icon={FiCalendar} title="Appointments Today"
            value={stats.totalAppointments}
            subtitle={`${stats.pendingAppointments ?? 0} pending`}
            accentClass="d-accent-yellow"
          />
          <StatCard
            icon={FiDollarSign} title="Revenue This Month"
            value={`$${(stats.revenue ?? 0).toLocaleString()}`}
            trend="+15%" trendUp
            accentClass="d-accent-pink"
          />
        </div>

        {/* Progress Row */}
        <div className="d-progress-grid">
          <ProgressCard
            icon={FiCheckCircle} iconClass="d-c-green"
            label="Completed Appointments"
            value={stats.completedAppointments ?? 0}
            total={stats.totalAppointments}
            barClass="d-bar-green"
          />
          <ProgressCard
            icon={FiClock} iconClass="d-c-yellow"
            label="Pending Appointments"
            value={stats.pendingAppointments ?? 0}
            total={stats.totalAppointments}
            barClass="d-bar-yellow"
          />
          <div className="d-card d-rating-card">
            <div className="d-progress-row">
              <span className="d-progress-label">
                <FiStar size={16} className="d-c-purple" /> Average Rating
              </span>
              <strong className="d-progress-val">
                {(stats.averageRating ?? 0).toFixed(1)}
                <span className="d-rating-denom">/5</span>
              </strong>
            </div>
            <Stars rating={stats.averageRating ?? 0} size={16} />
          </div>
        </div>

        {/* Charts */}
        <div className="d-charts-grid">
          <div className="d-card">
            <div className="d-panel-header">
              <h2 className="d-panel-title">Revenue Trend</h2>
              <span className="d-trend-note">
                <FiTrendingUp size={12} /> +12% vs last month
              </span>
            </div>
            <div className="d-chart-wrap">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
          <div className="d-card">
            <div className="d-panel-header">
              <h2 className="d-panel-title">Appointments Overview</h2>
            </div>
            <div className="d-chart-wrap">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Activity Row */}
        <div className="d-activity-grid">

          {/* Feedback */}
          <div className="d-card">
            <div className="d-panel-header">
              <h2 className="d-panel-title">Recent Feedback</h2>
              <a href="/admin/feedback" className="d-view-all">
                View All <FiChevronRight size={12} />
              </a>
            </div>
            {recentFeedback.length > 0 ? (
              <ul className="d-list">
                {recentFeedback.map(fb => (
                  <li key={fb.id} className="d-list-item">
                    <div className="d-fb-row">
                      <div className="d-fb-body">
                        <p className="d-fb-name">{fb.user}</p>
                        <Stars rating={fb.rating ?? 4} size={12} />
                        <p className="d-fb-msg">{fb.message}</p>
                        <p className="d-fb-date">
                          {new Date(fb.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      {(fb.rating ?? 5) < 3 && (
                        <span className="d-badge d-badge-red d-badge-sm">
                          <FiAlertCircle size={10} /> Needs Attention
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : <EmptyState msg="No recent feedback" />}
          </div>

          {/* Appointments */}
          <div className="d-card">
            <div className="d-panel-header">
              <h2 className="d-panel-title">Recent Appointments</h2>
              <a href="/admin/appointments" className="d-view-all">
                View All <FiChevronRight size={12} />
              </a>
            </div>
            {recentAppointments.length > 0 ? (
              <ul className="d-list">
                {recentAppointments.map(apt => (
                  <li key={apt.id} className="d-list-item">
                    <div className="d-apt-row">
                      <div className="d-apt-body">
                        <p className="d-apt-name">{apt.customer_name}</p>
                        <p className="d-apt-svc">{apt.service_name}</p>
                        <p className="d-apt-date">
                          {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {apt.time}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : <EmptyState msg="No recent appointments" />}
          </div>

        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .d-root *, .d-root *::before, .d-root *::after,
  .d-loading *, .d-loading *::before, .d-loading *::after { box-sizing: border-box; }

  .d-root {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: #F4F6FB;
    min-height: 100vh;
    padding: 32px 28px;
    color: #1e293b;
  }

  /* ── Loading ── */
  .d-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 60vh; gap: 14px;
    color: #64748b; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    font-size: 0.875rem;
  }
  .d-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 3px solid #e2e8f0; border-top-color: #6366F1;
    animation: d-spin 0.75s linear infinite;
  }
  @keyframes d-spin { to { transform: rotate(360deg); } }
  .d-spin { animation: d-spin 0.75s linear infinite; }

  /* ── Header ── */
  .d-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; flex-wrap: wrap; margin-bottom: 24px;
  }
  .d-title {
    font-size: 1.7rem; font-weight: 700; color: #0f172a;
    letter-spacing: -0.4px; margin: 0 0 4px;
  }
  .d-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
  .d-refresh-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 16px; font-size: 0.83rem; font-weight: 600;
    border: 1px solid #e2e8f0; background: #fff; border-radius: 9px;
    cursor: pointer; color: #475569;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    transition: box-shadow 0.18s, background 0.18s;
    font-family: inherit; white-space: nowrap;
  }
  .d-refresh-btn:hover:not(:disabled) { background: #f8fafc; box-shadow: 0 4px 14px rgba(0,0,0,0.09); }
  .d-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Card ── */
  .d-card {
    background: #fff; border: 1px solid #e4eaf4;
    border-radius: 14px; padding: 20px;
    box-shadow: 0 1px 4px rgba(15,23,42,0.05);
    transition: box-shadow 0.18s, transform 0.15s;
  }
  .d-card:hover { box-shadow: 0 5px 18px rgba(15,23,42,0.09); transform: translateY(-1px); }

  /* ── Stat Cards ── */
  .d-stats-grid {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 16px; margin-bottom: 16px;
  }
  @media (max-width: 1024px) { .d-stats-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 540px)  { .d-stats-grid { grid-template-columns: 1fr; } }

  .d-stat-icon-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .d-stat-icon-wrap {
    width: 42px; height: 42px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
  }
  .d-accent-indigo .d-stat-icon-wrap { background: #EEF2FF; color: #6366F1; }
  .d-accent-green  .d-stat-icon-wrap { background: #F0FDF4; color: #22C55E; }
  .d-accent-yellow .d-stat-icon-wrap { background: #FEFCE8; color: #CA8A04; }
  .d-accent-pink   .d-stat-icon-wrap { background: #FFF1F5; color: #EC4899; }

  .d-trend {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 20px;
  }
  .d-trend-up   { background: #F0FDF4; color: #16A34A; }
  .d-trend-down { background: #FEF2F2; color: #DC2626; }
  .d-flip { display: inline-block; transform: rotate(180deg); }

  .d-stat-label { font-size: 0.71rem; color: #64748b; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.055em; }
  .d-stat-value { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.1; }
  .d-stat-sub   { font-size: 0.72rem; color: #94a3b8; margin: 5px 0 0; }

  /* ── Progress Row ── */
  .d-progress-grid {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 16px; margin-bottom: 16px;
  }
  @media (max-width: 768px) { .d-progress-grid { grid-template-columns: 1fr; } }

  .d-progress-row   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .d-progress-label { display: flex; align-items: center; gap: 7px; font-size: 0.82rem; color: #475569; }
  .d-progress-val   { font-size: 1.45rem; font-weight: 700; color: #0f172a; }
  .d-rating-denom   { font-size: 0.85rem; font-weight: 400; color: #94a3b8; }
  .d-progress-track { height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 5px; }
  .d-progress-fill  { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
  .d-bar-green  { background: #22C55E; }
  .d-bar-yellow { background: #EAB308; }
  .d-progress-pct { font-size: 0.68rem; color: #94a3b8; }

  .d-c-green  { color: #22C55E; }
  .d-c-yellow { color: #EAB308; }
  .d-c-purple { color: #A855F7; }

  /* ── Charts ── */
  .d-charts-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-bottom: 16px;
  }
  @media (max-width: 860px) { .d-charts-grid { grid-template-columns: 1fr; } }

  .d-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .d-panel-title  { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0; }
  .d-trend-note   { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #16A34A; font-weight: 600; }
  .d-chart-wrap   { height: 260px; }

  /* ── Activity ── */
  .d-activity-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 860px) { .d-activity-grid { grid-template-columns: 1fr; } }

  .d-view-all {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.78rem; font-weight: 600; color: #6366F1;
    text-decoration: none; transition: color 0.15s;
  }
  .d-view-all:hover { color: #4F46E5; }

  /* List */
  .d-list { list-style: none; margin: 0; padding: 0; }
  .d-list-item { padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
  .d-list-item:last-child { border-bottom: none; padding-bottom: 0; }

  /* Feedback item */
  .d-fb-row  { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
  .d-fb-body { flex: 1; }
  .d-fb-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 3px; }
  .d-fb-msg  { font-size: 0.78rem; color: #64748b; margin: 4px 0 0; line-height: 1.45; }
  .d-fb-date { font-size: 0.68rem; color: #94a3b8; margin: 5px 0 0; }

  /* Stars */
  .d-stars    { display: inline-flex; gap: 2px; }
  .d-star-on  { color: #FBBF24; fill: #FBBF24; }
  .d-star-off { color: #e2e8f0; }

  /* Badges */
  .d-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.68rem; font-weight: 700;
    padding: 3px 8px; border-radius: 20px; white-space: nowrap;
  }
  .d-badge-green  { background: #F0FDF4; color: #16A34A; }
  .d-badge-yellow { background: #FEFCE8; color: #A16207; }
  .d-badge-red    { background: #FEF2F2; color: #DC2626; }
  .d-badge-sm     { font-size: 0.63rem; padding: 2px 7px; }

  /* Appointment item */
  .d-apt-row  { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
  .d-apt-body { flex: 1; }
  .d-apt-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 2px; }
  .d-apt-svc  { font-size: 0.78rem; color: #64748b; margin: 0; }
  .d-apt-date { font-size: 0.68rem; color: #94a3b8; margin: 4px 0 0; }

  /* Empty */
  .d-empty      { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 32px 0; color: #94a3b8; font-size: 0.85rem; }
  .d-empty-icon { opacity: 0.3; }

  /* Mobile root padding */
  @media (max-width: 540px) { .d-root { padding: 20px 16px; } }
`;

export default DashboardPage;