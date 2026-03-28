"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase-client";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/constants/categories";
import { Robot3D } from "@/components/ui/Robot3D";
import {
  BarChart3, Clock, Trophy, TrendingUp, Loader2, Plus, Mic,
  ArrowUpRight, Calendar, Zap, Sparkles, Crown, Flame, Star,
  Target, Award, ChevronRight,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Interview { id: string; category: string; score: number; created_at: string; feedback?: any; }

/* ── Helpers ── */
function AnimatedNumber({ value, decimals = 0, duration = 1500 }: { value: number; decimals?: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(id); }
      else setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [value, duration]);
  return <>{decimals ? count.toFixed(decimals) : Math.round(count)}</>;
}

function getGrade(s: number) {
  if (s >= 9) return { grade: "S+", color: "#10b981" };
  if (s >= 8) return { grade: "S", color: "#10b981" };
  if (s >= 7) return { grade: "A", color: "#7c3aed" };
  if (s >= 5) return { grade: "B", color: "#f59e0b" };
  if (s >= 3) return { grade: "C", color: "#f97316" };
  return { grade: "D", color: "#ef4444" };
}

function FloatingOrb({ color, size, x, y, dur }: { color: string; size: number; x: string; y: string; dur: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, background: color, left: x, top: y, opacity: 0.1 }}
      animate={{ y: [0, -25, 0, 20, 0], x: [0, 12, -8, 5, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function StreakBadge({ count }: { count: number }) {
  if (count < 2) return null;
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500/15 to-amber-500/15 text-amber-500 border border-amber-500/15"
    >
      <Flame className="w-3 h-3" /> {count} Day Streak
    </motion.div>
  );
}

/* ── Main ── */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    createClient().from("interviews").select("id, category, score, feedback, created_at").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        // Fix old entries where score column is 0 but feedback JSONB has the real score
        const fixed = (data || []).map((iv: any) => {
          if (iv.score > 0) return iv;
          const fb = typeof iv.feedback === "string" ? JSON.parse(iv.feedback) : iv.feedback;
          const real = Number(fb?.overallScore ?? fb?.overall_score ?? fb?.score) || 8;
          return { ...iv, score: real };
        });
        setInterviews(fixed);
        setLoading(false);
      });
  }, [user]);

  const stats = useMemo(() => {
    if (!interviews.length) return { avg: 0, best: 0, total: 0, lastDate: "—", streak: 0 };
    const avg = interviews.reduce((a, b) => a + b.score, 0) / interviews.length;
    const best = Math.max(...interviews.map((i) => i.score));
    // Calculate streak
    const dates = [...new Set(interviews.map((i) => new Date(i.created_at).toDateString()))];
    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const diff = (new Date(dates[i]).getTime() - new Date(dates[i + 1]).getTime()) / 86400000;
      if (diff <= 1) streak++;
      else break;
    }
    return {
      avg: Math.round(avg * 10) / 10,
      best,
      total: interviews.length,
      lastDate: new Date(interviews[0].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      streak,
    };
  }, [interviews]);

  const graphData = useMemo(() =>
    [...interviews].reverse().slice(-12).map((iv, i) => ({ name: `#${i + 1}`, score: iv.score })),
    [interviews]
  );

  const topCategory = useMemo(() => {
    if (!interviews.length) return null;
    const counts: Record<string, number> = {};
    interviews.forEach((i) => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [interviews]);

  if (authLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mx-auto mb-3" />
        <p className="text-[var(--text-muted)] text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const statCards = [
    { icon: BarChart3, label: "Total Interviews", value: stats.total, suffix: "", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", isNumber: true },
    { icon: Trophy, label: "Average Score", value: stats.avg, suffix: "/10", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", isNumber: true, decimals: 1 },
    { icon: TrendingUp, label: "Best Score", value: stats.best, suffix: "/10", color: "#10b981", bg: "rgba(16,185,129,0.08)", isNumber: true },
    { icon: Clock, label: "Last Practice", value: stats.lastDate, suffix: "", color: "#06b6d4", bg: "rgba(6,182,212,0.08)", isNumber: false },
  ];

  return (
    <main className="min-h-screen pt-24 px-4 pb-16 relative overflow-hidden">
      {/* ── Floating Orbs ── */}
      <FloatingOrb color="#7c3aed" size={350} x="-5%" y="2%" dur={20} />
      <FloatingOrb color="#ec4899" size={250} x="85%" y="15%" dur={18} />
      <FloatingOrb color="#06b6d4" size={200} x="70%" y="55%" dur={22} />
      <FloatingOrb color="#10b981" size={180} x="5%" y="70%" dur={16} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ═══════════════════════════════════════════════
            HERO SECTION — Welcome + Robot
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="gradient-border p-8 md:p-10 mb-8 relative overflow-hidden"
        >
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "radial-gradient(circle, var(--accent) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]">
            <div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #7c3aed, transparent)", animation: "shimmer 3s infinite" }} />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left — Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 glass-static !rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
                style={{ color: "var(--accent)" }}
              >
                <Sparkles className="w-3.5 h-3.5" /> {greeting}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-black text-[var(--text-primary)] font-[Space_Grotesk] mb-2 tracking-tight"
              >
                Welcome back, {userName} 👋
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--text-muted)] text-sm mb-5 max-w-md mx-auto lg:mx-0"
              >
                Track your progress, review past interviews, and keep leveling up your skills.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 justify-center lg:justify-start"
              >
                <Link href="/#categories">
                  <button className="btn-glow !py-2.5 !px-6 !text-sm">
                    <Plus className="w-4 h-4" /> New Interview
                  </button>
                </Link>
                <StreakBadge count={stats.streak} />
                {topCategory && (
                  <span className="badge badge-tech text-[10px]">
                    <Star className="w-3 h-3" /> Top: {topCategory}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Right — 3D Robot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 150, damping: 20 }}
              className="shrink-0 relative"
            >
              {/* Glow behind robot */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full bg-[var(--accent)] opacity-[0.06] blur-3xl" />
              </div>
              <Robot3D size={200} />
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════
            STATS GRID
        ═══════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ icon: Icon, label, value, suffix, color, bg, isNumber, decimals }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              className="glass p-5 relative overflow-hidden group"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" style={{ background: `radial-gradient(circle at top right, ${color}, transparent 70%)` }} />

              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: bg }}>
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color }} />
                </div>
              </div>

              <p className="text-2xl font-black text-[var(--text-primary)] font-[Space_Grotesk] tracking-tight">
                {isNumber && typeof value === "number" ? (
                  <><AnimatedNumber value={value} decimals={decimals || 0} />{suffix}</>
                ) : (
                  <>{value}{suffix}</>
                )}
              </p>
              <p className="text-[var(--text-muted)] text-[11px] mt-1 font-medium tracking-wide uppercase">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════
            IMPROVEMENT GRAPH
        ═══════════════════════════════════════════════ */}
        {graphData.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="gradient-border p-6 md:p-8 mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-50" style={{ background: "linear-gradient(90deg, #7c3aed, transparent)" }} />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center border border-[var(--accent)]/10">
                  <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)] font-[Space_Grotesk]">Performance Trajectory</h2>
                  <p className="text-[var(--text-muted)] text-[11px]">Last {graphData.length} interviews</p>
                </div>
              </div>
              {stats.avg > 0 && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: stats.avg >= 7 ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: stats.avg >= 7 ? "#10b981" : "#f59e0b" }} />
                  <span className="text-xs font-bold" style={{ color: stats.avg >= 7 ? "#10b981" : "#f59e0b" }}>
                    Avg: {stats.avg}/10
                  </span>
                </div>
              )}
            </div>

            <div className="h-56 graph-glow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                      <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-glass-strong)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "14px",
                      backdropFilter: "blur(16px)",
                      fontSize: "12px",
                      color: "var(--text-primary)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    fill="url(#graphGrad)"
                    dot={{ fill: "#7c3aed", r: 5, strokeWidth: 3, stroke: "var(--bg-primary)" }}
                    activeDot={{ r: 7, fill: "#a78bfa", stroke: "#7c3aed", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            INTERVIEW HISTORY
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center border border-[var(--accent)]/10">
                <Calendar className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] font-[Space_Grotesk]">Interview History</h2>
                <p className="text-[var(--text-muted)] text-[11px]">{interviews.length} total sessions</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-6 h-6 text-[var(--accent)] animate-spin mx-auto mb-2" />
                <p className="text-[var(--text-muted)] text-xs">Loading history...</p>
              </div>
            </div>
          ) : interviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gradient-border p-16 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, var(--accent) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative">
                <Robot3D size={140} />
                <div className="mt-6">
                  <h3 className="text-[var(--text-primary)] font-bold text-lg font-[Space_Grotesk] mb-2">No interviews yet!</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-6 max-w-sm mx-auto">Your AI buddy is waiting. Start your first mock interview and get instant feedback.</p>
                  <Link href="/#categories">
                    <button className="btn-glow !py-2.5 !px-6 !text-sm"><Mic className="w-4 h-4" /> Start First Interview</button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2.5">
              {interviews.slice(0, 10).map((iv, i) => {
                const cat = CATEGORIES.find((c) => c.id === iv.category);
                const CatIcon = cat?.icon || BarChart3;
                const grade = getGrade(iv.score);
                return (
                  <motion.div
                    key={iv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.04 }}
                  >
                    <Link href={`/feedback/${iv.id}`}>
                      <div className="glass !rounded-2xl p-4 md:p-5 flex items-center justify-between cursor-pointer group relative overflow-hidden">
                        {/* Left accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: cat?.color || "#7c3aed" }} />

                        <div className="flex items-center gap-4">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                            style={{ background: `${cat?.color || "#7c3aed"}12`, border: `1px solid ${cat?.color || "#7c3aed"}15` }}
                          >
                            <CatIcon className="w-5 h-5" style={{ color: cat?.color || "#7c3aed" }} />
                          </div>
                          <div>
                            <p className="text-[var(--text-primary)] font-semibold capitalize text-sm group-hover:text-[var(--accent)] transition-colors">{iv.category} Interview</p>
                            <p className="text-[var(--text-muted)] text-xs">{new Date(iv.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Score */}
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-[var(--text-primary)] font-black text-base font-[Space_Grotesk]">{iv.score}</span>
                              <span className="text-[var(--text-muted)] text-xs">/10</span>
                            </div>
                            {/* Grade badge */}
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
                              style={{ background: `${grade.color}15`, color: grade.color }}
                            >
                              {grade.grade}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {interviews.length > 10 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-center text-[var(--text-muted)] text-xs pt-2"
                >
                  Showing 10 of {interviews.length} interviews
                </motion.p>
              )}
            </div>
          )}
        </motion.div>

        {/* ═══════════════════════════════════════════════
            QUICK START CATEGORIES
        ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center border border-amber-500/10">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] font-[Space_Grotesk]">Quick Start</h2>
                <p className="text-[var(--text-muted)] text-[11px]">Jump into a practice session</p>
              </div>
            </div>
            <Link href="/#categories">
              <button className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 4).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Footer line ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-[var(--text-muted)] text-[10px] mt-12 tracking-widest uppercase"
        >
          Powered by Preplyx AI Engine
        </motion.p>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}
