import { useState, useEffect, useRef } from 'react'
import { statsAPI, issuesAPI } from '../api'

/* ── Animated counter ── */
function Counter({ value, duration = 1400 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (typeof value !== 'number') return
    let raf, start = null, from = 0
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setDisplay(Math.round(from + (value - from) * ease))
      if (p < 1) raf = requestAnimationFrame(step)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <>{typeof value === 'number' ? display.toLocaleString() : value}</>
}

/* ── SVG Ring Chart ── */
function RingChart({ pct = 0, color = '#00d2ff', size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), 200)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - animated / 100)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  )
}

/* ── Sparkline ── */
function Sparkline({ data = [], color = '#00d2ff', width = 80, height = 32 }) {
  if (data.length < 2) return null
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
      <circle cx={pts.split(' ').pop().split(',')[0]} cy={pts.split(' ').pop().split(',')[1]}
        r="3" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  )
}

/* ── Live Clock ── */
function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  const hh = String(t.getHours()).padStart(2,'0')
  const mm = String(t.getMinutes()).padStart(2,'0')
  const ss = String(t.getSeconds()).padStart(2,'0')
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 800, color: '#00d2ff', letterSpacing: '0.05em', lineHeight: 1, textShadow: '0 0 30px rgba(0,210,255,0.6)' }}>
        {hh}<span style={{ opacity: 0.5, animation: 'blink 1s step-end infinite' }}>:</span>{mm}<span style={{ opacity: 0.5, animation: 'blink 1s step-end infinite' }}>:</span>{ss}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '4px' }}>
        {t.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  )
}

