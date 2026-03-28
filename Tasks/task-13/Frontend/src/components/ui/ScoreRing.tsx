"use client";

import { useEffect, useState } from "react";

export function ScoreRing({
  score,
  max = 10,
  size = 100,
  label,
  color = "#7c3aed",
  delay = 0,
}: {
  score: number;
  max?: number;
  size?: number;
  label: string;
  color?: string;
  delay?: number;
}) {
  const safeScore = Number.isFinite(score) ? score : 0;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const strokeWidth = 6;
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const p = Number.isFinite(animatedScore) ? (animatedScore / max) * c : 0;

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), delay);
    const t2 = setTimeout(() => {
      if (!safeScore) { setAnimatedScore(0); return; }
      let current = 0;
      const step = safeScore / 30;
      const interval = setInterval(() => {
        current += step;
        if (current >= safeScore) {
          setAnimatedScore(safeScore);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.round(current * 10) / 10);
        }
      }, 30);
    }, delay + 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [safeScore, delay]);

  const grade =
    safeScore >= 9 ? "S" : safeScore >= 7 ? "A" : safeScore >= 5 ? "B" : safeScore >= 3 ? "C" : "D";
  const gradeColor =
    safeScore >= 9
      ? "#10b981"
      : safeScore >= 7
      ? "#7c3aed"
      : safeScore >= 5
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div
      className="flex flex-col items-center gap-2.5 group"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
        transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="relative">
        {/* Outer glow halo */}
        <div
          className="absolute inset-[-8px] rounded-full opacity-40 blur-xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: `radial-gradient(circle, ${color}50, transparent 70%)` }}
        />
        {/* Background glow pulse */}
        <div
          className="absolute inset-[-4px] rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
            animationDuration: "3s",
          }}
        />
        <svg width={size} height={size} className="-rotate-90 relative z-10">
          <defs>
            <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="50%" stopColor={`${color}cc`} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
            <filter id={`glow-${label}`}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border-glass)"
            strokeWidth={strokeWidth}
            opacity={0.5}
          />
          {/* Animated arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#grad-${label})`}
            strokeWidth={strokeWidth}
            strokeDasharray={c}
            strokeDashoffset={Number.isFinite(c - p) ? c - p : c}
            strokeLinecap="round"
            filter={`url(#glow-${label})`}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.23, 1, 0.32, 1)" }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span
            className="text-2xl font-black font-[Space_Grotesk] tracking-tight"
            style={{ color }}
          >
            {animatedScore.toFixed(1)}
          </span>
          <span
            className="text-[9px] font-bold tracking-widest uppercase mt-[-2px]"
            style={{ color: gradeColor }}
          >
            {grade}
          </span>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-[var(--text-muted)] tracking-wide uppercase group-hover:text-[var(--text-secondary)] transition-colors">
        {label}
      </span>
    </div>
  );
}
