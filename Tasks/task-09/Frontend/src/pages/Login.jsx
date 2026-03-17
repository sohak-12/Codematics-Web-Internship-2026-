import { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../api';

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 10,
  opacity: Math.random() * 0.5 + 0.1,
}));

const FLOATING_ICONS = ['📚', '🔖', '📖', '✨', '🌟', '📝', '🔐', '💫'];

function TypeWriter({ texts, speed = 80 }) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setIdx(i => (i + 1) % texts.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);

  return (
    <span>
      {display}
      <span className="animate-pulse text-[#00d2ff]">|</span>
    </span>
  );
}

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [ripple, setRipple] = useState(false);
  const cardRef = useRef(null);
  const toastContext = useToast();
  const showToast = toastContext?.showToast || ((msg) => console.log(msg));

  // 3D tilt effect
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        showToast('System Access Granted.', 'success');
        onLogin();
      }
    } catch {
      showToast('Access Denied: Invalid Credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/BG.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: 'absolute', width: '600px', height: '600px',
          borderRadius: '50%', top: '-100px', left: '-150px',
          background: 'radial-gradient(circle, rgba(0,210,255,0.12) 0%, transparent 70%)',
          animation: 'orbFloat1 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%', bottom: '-100px', right: '-100px',
          background: 'radial-gradient(circle, rgba(120,0,255,0.1) 0%, transparent 70%)',
          animation: 'orbFloat2 15s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', top: '40%', left: '60%',
          background: 'radial-gradient(circle, rgba(0,210,255,0.07) 0%, transparent 70%)',
          animation: 'orbFloat3 10s ease-in-out infinite',
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%',
            background: '#00d2ff',
            opacity: p.opacity,
            animation: `particleFloat ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
            boxShadow: `0 0 ${p.size * 3}px rgba(0,210,255,0.8)`,
          }} />
        ))}
      </div>

      {/* Floating emoji icons */}
      {FLOATING_ICONS.map((icon, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${8 + i * 12}%`,
          top: `${15 + (i % 3) * 25}%`,
          fontSize: `${1.2 + (i % 3) * 0.4}rem`,
          opacity: 0.12,
          animation: `iconFloat ${8 + i * 1.5}s ${i * 0.8}s ease-in-out infinite alternate`,
          pointerEvents: 'none',
          filter: 'blur(0.5px)',
        }}>
          {icon}
        </div>
      ))}

      {/* Grid lines overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(0,210,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Main card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%', maxWidth: '420px',
          padding: '48px 40px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(0,210,255,0.2)',
          borderRadius: '28px',
          boxShadow: '0 0 60px rgba(0,210,255,0.08), 0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          transition: 'transform 0.1s ease, box-shadow 0.3s ease',
          position: 'relative',
          animation: 'cardEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
          background: 'linear-gradient(90deg, transparent, #00d2ff, transparent)',
          borderRadius: '50%',
        }} />

        {/* Corner accents */}
        {[
          { top: 0, left: 0, borderTop: '2px solid #00d2ff', borderLeft: '2px solid #00d2ff', borderRadius: '28px 0 0 0' },
          { top: 0, right: 0, borderTop: '2px solid #00d2ff', borderRight: '2px solid #00d2ff', borderRadius: '0 28px 0 0' },
          { bottom: 0, left: 0, borderBottom: '2px solid rgba(0,210,255,0.4)', borderLeft: '2px solid rgba(0,210,255,0.4)', borderRadius: '0 0 0 28px' },
          { bottom: 0, right: 0, borderBottom: '2px solid rgba(0,210,255,0.4)', borderRight: '2px solid rgba(0,210,255,0.4)', borderRadius: '0 0 28px 0' },
        ].map((style, i) => (
          <div key={i} style={{ position: 'absolute', width: '20px', height: '20px', ...style }} />
        ))}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          {/* Logo icon */}
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, rgba(0,210,255,0.15), rgba(120,0,255,0.1))',
            border: '1px solid rgba(0,210,255,0.3)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 0 30px rgba(0,210,255,0.2)',
            animation: 'iconPulse 3s ease-in-out infinite',
          }}>
            📚
          </div>

          <h1 style={{
            fontSize: '1.9rem', fontWeight: 900, color: '#ffffff',
            letterSpacing: '-0.02em', margin: 0, fontFamily: 'Syne, sans-serif',
            textShadow: '0 0 30px rgba(0,210,255,0.3)',
          }}>
            Soha's <span style={{ color: '#00d2ff', textShadow: '0 0 20px rgba(0,210,255,0.8)' }}>Atheneum</span>
          </h1>

          <p style={{
            fontSize: '11px', color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.25em', marginTop: '8px',
            fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
          }}>
            <TypeWriter texts={['Authenticate to access', 'Library Management', 'Secure Portal v2.0', 'Welcome Back, Admin']} />
          </p>

          {/* Divider */}
          <div style={{
            height: '1px', marginTop: '20px',
            background: 'linear-gradient(90deg, transparent, rgba(0,210,255,0.3), transparent)',
          }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Username field */}
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'block', fontSize: '9px', fontWeight: 700,
              color: focused === 'username' ? '#00d2ff' : 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '0.2em',
              marginBottom: '8px', marginLeft: '4px',
              fontFamily: 'JetBrains Mono, monospace',
              transition: 'color 0.3s',
            }}>
              ⬡ Username
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '14px', opacity: 0.4,
              }}>👤</span>
              <input
                type="text"
                placeholder="Enter your ID"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused(null)}
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '13px 16px 13px 40px',
                  background: focused === 'username' ? 'rgba(0,210,255,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${focused === 'username' ? '#00d2ff' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px', color: '#000000', fontSize: '14px',
                  outline: 'none', transition: 'all 0.3s ease',
                  fontFamily: 'JetBrains Mono, monospace',
                  boxShadow: focused === 'username' ? '0 0 20px rgba(0,210,255,0.15), inset 0 0 10px rgba(0,210,255,0.05)' : 'none',
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'block', fontSize: '9px', fontWeight: 700,
              color: focused === 'password' ? '#00d2ff' : 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '0.2em',
              marginBottom: '8px', marginLeft: '4px',
              fontFamily: 'JetBrains Mono, monospace',
              transition: 'color 0.3s',
            }}>
              ⬡ Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '14px', opacity: 0.4,
              }}>🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '13px 44px 13px 40px',
                  background: focused === 'password' ? 'rgba(0,210,255,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${focused === 'password' ? '#00d2ff' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px', color: '#000000', fontSize: '14px',
                  outline: 'none', transition: 'all 0.3s ease',
                  fontFamily: 'JetBrains Mono, monospace',
                  boxShadow: focused === 'password' ? '0 0 20px rgba(0,210,255,0.15), inset 0 0 10px rgba(0,210,255,0.05)' : 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', opacity: 0.5, padding: '4px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.5}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px', padding: '15px',
              background: loading
                ? 'rgba(0,210,255,0.1)'
                : '#00d2ff',
              border: loading ? '1px solid rgba(0,210,255,0.3)' : 'none',
              borderRadius: '12px', color: loading ? '#00d2ff' : '#000000',
              fontSize: '13px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: 'JetBrains Mono, monospace',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 0 30px rgba(0,210,255,0.4), 0 8px 20px rgba(0,0,0,0.4)',
              position: 'relative', overflow: 'hidden',
              transform: ripple ? 'scale(0.97)' : 'scale(1)',
            }}
            onMouseEnter={e => { if (!loading) { e.target.style.boxShadow = '0 0 50px rgba(0,210,255,0.7), 0 8px 30px rgba(0,0,0,0.5)'; e.target.style.transform = 'translateY(-2px)'; } }}
            onMouseLeave={e => { if (!loading) { e.target.style.boxShadow = '0 0 30px rgba(0,210,255,0.4), 0 8px 20px rgba(0,0,0,0.4)'; e.target.style.transform = 'translateY(0)'; } }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                INITIALIZING...
              </span>
            ) : (
              '⚡ ACCESS SYSTEM'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '24px', textAlign: 'center',
          fontSize: '10px', color: 'rgba(255,255,255,0.2)',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em',
        }}>
          🔐 SECURED · ENCRYPTED · PROTECTED
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(1.05); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
          100% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
        }
        @keyframes iconFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: perspective(1000px) translateY(40px) scale(0.95); }
          to { opacity: 1; transform: perspective(1000px) translateY(0) scale(1); }
        }
        @keyframes iconPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(0,210,255,0.2); transform: scale(1); }
          50% { box-shadow: 0 0 50px rgba(0,210,255,0.5); transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 100px transparent inset !important;
          box-shadow: 0 0 0 100px transparent inset !important;
          -webkit-text-fill-color: #000000 !important;
          background-color: transparent !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
