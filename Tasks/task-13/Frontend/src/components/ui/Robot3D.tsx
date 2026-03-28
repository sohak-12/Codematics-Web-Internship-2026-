"use client";

import { motion } from "framer-motion";

export function Robot3D({ size = 220 }: { size?: number }) {
  const s = size / 220; // scale factor

  return (
    <motion.div
      className="relative select-none"
      style={{ width: size, height: size * 1.15 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Shadow on ground */}
      <div
        className="absolute rounded-full"
        style={{
          width: 120 * s,
          height: 16 * s,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.25), transparent 70%)",
          animation: "robotShadow 4s ease-in-out infinite",
        }}
      />

      <svg
        viewBox="0 0 220 250"
        width={size}
        height={size * 1.15}
        className="relative z-10"
        style={{ filter: "drop-shadow(0 8px 24px rgba(124,58,237,0.2))" }}
      >
        <defs>
          {/* Body gradient */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          {/* Head gradient */}
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          {/* Eye glow */}
          <radialGradient id="eyeGlow">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
          {/* Screen gradient */}
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f0a2a" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── ANTENNA ── */}
        <line x1="110" y1="28" x2="110" y2="48" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
        <circle cx="110" cy="22" r="7" fill="#a78bfa" filter="url(#glow)">
          <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="110" cy="22" r="4" fill="#c4b5fd">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* ── HEAD ── */}
        <rect x="55" y="45" width="110" height="85" rx="28" fill="url(#headGrad)" />
        {/* Head highlight */}
        <rect x="62" y="50" width="96" height="30" rx="15" fill="white" opacity="0.08" />

        {/* ── FACE SCREEN ── */}
        <rect x="68" y="60" width="84" height="55" rx="16" fill="url(#screenGrad)" />
        {/* Screen border glow */}
        <rect x="68" y="60" width="84" height="55" rx="16" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3" />

        {/* ── EYES ── */}
        {/* Left eye */}
        <ellipse cx="92" cy="85" rx="10" ry="11" fill="url(#eyeGlow)" filter="url(#glow)">
          <animate attributeName="ry" values="11;2;11" dur="4s" begin="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="92" cy="83" rx="4" ry="4" fill="white" opacity="0.9" />
        {/* Right eye */}
        <ellipse cx="128" cy="85" rx="10" ry="11" fill="url(#eyeGlow)" filter="url(#glow)">
          <animate attributeName="ry" values="11;2;11" dur="4s" begin="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="128" cy="83" rx="4" ry="4" fill="white" opacity="0.9" />

        {/* ── MOUTH ── */}
        <path d="M 98 100 Q 110 110 122 100" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)">
          <animate attributeName="d" values="M 98 100 Q 110 110 122 100;M 98 102 Q 110 108 122 102;M 98 100 Q 110 110 122 100" dur="3s" repeatCount="indefinite" />
        </path>

        {/* ── EARS ── */}
        <rect x="42" y="72" width="16" height="28" rx="8" fill="url(#bodyGrad)" />
        <rect x="44" y="80" width="12" height="6" rx="3" fill="#06b6d4" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="162" y="72" width="16" height="28" rx="8" fill="url(#bodyGrad)" />
        <rect x="164" y="80" width="12" height="6" rx="3" fill="#06b6d4" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </rect>

        {/* ── NECK ── */}
        <rect x="97" y="128" width="26" height="14" rx="4" fill="#6d28d9" />

        {/* ── BODY ── */}
        <rect x="60" y="140" width="100" height="70" rx="20" fill="url(#bodyGrad)" />
        {/* Body highlight */}
        <rect x="67" y="145" width="86" height="25" rx="12" fill="white" opacity="0.06" />

        {/* ── CHEST PANEL ── */}
        <rect x="82" y="155" width="56" height="35" rx="10" fill="#1e1b4b" opacity="0.6" />
        {/* Heart / core */}
        <circle cx="110" cy="172" r="10" fill="#7c3aed" opacity="0.4">
          <animate attributeName="r" values="10;12;10" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="110" cy="172" r="5" fill="#a78bfa" filter="url(#glow)">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* ── ARMS ── */}
        {/* Left arm */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 60 150;5 60 150;0 60 150;-5 60 150;0 60 150" dur="5s" repeatCount="indefinite" />
          <rect x="32" y="148" width="30" height="16" rx="8" fill="url(#bodyGrad)" />
          <circle cx="32" cy="156" r="9" fill="#6d28d9" />
          <circle cx="32" cy="156" r="5" fill="#a78bfa" opacity="0.3" />
        </g>
        {/* Right arm */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 160 150;-5 160 150;0 160 150;5 160 150;0 160 150" dur="5s" begin="0.5s" repeatCount="indefinite" />
          <rect x="158" y="148" width="30" height="16" rx="8" fill="url(#bodyGrad)" />
          <circle cx="188" cy="156" r="9" fill="#6d28d9" />
          <circle cx="188" cy="156" r="5" fill="#a78bfa" opacity="0.3" />
        </g>

        {/* ── LEGS ── */}
        <rect x="78" y="208" width="20" height="22" rx="8" fill="#6d28d9" />
        <rect x="122" y="208" width="20" height="22" rx="8" fill="#6d28d9" />
        {/* Feet */}
        <rect x="72" y="226" width="30" height="12" rx="6" fill="url(#bodyGrad)" />
        <rect x="118" y="226" width="30" height="12" rx="6" fill="url(#bodyGrad)" />
      </svg>

      <style jsx global>{`
        @keyframes robotShadow {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.25; }
          50% { transform: translateX(-50%) scaleX(0.8); opacity: 0.15; }
        }
      `}</style>
    </motion.div>
  );
}
