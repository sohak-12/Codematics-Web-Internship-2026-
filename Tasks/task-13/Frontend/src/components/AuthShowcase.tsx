"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Brain, Code2, Server, BarChart3, Star, TrendingUp, CheckCircle, MessageSquare, Sparkles } from "lucide-react";

/* ── Demo Data ── */
const SCORES = [
  { label: "Communication", score: 8.5, color: "#06b6d4" },
  { label: "Technical", score: 7.2, color: "#10b981" },
  { label: "Confidence", score: 9.0, color: "#f59e0b" },
  { label: "Problem Solving", score: 7.8, color: "#ec4899" },
];

const TRANSCRIPT = [
  { role: "ai", text: "Can you explain the difference between useState and useEffect?" },
  { role: "user", text: "useState manages state, useEffect handles side effects like API calls..." },
  { role: "ai", text: "Great! How does React handle re-rendering?" },
  { role: "user", text: "React re-renders when state or props change, using virtual DOM diffing..." },
];

const CATEGORIES = [
  { name: "Frontend", icon: Code2, color: "#61DAFB", count: "2.4K" },
  { name: "Backend", icon: Server, color: "#68A063", count: "1.8K" },
  { name: "System Design", icon: Brain, color: "#34D399", count: "950" },
  { name: "Behavioral", icon: MessageSquare, color: "#F472B6", count: "1.2K" },
];

const FEEDBACK = [
  { type: "strength", text: "Excellent explanation of React lifecycle" },
  { type: "strength", text: "Clear and confident communication" },
  { type: "weakness", text: "Could improve on JavaScript closures" },
  { type: "suggestion", text: "Practice system design patterns" },
];

/* ── Slide Components ── */
function SlideScores() {
  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a78bfa]">Interview Score</span>
        <span className="text-[11px] text-white/30">Frontend · Today</span>
      </div>
      <div className="text-center py-2">
        <motion.p variants={itemV} className="text-5xl font-black text-white font-[Space_Grotesk]">8.1</motion.p>
        <p className="text-white/40 text-xs mt-1">Overall Score</p>
      </div>
      <div className="space-y-3">
        {SCORES.map((s, i) => (
          <motion.div key={s.label} variants={itemV} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/60">{s.label}</span>
              <span className="font-bold" style={{ color: s.color }}>{s.score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`, boxShadow: `0 0 8px ${s.color}40` }}
                initial={{ width: 0 }}
                animate={{ width: `${(s.score / 10) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SlideTranscript() {
  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a78bfa]">Live Transcript</span>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>
      </div>
      {TRANSCRIPT.map((t, i) => (
        <motion.div
          key={i}
          variants={itemV}
          className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
              t.role === "user"
                ? "bg-[#7c3aed]/20 text-white/80 border border-[#7c3aed]/20"
                : "bg-white/5 text-white/60 border border-white/5"
            }`}
          >
            <span className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: t.role === "user" ? "#a78bfa" : "#71717a" }}>
              {t.role === "user" ? "You" : "AI Interviewer"}
            </span>
            {t.text}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SlideCategories() {
  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a78bfa]">Popular Categories</span>
        <span className="text-[11px] text-white/30">13+ available</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              variants={itemV}
              className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${cat.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: cat.color }} />
              </div>
              <p className="text-white/80 text-xs font-semibold">{cat.name}</p>
              <p className="text-white/30 text-[10px]">{cat.count} interviews</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SlideFeedback() {
  return (
    <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a78bfa]">AI Feedback</span>
        <span className="text-[11px] text-white/30">Instant analysis</span>
      </div>
      {FEEDBACK.map((f, i) => {
        const isStrength = f.type === "strength";
        const isSuggestion = f.type === "suggestion";
        const color = isStrength ? "#10b981" : isSuggestion ? "#f59e0b" : "#ef4444";
        const Icon = isStrength ? CheckCircle : isSuggestion ? Sparkles : TrendingUp;
        return (
          <motion.div
            key={i}
            variants={itemV}
            className="flex items-start gap-2.5 p-2.5 rounded-xl border border-white/5 bg-white/[0.02]"
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}15` }}>
              <Icon className="w-3 h-3" style={{ color }} />
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color }}>
                {f.type}
              </span>
              <p className="text-white/60 text-xs leading-relaxed">{f.text}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ── Animation Variants ── */
const containerV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemV = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

/* ── Story metadata ── */
const STORIES = [
  { id: "scores", headline: "Instant performance scoring", sub: "AI analyzes your answers and rates communication, technical depth, and confidence.", Component: SlideScores },
  { id: "transcript", headline: "Real-time voice transcription", sub: "Every word captured live as you practice with the AI interviewer.", Component: SlideTranscript },
  { id: "categories", headline: "13+ interview categories", sub: "Frontend, Backend, System Design, HR, Behavioral, DSA and more.", Component: SlideCategories },
  { id: "feedback", headline: "Actionable AI feedback", sub: "Strengths, weaknesses, and expert suggestions after every session.", Component: SlideFeedback },
];

/* ── Main Export ── */
export function AuthShowcase({ activeSlide, onDotClick }: { activeSlide: number; onDotClick: (i: number) => void }) {
  const story = STORIES[activeSlide] || STORIES[0];
  const { Component } = story;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[460px] mx-auto">
      {/* Browser Window Frame */}
      <div className="w-full rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-500">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
          <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f56]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[10px] uppercase tracking-[0.12em] text-white/25 font-semibold">Preplyx — AI Interview</span>
        </div>

        {/* Content */}
        <div className="p-5 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <Component />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Story text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`meta-${activeSlide}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-sm"
        >
          <p className="text-xl font-bold text-white font-[Space_Grotesk] mb-1.5 leading-tight">{story.headline}</p>
          <p className="text-white/40 text-sm leading-relaxed">{story.sub}</p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-2.5">
        {STORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeSlide ? "w-7 bg-[#a78bfa] shadow-[0_0_10px_rgba(167,139,250,0.5)]" : "w-2.5 bg-white/10 hover:bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
