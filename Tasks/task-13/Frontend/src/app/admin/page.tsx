"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase-client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Mic, BarChart3, Activity, Loader2, Shield } from "lucide-react";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const sb = createClient();
      const { count } = await sb.from("interviews").select("*", { count: "exact", head: true });
      const { data } = await sb.from("interviews").select("category, score, created_at").order("created_at", { ascending: false }).limit(20);
      const scores = data?.map((i) => i.score) || [];
      const avg = scores.length ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1) : "0";
      const cc: Record<string, number> = {};
      data?.forEach((i) => { cc[i.category] = (cc[i.category] || 0) + 1; });
      const top = Object.entries(cc).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
      setStats({ totalInterviews: count || 0, avgScore: avg, topCategory: top });
      setInterviews(data || []);
    };
    load();
  }, [user]);

  if (!stats) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" /></div>;

  return (
    <main className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[Space_Grotesk]">Admin Dashboard</h1>
            <p className="text-[var(--text-muted)] text-sm">Platform overview and analytics</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: "Total Users", value: "—", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
            { icon: Mic, label: "Interviews", value: stats.totalInterviews, color: "#06b6d4", bg: "rgba(6,182,212,0.08)" },
            { icon: BarChart3, label: "Avg Score", value: `${stats.avgScore}/10`, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
            { icon: Activity, label: "Top Category", value: stats.topCategory, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
          ].map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}><Icon className="w-5 h-5" style={{ color }} /></div>
              <p className="text-2xl font-bold text-[var(--text-primary)] font-[Space_Grotesk] capitalize">{value}</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] font-[Space_Grotesk] mb-4">Recent Interviews</h2>
          <div className="glass-static overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[var(--border-glass)]">
                <th className="text-left p-4 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider">Score</th>
                <th className="text-left p-4 text-[var(--text-muted)] font-medium text-xs uppercase tracking-wider">Date</th>
              </tr></thead>
              <tbody>
                {interviews.map((iv, i) => (
                  <tr key={i} className="border-b border-[var(--border-glass)] last:border-0 hover:bg-[var(--accent-bg)] transition-colors">
                    <td className="p-4 text-[var(--text-primary)] font-medium capitalize">{iv.category}</td>
                    <td className="p-4"><span className={`font-semibold ${iv.score >= 7 ? "text-[var(--success)]" : iv.score >= 5 ? "text-[var(--warning)]" : "text-[var(--danger)]"}`}>{iv.score}/10</span></td>
                    <td className="p-4 text-[var(--text-muted)]">{new Date(iv.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {interviews.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-[var(--text-muted)]">No interviews yet</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
