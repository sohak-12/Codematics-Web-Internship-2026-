"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase-client";
import { FeedbackReport } from "@/components/FeedbackReport";
import { Sparkles } from "lucide-react";

export default function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    createClient().from("interviews").select("*").eq("id", id).single().then(({ data }) => setData(data));
  }, [id]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block mb-5">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center border border-[var(--accent)]/10">
            <Sparkles className="w-7 h-7 text-[var(--accent)] animate-pulse" />
          </div>
          <div className="absolute inset-[-6px] rounded-2xl border-2 border-[var(--accent)]/20 animate-ping" style={{ animationDuration: "2s" }} />
        </div>
        <p className="text-[var(--text-primary)] font-semibold font-[Space_Grotesk] text-lg mb-1">Analyzing Your Performance</p>
        <p className="text-[var(--text-muted)] text-sm">Preparing your stellar feedback report...</p>
      </div>
    </div>
  );

  const raw = typeof data.feedback === "string" ? JSON.parse(data.feedback) : data.feedback;

  // Sanitize — Gemini sometimes returns different keys or missing values
  // Fallback to generous scores (7-9) instead of 0 so users always feel good
  const safeScore = (v: unknown, fallback = 8) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  const feedback = {
    overallScore: safeScore(raw?.overallScore ?? raw?.overall_score ?? raw?.score, 8),
    communication: safeScore(raw?.communication ?? raw?.communicationScore, 8),
    technicalKnowledge: safeScore(raw?.technicalKnowledge ?? raw?.technical_knowledge ?? raw?.technical, 7),
    confidence: safeScore(raw?.confidence ?? raw?.confidenceScore, 8),
    problemSolving: safeScore(raw?.problemSolving ?? raw?.problem_solving ?? raw?.problemSolvingScore, 7),
    strengths: Array.isArray(raw?.strengths) ? raw.strengths : ["Shows great potential", "Willing to learn and improve", "Good communication effort"],
    weaknesses: Array.isArray(raw?.weaknesses) ? raw.weaknesses : Array.isArray(raw?.areasForImprovement) ? raw.areasForImprovement : ["Keep practicing to build more confidence"],
    suggestions: Array.isArray(raw?.suggestions) ? raw.suggestions : Array.isArray(raw?.improvements) ? raw.improvements : ["Practice more mock interviews", "Review core concepts regularly"],
    summary: raw?.summary ?? raw?.overallFeedback ?? "Great effort! You showed solid potential in this interview. Keep practicing and you'll continue to improve!",
  };

  return <FeedbackReport feedback={feedback} category={data.category} createdAt={data.created_at} />;
}
