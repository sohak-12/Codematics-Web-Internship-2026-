import React from 'react';

const S = {
  label: {
    display: 'block', fontSize: '9px', fontWeight: 700,
    color: 'rgba(0,210,255,0.7)', textTransform: 'uppercase',
    letterSpacing: '0.22em', marginBottom: '7px', marginLeft: '2px',
    fontFamily: 'JetBrains Mono, monospace',
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#ffffff', fontSize: '13px',
    outline: 'none', fontFamily: 'JetBrains Mono, monospace',
    transition: 'all 0.25s ease',
  },
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: 'rgba(8,8,16,0.92)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(0,210,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 0 80px rgba(0,210,255,0.1), 0 40px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          animation: 'modalEntrance 0.35s cubic-bezier(0.175,0.885,0.32,1.275)',
          position: 'relative',
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, #00d2ff, transparent)',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,210,255,0.03)',
        }}>
          <h2 style={{
            margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff',
            fontFamily: 'Syne, sans-serif', letterSpacing: '0.02em',
          }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(248,113,113,0.2)'; e.target.style.color = '#f87171'; e.target.style.borderColor = 'rgba(248,113,113,0.4)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'rgba(255,255,255,0.5)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >✕</button>
        </div>

        <div style={{ padding: '24px' }}>{children}</div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalEntrance {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-input:focus {
          border-color: #00d2ff !important;
          box-shadow: 0 0 0 3px rgba(0,210,255,0.1) !important;
          background: rgba(0,210,255,0.05) !important;
        }
        .modal-input option { background: #0a0a14; color: #fff; }
        .modal-input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}

export function EmptyState({ icon, text, sub }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px', gap: '12px',
    }}>
      <div style={{ fontSize: '52px', animation: 'float 3s ease-in-out infinite' }}>{icon}</div>
      <div style={{
        fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.3)',
        fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em',
      }}>{text}</div>
      {sub && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>{sub}</div>}
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${value ? 'rgba(0,210,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '12px', padding: '10px 16px', marginBottom: '20px',
      transition: 'all 0.25s ease',
      boxShadow: value ? '0 0 20px rgba(0,210,255,0.1)' : 'none',
    }}>
      <span style={{ fontSize: '14px', opacity: 0.4 }}>🔍</span>
      <input
        style={{
          background: 'transparent', flex: 1, border: 'none', outline: 'none',
          color: '#ffffff', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace',
        }}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px',
            color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '11px',
            padding: '2px 8px', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#ffffff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
        >✕</button>
      )}
    </div>
  )
}

export function FormGroup({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? 'span 2' : 'span 1' }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <div style={{
        width: '36px', height: '36px',
        border: '3px solid rgba(0,210,255,0.15)',
        borderTop: '3px solid #00d2ff',
        borderRadius: '50%', animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// Shared styled input/select for use in forms
export function StyledInput({ type = 'text', value, onChange, placeholder, required, min }) {
  const [focused, setFocused] = React.useState(false)
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} required={required} min={min}
      className="modal-input"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...S.input,
        borderColor: focused ? '#00d2ff' : 'rgba(255,255,255,0.1)',
        boxShadow: focused ? '0 0 0 3px rgba(0,210,255,0.1)' : 'none',
        background: focused ? 'rgba(0,210,255,0.05)' : 'rgba(255,255,255,0.04)',
      }}
    />
  )
}

export function StyledSelect({ value, onChange, required, children }) {
  const [focused, setFocused] = React.useState(false)
  return (
    <select
      value={value} onChange={onChange} required={required}
      className="modal-input"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...S.input,
        borderColor: focused ? '#00d2ff' : 'rgba(255,255,255,0.1)',
        boxShadow: focused ? '0 0 0 3px rgba(0,210,255,0.1)' : 'none',
        background: focused ? 'rgba(0,210,255,0.05)' : 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
      }}
    >{children}</select>
  )
}
