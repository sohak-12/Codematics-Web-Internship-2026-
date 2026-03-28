"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScoreRing } from "@/components/ui/ScoreRing";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowLeft,
  Trophy,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Award,
  Target,
  Crown,
  Flame,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas-pro";

interface Feedback {
  overallScore: number;
  communication: number;
  technicalKnowledge: number;
  confidence: number;
  problemSolving: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

/* ─── helpers ─── */
function getGrade(s: number) {
  const v = Number.isFinite(s) ? s : 0;
  if (v >= 9) return { grade: "S+", label: "Legendary", color: "#10b981", bg: "rgba(16,185,129,0.1)" };
  if (v >= 8) return { grade: "S", label: "Outstanding", color: "#10b981", bg: "rgba(16,185,129,0.08)" };
  if (v >= 7) return { grade: "A", label: "Excellent", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" };
  if (v >= 5) return { grade: "B", label: "Good", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" };
  if (v >= 3) return { grade: "C", label: "Needs Work", color: "#f97316", bg: "rgba(249,115,22,0.08)" };
  return { grade: "D", label: "Keep Practicing", color: "#ef4444", bg: "rgba(239,68,68,0.08)" };
}

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!safeValue) { setCount(0); return; }
    let start = 0;
    const step = safeValue / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= safeValue) { setCount(safeValue); clearInterval(id); }
      else setCount(Math.round(start * 10) / 10);
    }, 16);
    return () => clearInterval(id);
  }, [safeValue, duration]);
  return <>{count.toFixed(1)}</>;
}

function ConfettiParticle({ delay, x, index }: { delay: number; x: number; index: number }) {
  const colors = ["#7c3aed", "#a78bfa", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];
  const color = colors[index % colors.length];
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ background: color, left: `${x}%`, top: "-5%" }}
      initial={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: 0, y: "120vh", rotate: 720, scale: 0 }}
      transition={{ duration: 3 + (index % 3), delay, ease: "easeOut" }}
    />
  );
}