/* ── Big Stat Card ── */
function StatCard({ label, value, icon, color, delay = 0, subtitle, pct, spark }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', borderRadius: '22px', padding: '24px',
        background: hov ? `linear-gradient(135deg, ${color}12, ${color}06)` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hov ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(20px)',
        boxShadow: hov ? `0 24px 60px ${color}30, 0 0 0 1px ${color}33` : '0 4px 24px rgba(0,0,0,0.25)',
        transform: hov ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        animation: `cardIn 0.7s ${delay}s cubic-bezier(0.175,0.885,0.32,1.275) both`,
        overflow: 'hidden', cursor: 'default',
      }}
    >
      {/* Glow top bar */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px', background: `linear-gradient(90deg,transparent,${color},transparent)`, opacity: hov ? 1 : 0.25, transition: 'opacity 0.3s' }} />

      {/* Corner glow */}
      {hov && <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${color}25, transparent 70%)`, pointerEvents: 'none' }} />}

      {/* Big ghost icon */}
      <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', fontSize: '72px', opacity: hov ? 0.18 : 0.06, transition: 'all 0.4s', transform: hov ? 'scale(1.25) rotate(-12deg)' : 'scale(1)', pointerEvents: 'none', lineHeight: 1 }}>{icon}</div>

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: 'JetBrains Mono, monospace' }}>{label}</div>
        {pct !== undefined && <RingChart pct={pct} color={color} size={52} stroke={5} />}
      </div>

      {/* Value */}
      <div style={{ fontSize: '2.6rem', fontWeight: 900, color, lineHeight: 1, fontFamily: 'Syne, sans-serif', textShadow: hov ? `0 0 40px ${color}` : 'none', transition: 'text-shadow 0.3s' }}>
        <Counter value={value} />
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>{subtitle}</div>
        {spark && <Sparkline data={spark} color={color} />}
      </div>
    </div>
  )
}

/* ── Activity Item ── */
function ActivityItem({ item, idx }) {
  const isIssued = item.status === 'Active'
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.25s', animation: `slideUp 0.4s ${idx * 0.05}s ease both`, cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,210,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,210,255,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)' }}
    >
      {/* Status dot */}
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', background: isIssued ? 'rgba(0,210,255,0.1)' : 'rgba(52,211,153,0.1)', border: `1px solid ${isIssued ? 'rgba(0,210,255,0.25)' : 'rgba(52,211,153,0.25)'}` }}>
        {isIssued ? '📤' : '📥'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.bookTitle || 'N/A'}</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>{item.memberName || 'N/A'}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
        <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', background: isIssued ? 'rgba(0,210,255,0.12)' : 'rgba(52,211,153,0.12)', color: isIssued ? '#00d2ff' : '#34d399', border: `1px solid ${isIssued ? 'rgba(0,210,255,0.3)' : 'rgba(52,211,153,0.3)'}` }}>
          {isIssued ? '⬆ ISSUED' : '⬇ RETURNED'}
        </span>
        {item.fine > 0 && <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', fontFamily: 'JetBrains Mono, monospace' }}>Rs {item.fine}</span>}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════ */
export default function Dashboard() {
  const [stats, setStats] = useState({ totalBooks: 0, totalMembers: 0, availableBooks: 0, issuedBooks: 0, overdueIssues: 0, totalFinesCollected: 0, trendingBook: '—' })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [sRes, iRes] = await Promise.all([statsAPI.get(), issuesAPI.getAll()])
        if (sRes?.data) setStats(sRes.data)
        if (iRes?.data) setRecent([...iRes.data].reverse().slice(0, 8))
      } catch (e) {
        setError(e.response?.status === 404 ? 'Data not found (404).' : 'Failed to load dashboard.')
      } finally { setLoading(false) }
    })()
  }, [])

  const issued   = recent.filter(i => i.status === 'Active').length
  const returned = recent.filter(i => i.status === 'Returned').length
  const utilPct  = stats.totalBooks ? Math.round((stats.issuedBooks / stats.totalBooks) * 100) : 0
  const availPct = stats.totalBooks ? Math.round((stats.availableBooks / stats.totalBooks) * 100) : 0

  // fake sparkline seeds (visual only)
  const spark = (seed, len = 7) => Array.from({ length: len }, (_, i) => Math.max(1, Math.round(seed * 0.6 + seed * 0.4 * Math.sin(i * 1.3 + seed))))

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '20px' }}>
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(0,210,255,0.15)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: '#00d2ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: '10px', border: '2px solid transparent', borderTopColor: 'rgba(0,210,255,0.4)', borderRadius: '50%', animation: 'spin 1.5s linear infinite reverse' }} />
      </div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.3em' }}>INITIALIZING SYSTEM...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '16px', padding: '32px', color: '#f87171', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>{error}</div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', animation: 'slideDown 0.6s ease both' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d2ff', boxShadow: '0 0 12px #00d2ff', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '10px', color: '#00d2ff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.3em', textTransform: 'uppercase' }}>System Online · Live Data</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2.2rem,5vw,3.8rem)', lineHeight: 1, background: 'linear-gradient(120deg,#fff 0%,#fff 55%,#00d2ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Dashboard
          </h1>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px', letterSpacing: '0.12em' }}>
            Soha's Atheneum · Library Management System
          </div>
        </div>
        <LiveClock />
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '18px' }}>
        <StatCard label="Total Books"  value={stats.totalBooks}          icon="📚" color="#00d2ff" delay={0}    subtitle="In catalog"      pct={100}      spark={spark(stats.totalBooks)} />
        <StatCard label="Members"      value={stats.totalMembers}        icon="👥" color="#60a5fa" delay={0.06} subtitle="Registered"      pct={Math.min(stats.totalMembers * 5, 100)} spark={spark(stats.totalMembers)} />
        <StatCard label="Available"    value={stats.availableBooks}      icon="✅" color="#34d399" delay={0.12} subtitle="Ready to issue"  pct={availPct} spark={spark(stats.availableBooks)} />
        <StatCard label="Overdue"      value={stats.overdueIssues}       icon="⚠️" color="#f87171" delay={0.18} subtitle="Need attention"  pct={Math.min(stats.overdueIssues * 10, 100)} spark={spark(stats.overdueIssues + 1)} />
        <StatCard label="Fines (Rs)"   value={stats.totalFinesCollected} icon="💰" color="#fbbf24" delay={0.24} subtitle="Collected total"  pct={Math.min(stats.totalFinesCollected, 100)} spark={spark(stats.totalFinesCollected + 2)} />
        <StatCard label="Trending"     value={stats.trendingBook}        icon="🔥" color="#a78bfa" delay={0.30} subtitle="Most issued" />
      </div>

      {/* ── MIDDLE ROW: Utilization + Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '18px', animation: 'slideUp 0.6s 0.35s ease both' }}>

        {/* Utilization panel */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '22px', padding: '28px', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: 'JetBrains Mono, monospace' }}>Library Utilization</div>

          {/* Big ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <RingChart pct={utilPct} color="#00d2ff" size={120} stroke={10} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00d2ff', fontFamily: 'Syne, sans-serif', lineHeight: 1, textShadow: '0 0 20px rgba(0,210,255,0.6)' }}>{utilPct}%</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>IN USE</div>
              </div>
            </div>
          </div>

          {/* Mini bars */}
          {[
            { label: 'Issued', val: stats.issuedBooks, max: stats.totalBooks || 1, color: '#00d2ff' },
            { label: 'Available', val: stats.availableBooks, max: stats.totalBooks || 1, color: '#34d399' },
            { label: 'Overdue', val: stats.overdueIssues, max: stats.totalBooks || 1, color: '#f87171' },
          ].map(({ label, val, max, color }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color, fontFamily: 'Syne, sans-serif' }}>{val}</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min((val / max) * 100, 100)}%`, background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: '99px', transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 8px ${color}` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '22px', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,210,255,0.03)' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em' }}>Recent Activity</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>Last {recent.length} transactions</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '4px 10px', background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.2)', borderRadius: '99px', fontSize: '9px', color: '#00d2ff', fontFamily: 'JetBrains Mono, monospace' }}>⬆ {issued} ISSUED</span>
              <span style={{ padding: '4px 10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '99px', fontSize: '9px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>⬇ {returned} RETURNED</span>
            </div>
          </div>

          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '380px', overflowY: 'auto' }}>
            {recent.length === 0
              ? <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.25em' }}>NO RECORDS FOUND_</div>
              : recent.map((item, i) => <ActivityItem key={item._id} item={item} idx={i} />)
            }
          </div>
        </div>
      </div>

      {/* ── BOTTOM QUICK STATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', animation: 'slideUp 0.6s 0.5s ease both' }}>
        {[
          { label: 'Books Issued',   val: stats.issuedBooks, icon: '📤', color: '#00d2ff' },
          { label: 'Active Members', val: stats.totalMembers,                      icon: '👤', color: '#60a5fa' },
          { label: 'Fines Pending',  val: stats.overdueIssues,                     icon: '⏰', color: '#f87171' },
          { label: 'Total Fines',    val: `Rs ${stats.totalFinesCollected}`,        icon: '💸', color: '#fbbf24' },
        ].map(({ label, val, icon, color }, i) => (
          <div key={label}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px 16px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.25s', cursor: 'default', animation: `cardIn 0.5s ${0.5 + i * 0.06}s ease both` }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.borderColor = `${color}33`; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{icon}</div>
            <div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color, fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
                {typeof val === 'number' ? <Counter value={val} /> : val}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes cardIn    { from{opacity:0;transform:translateY(22px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(18px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes pulse     { 0%,100%{opacity:1;box-shadow:0 0 12px #00d2ff} 50%{opacity:0.4;box-shadow:0 0 4px #00d2ff} }
        @keyframes blink     { 0%,100%{opacity:0.5} 50%{opacity:0.1} }
      `}</style>
    </div>
  )
}
