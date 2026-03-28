"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useVapiInterview } from "@/hooks/useVapiInterview";
import { CATEGORIES } from "@/constants/categories";
import { Mic, MicOff, PhoneOff, Loader2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase-client";

export function InterviewScreen({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const category = useMemo(() => CATEGORIES.find((c) => c.id === categoryId), [categoryId]);
  const { status, transcript, structuredTranscript, isMuted, duration, startInterview, endInterview, toggleMute } = useVapiInterview(category);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (status !== "ended" || structuredTranscript.length === 0) return;
    const save = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ category: categoryId, transcript: structuredTranscript }),
        });
        if (!res.ok) throw new Error("Failed to save");
        const { interviewId } = await res.json();
        router.push(`/feedback/${interviewId}`);
      } catch {
        router.push("/dashboard");
      }
    };
    save();
  }, [status]);

  if (!category) return <p className="text-[var(--text-primary)] text-center mt-32">Category not found.</p>;
  const Icon = category.icon;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${category.color}15` }}><Icon className="w-5 h-5" style={{ color: category.color }} /></div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[Space_Grotesk]">{category.title}</h1>
          </div>
          <p className="text-[var(--text-muted)] text-sm">{category.description}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="gradient-border p-8 mb-6">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              {status === "active" && (
                <>
                  <div className="voice-ring" style={{ inset: "-14px" }} />
                  <div className="voice-ring" style={{ inset: "-28px", animationDelay: "0.6s" }} />
                  <div className="voice-ring" style={{ inset: "-42px", animationDelay: "1.2s" }} />
                </>
              )}
              <div className={`w-28 h-28 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${status === "active" ? "border-[var(--accent)] bg-[var(--accent-bg)] voice-pulse" : "border-[var(--border-glass)] bg-[var(--bg-glass)]"}`}>
                <Mic className={`w-10 h-10 transition-colors ${status === "active" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
              </div>
              {status === "active" && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[var(--success)] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg">LIVE</span>}
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]"><Clock className="w-4 h-4" /><span className="font-mono text-xl font-semibold text-[var(--text-primary)]">{fmt(duration)}</span></div>
            <div className="flex gap-3">
              {status === "idle" && <button onClick={startInterview} className="btn-glow !px-8 !py-3 text-base"><Mic className="w-5 h-5" /> Start Interview</button>}
              {status === "connecting" && <button disabled className="btn-glow !px-8 !py-3 text-base opacity-70"><Loader2 className="w-5 h-5 animate-spin" /> Connecting...</button>}
              {status === "active" && (
                <>
                  <button onClick={toggleMute} className="glass-static !rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--border-glass-hover)]">
                    {isMuted ? <MicOff className="w-4 h-4 text-[var(--danger)]" /> : <Mic className="w-4 h-4 text-[var(--accent)]" />}{isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button onClick={endInterview} className="px-5 py-2.5 rounded-full bg-[var(--danger-bg)] border border-[var(--danger)]/20 text-[var(--danger)] text-sm font-medium flex items-center gap-2 hover:bg-[var(--danger)]/20 transition-all"><PhoneOff className="w-4 h-4" /> End Interview</button>
                </>
              )}
              {status === "ended" && <button disabled className="btn-glow !px-8 !py-3 text-base opacity-70"><Loader2 className="w-5 h-5 animate-spin" /> Generating Feedback...</button>}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-static p-6 max-h-[400px] overflow-y-auto">
          <h2 className="text-[var(--text-primary)] font-semibold mb-4 flex items-center gap-2 font-[Space_Grotesk]"><div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />Live Transcript</h2>
          {transcript.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm text-center py-12">{status === "idle" ? "Click Start Interview to begin" : "Waiting for conversation..."}</p>
          ) : (
            <div className="space-y-3">
              {transcript.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: e.role === "user" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${e.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${e.role === "user" ? "bg-[var(--accent-bg)] text-[var(--text-primary)] border border-[var(--accent)]/15" : "bg-[var(--bg-glass)] text-[var(--text-secondary)] border border-[var(--border-glass)]"}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-1">{e.role === "user" ? "You" : "AI Interviewer"}</span>{e.text}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
