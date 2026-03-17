import { useState } from 'react';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard',     icon: '◈', section: 'Overview',      desc: 'System overview' },
  { id: 'books',     label: 'Books',         icon: '📚', section: 'Catalog',       desc: 'Manage catalog' },
  { id: 'members',   label: 'Members',       icon: '👥', section: 'Catalog',       desc: 'Manage members' },
  { id: 'issues',    label: 'Issue & Return', icon: '🔄', section: 'Transactions', desc: 'Book transactions' },
  { id: 'search',    label: 'Search',        icon: '🔍', section: 'Transactions', desc: 'Find anything' },
];

const SECTIONS = [...new Set(PAGES.map(p => p.section))];

export default function Sidebar({ page, setPage, onLogout }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: '260px',
      background: 'rgba(0,0,0,0.15)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(0,210,255,0.12)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
      boxShadow: '4px 0 60px rgba(0,0,0,0.8), inset -1px 0 0 rgba(0,210,255,0.05)',
    }}>

      {/* Ambient top glow */}
      <div style={{
        position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,210,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
      }}>
        {/* Left accent bar */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
          background: 'linear-gradient(180deg, #00d2ff, rgba(0,210,255,0.2))',
          boxShadow: '0 0 15px rgba(0,210,255,0.8)',
        }} />

        {/* Logo */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(0,210,255,0.2), rgba(120,0,255,0.1))',
          border: '1px solid rgba(0,210,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', marginBottom: '14px',
          boxShadow: '0 0 20px rgba(0,210,255,0.2)',
        }}>📚</div>

        <div style={{
          fontSize: '16px', fontWeight: 900, color: '#ffffff',
          fontFamily: 'Syne, sans-serif', letterSpacing: '-0.01em',
        }}>
          Library<span style={{ color: '#00d2ff' }}>.</span>
        </div>
        <div style={{
          fontSize: '9px', color: 'rgba(0,210,255,0.6)',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '3px',
        }}>
          Soha's Atheneum
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '20px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {SECTIONS.map(sec => (
          <div key={sec}>
            <div style={{
              fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase', letterSpacing: '0.35em',
              fontFamily: 'JetBrains Mono, monospace',
              padding: '0 10px', marginBottom: '8px',
            }}>{sec}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {PAGES.filter(p => p.section === sec).map(p => {
                const isActive = page === p.id;
                const isHovered = hoveredItem === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPage(p.id)}
                    onMouseEnter={() => setHoveredItem(p.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '11px 12px', borderRadius: '12px', cursor: 'pointer',
                      transition: 'all 0.25s ease', position: 'relative',
                      background: isActive
                        ? 'rgba(0,210,255,0.1)'
                        : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                      border: isActive
                        ? '1px solid rgba(0,210,255,0.25)'
                        : '1px solid transparent',
                      boxShadow: isActive ? '0 0 20px rgba(0,210,255,0.1), inset 0 0 15px rgba(0,210,255,0.05)' : 'none',
                    }}
                  >
                    {/* Active left indicator */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: 0, top: '20%', bottom: '20%',
                        width: '3px', borderRadius: '0 3px 3px 0',
                        background: '#00d2ff',
                        boxShadow: '0 0 10px #00d2ff',
                      }} />
                    )}

                    <span style={{
                      fontSize: '16px', lineHeight: 1,
                      transition: 'transform 0.3s',
                      transform: isHovered || isActive ? 'scale(1.2)' : 'scale(1)',
                      filter: isActive ? 'drop-shadow(0 0 6px rgba(0,210,255,0.8))' : 'none',
                    }}>{p.icon}</span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px', fontWeight: 700,
                        color: isActive ? '#00d2ff' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.55)',
                        fontFamily: 'Syne, sans-serif', transition: 'color 0.25s',
                        letterSpacing: '0.01em',
                      }}>{p.label}</div>
                      {(isActive || isHovered) && (
                        <div style={{
                          fontSize: '9px', color: 'rgba(255,255,255,0.3)',
                          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em',
                          marginTop: '1px',
                        }}>{p.desc}</div>
                      )}
                    </div>

                    {isActive && (
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#00d2ff', boxShadow: '0 0 8px #00d2ff',
                        animation: 'dotPulse 2s ease-in-out infinite',
                        flexShrink: 0,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 14px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Avatar */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(0,210,255,0.3), rgba(120,0,255,0.2))',
            border: '1px solid rgba(0,210,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>👩‍💼</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '12px', fontWeight: 700, color: '#ffffff',
              fontFamily: 'Syne, sans-serif', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>Soha Muzammil</div>
            <div style={{
              fontSize: '9px', color: '#00d2ff',
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>Admin</div>
          </div>

          <button
            onClick={onLogout}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
            title="Logout"
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: 'none',
              background: logoutHover ? 'rgba(248,113,113,0.9)' : 'rgba(248,113,113,0.1)',
              color: logoutHover ? '#ffffff' : '#f87171',
              cursor: 'pointer', fontSize: '14px',
              transition: 'all 0.25s ease', flexShrink: 0,
              boxShadow: logoutHover ? '0 0 20px rgba(248,113,113,0.4)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >⏻</button>
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #00d2ff; }
          50%       { opacity: 0.4; box-shadow: 0 0 3px #00d2ff; }
        }
      `}</style>
    </aside>
  );
}