function FloatingOrb({ color, size, x, y, dur }: { color: string; size: number; x: string; y: string; dur: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, left: x, top: y, opacity: 0.12 }}
      animate={{ y: [0, -30, 0, 20, 0], x: [0, 15, -10, 5, 0], scale: [1, 1.1, 0.95, 1.05, 1] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function ProgressBar({ value, max = 10, color, delay = 0 }: { value: number; max?: number; color: string; delay?: number }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((safeValue / max) * 100), delay);
    return () => clearTimeout(t);
  }, [safeValue, max, delay]);
  return (
    <div className="h-2 rounded-full bg-[var(--border-glass)] overflow-hidden relative">
      <motion.div
        className="h-full rounded-full relative"
        style={{
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 12px ${color}40`,
          transition: "width 1.5s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            animation: "shimmer 2s infinite",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── main component ─── */
export function FeedbackReport({
  feedback,
  category,
  createdAt,
}: {
  feedback: Feedback;
  category: string;
  createdAt: string;
}) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [saving, setSaving] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const gradeInfo = useMemo(() => getGrade(feedback.overallScore), [feedback.overallScore]);

  const handleSaveReport = useCallback(async () => {
    if (!reportRef.current || saving) return;
    setSaving(true);
    try {
      // Temporarily hide the footer CTA buttons for clean capture
      const el = reportRef.current;
      const canvas = await html2canvas(el, {
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim() || "#0a0a0f",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });
      const link = document.createElement("a");
      link.download = `Preplyx-Report-${category}-${new Date(createdAt).toLocaleDateString("en-CA")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback to print
      window.print();
    } finally {
      setSaving(false);
    }
  }, [saving, category, createdAt]);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const strengths = feedback.strengths ?? [];
  const weaknesses = feedback.weaknesses ?? [];
  const suggestions = feedback.suggestions ?? [];

  const scoreBreakdown = [
    { label: "Communication", value: feedback.communication, color: "#06b6d4", icon: Zap },
    { label: "Technical Knowledge", value: feedback.technicalKnowledge, color: "#10b981", icon: Target },
    { label: "Confidence", value: feedback.confidence, color: "#f59e0b", icon: Flame },
    { label: "Problem Solving", value: feedback.problemSolving, color: "#ec4899", icon: TrendingUp },
  ];

  const sections = [
    {
      title: "Strengths",
      subtitle: "What you nailed",
      items: strengths,
      icon: CheckCircle,
      accentIcon: Star,
      color: "#10b981",
      gradient: "from-emerald-500/10 to-transparent",
      borderColor: "rgba(16,185,129,0.15)",
    },
    {
      title: "Areas for Improvement",
      subtitle: "Room to grow",
      items: weaknesses,
      icon: XCircle,
      accentIcon: Target,
      color: "#ef4444",
      gradient: "from-red-500/10 to-transparent",
      borderColor: "rgba(239,68,68,0.15)",
    },
    {
      title: "Pro Suggestions",
      subtitle: "Expert recommendations",
      items: suggestions,
      icon: Lightbulb,
      accentIcon: Sparkles,
      color: "#f59e0b",
      gradient: "from-amber-500/10 to-transparent",
      borderColor: "rgba(245,158,11,0.15)",
    },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-16 relative overflow-hidden">
      {/* ── Floating Orbs ── */}
      <FloatingOrb color="#7c3aed" size={400} x="-10%" y="5%" dur={18} />
      <FloatingOrb color="#ec4899" size={300} x="80%" y="20%" dur={22} />
      <FloatingOrb color="#06b6d4" size={250} x="60%" y="60%" dur={15} />
      <FloatingOrb color="#10b981" size={200} x="10%" y="75%" dur={20} />

      {/* ── Confetti ── */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <ConfettiParticle key={i} delay={i * 0.08} x={(i * 2.5) % 100} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div ref={reportRef} className="max-w-4xl mx-auto relative z-10">
        {/* ── Back Button ── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-all mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
          </Link>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative mb-10"
        >
          <div className="gradient-border p-8 md:p-10 text-center relative overflow-hidden">
            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            {/* Animated gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px]">
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${gradeInfo.color}, var(--accent), ${gradeInfo.color}, transparent)`,
                  animation: "shimmer 3s infinite",
                }}
              />
            </div>

            {/* Trophy + Grade */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="relative inline-block mb-5"
            >
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center relative"
                style={{ background: gradeInfo.bg, border: `1px solid ${gradeInfo.color}25` }}
              >
                <Trophy className="w-9 h-9" style={{ color: gradeInfo.color }} />
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${gradeInfo.color}, ${gradeInfo.color}cc)` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                >
                  {gradeInfo.grade}
                </motion.div>
              </div>
              {/* Sparkle accents */}
              <motion.div
                className="absolute -top-3 -left-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-[var(--accent-light)] opacity-60" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-4"
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-3.5 h-3.5 text-[var(--warning)] opacity-50" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-black text-[var(--text-primary)] font-[Space_Grotesk] mb-2 tracking-tight"
            >
              Stellar Feedback Report
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <span className="badge badge-tech capitalize text-xs">{category}</span>
              <span className="text-[var(--text-muted)] text-xs">•</span>
              <span className="text-[var(--text-muted)] text-xs">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </motion.div>

            {/* Grade label */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
              style={{ background: gradeInfo.bg, color: gradeInfo.color, border: `1px solid ${gradeInfo.color}20` }}
            >
              <Crown className="w-4 h-4" />
              {gradeInfo.label} Performance
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            OVERALL SCORE — HERO RING
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="gradient-border p-8 md:p-10 mb-8"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
            >
              <ScoreRing
                score={feedback.overallScore}
                label="Overall Score"
                color={gradeInfo.color}
                size={140}
                delay={600}
              />
            </motion.div>
          </div>

          {/* Sub-scores grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: "Communication", score: feedback.communication, color: "#06b6d4", delay: 800 },
              { label: "Technical", score: feedback.technicalKnowledge, color: "#10b981", delay: 1000 },
              { label: "Confidence", score: feedback.confidence, color: "#f59e0b", delay: 1200 },
              { label: "Problem Solving", score: feedback.problemSolving, color: "#ec4899", delay: 1400 },
            ].map((s) => (
              <ScoreRing key={s.label} score={s.score} label={s.label} color={s.color} size={100} delay={s.delay} />
            ))}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            DETAILED BREAKDOWN — PROGRESS BARS
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-static p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-[Space_Grotesk] mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--accent)]" />
            Detailed Breakdown
          </h2>
          <div className="space-y-5">
            {scoreBreakdown.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${item.color}15` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold font-[Space_Grotesk]" style={{ color: item.color }}>
                      <AnimatedCounter value={item.value} duration={1500} /> / 10
                    </span>
                  </div>
                  <ProgressBar value={item.value} color={item.color} delay={900 + i * 150} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            SUMMARY — PREMIUM QUOTE CARD
        ═══════════════════════════════════════════════ */}
        {feedback.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="relative mb-8"
          >
            <div className="gradient-border p-6 md:p-8 relative overflow-hidden">
              {/* Accent corner decoration */}
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-[0.04]"
                style={{
                  background: `radial-gradient(circle at top right, var(--accent), transparent 70%)`,
                }}
              />
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center border border-[var(--accent)]/10">
                    <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider mb-2 font-[Space_Grotesk]">
                    AI Summary
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed italic">
                    &ldquo;{feedback.summary}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            STRENGTHS / WEAKNESSES / SUGGESTIONS
        ═══════════════════════════════════════════════ */}
        <div className="space-y-6">
          {sections.map(({ title, subtitle, items, icon: Icon, accentIcon: AccentIcon, color, borderColor }, si) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + si * 0.15, duration: 0.6 }}
            >
              <div
                className="glass-static p-6 md:p-8 relative overflow-hidden group"
                style={{ borderColor }}
              >
                {/* Top gradient accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                />

                {/* Background gradient */}
                <div
                  className="absolute top-0 left-0 w-full h-32 opacity-30 pointer-events-none"
                  style={{ background: `linear-gradient(180deg, ${color}08, transparent)` }}
                />

                {/* Floating accent icon */}
                <div className="absolute top-4 right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                  <AccentIcon className="w-24 h-24" style={{ color }} />
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 relative">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] font-[Space_Grotesk] text-base">
                      {title}
                    </h3>
                    <p className="text-[var(--text-muted)] text-xs">{subtitle}</p>
                  </div>
                  <div
                    className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: `${color}12`, color }}
                  >
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 relative">
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + si * 0.15 + i * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-glass)] transition-all group/item"
                    >
                      {/* Number badge */}
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                        style={{ background: `${color}12`, color, border: `1px solid ${color}15` }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed group-hover/item:text-[var(--text-primary)] transition-colors">
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════
            FOOTER CTA
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-10 text-center"
        >
          <div className="gradient-border p-8 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <Sparkles className="w-8 h-8 text-[var(--accent)] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[var(--text-primary)] font-[Space_Grotesk] mb-2">
              Ready for Another Round?
            </h3>
            <p className="text-[var(--text-muted)] text-sm mb-5 max-w-md mx-auto">
              Every practice session brings you closer to your dream role. Keep pushing your limits!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/dashboard">
                <button className="btn-glow !px-6 !py-2.5 text-sm">
                  <Zap className="w-4 h-4" /> Practice Again
                </button>
              </Link>
              <button
                onClick={handleSaveReport}
                disabled={saving}
                className="glass-static !rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-glass-hover)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Report"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Powered by line ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center text-[var(--text-muted)] text-[10px] mt-6 tracking-widest uppercase"
        >
          Powered by Preplyx AI Engine
        </motion.p>
      </div>

      {/* ── Shimmer keyframe (injected) ── */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
