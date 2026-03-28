"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/constants/categories";
import { Mic, Sparkles, BarChart3, Shield, Loader2, Zap, Users, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const floatingTech = [
  { label: "HTML", color: "#E34F26", x: "8%", y: "22%" },
  { label: "CSS", color: "#1572B6", x: "88%", y: "15%" },
  { label: "JS", color: "#F7DF1E", x: "92%", y: "58%" },
  { label: "PHP", color: "#777BB4", x: "5%", y: "68%" },
  { label: "TS", color: "#3178C6", x: "78%", y: "82%" },
  { label: "PY", color: "#3776AB", x: "15%", y: "88%" },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-28 pb-24 px-4 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-10 left-[20%] w-[500px] h-[500px] bg-[#7c3aed]/12 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] bg-[#a78bfa]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 glass-static !rounded-full px-4 py-1.5 text-sm font-medium mb-6"
                style={{ color: "var(--accent)" }}
              >
                <Sparkles className="w-4 h-4" /> AI-Powered Interview Practice
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-[var(--text-primary)] leading-[1.15] mb-6 font-[Space_Grotesk]">
                Get Interview-Ready{" "}
                <br className="hidden sm:block" />
                with{" "}
                <span className="bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">
                  AI-Powered Practice
                </span>{" "}
                & Feedback
              </h1>

              <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-lg leading-relaxed">
                Practice real interview questions & get instant feedback. Our AI interviewer listens, responds, and helps you improve your skills.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="#categories">
                  <button className="btn-glow !px-8 !py-3.5 text-base">
                    <Mic className="w-5 h-5" /> Start an Interview
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="glass-static !rounded-full px-8 py-3.5 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--border-glass-hover)] transition-all">
                    View Dashboard
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-10">
                {[
                  { value: "13+", label: "Categories", icon: Zap },
                  { value: "AI", label: "Voice Powered", icon: Mic },
                  { value: "Free", label: "To Start", icon: Star },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
                      <p className="text-xs text-[var(--text-muted)]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — 3D Robot Area */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="gradient-border p-16 flex items-center justify-center min-h-[450px] relative">
                {/* Central AI Avatar */}
                <div className="relative">
                  <div className="w-44 h-44 rounded-3xl bg-gradient-to-br from-[var(--accent-bg)] to-transparent flex items-center justify-center border border-[var(--border-glass)]">
                    <Image src="/icon.png" alt="Preplyx" width={120} height={120} className="drop-shadow-2xl" />
                  </div>
                  {/* Decorative rings */}
                  <div className="absolute -inset-8 rounded-full border border-[var(--border-glass)] opacity-50" />
                  <div className="absolute -inset-16 rounded-full border border-[var(--border-glass)] opacity-25" />
                  <div className="absolute -inset-24 rounded-full border border-[var(--border-glass)] opacity-10" />
                </div>

                {/* Floating Tech Icons */}
                {floatingTech.map((item, i) => (
                  <div key={item.label} className="absolute float-anim" style={{ left: item.x, top: item.y }}>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
                      style={{ backgroundColor: item.color, boxShadow: `0 4px 16px ${item.color}40` }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Mic, title: "Real-time Voice AI", desc: "Natural conversation with an AI interviewer that listens and responds", color: "#7c3aed" },
            { icon: BarChart3, title: "Stellar Analytics", desc: "Communication, technical, confidence scores with improvement tracking", color: "#10b981" },
            { icon: Shield, title: "13+ Categories", desc: "Frontend, Backend, System Design, HR, Behavioral, DSA & more", color: "#06b6d4" },
          ].map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass p-6 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-1">{title}</h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ CATEGORIES GRID ═══════ */}
      <section id="categories" className="px-4 pb-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 font-[Space_Grotesk]">Take Interviews</h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto">Choose a category and start your AI-powered mock interview session</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-[var(--border-glass)] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
              <Image src="/icon.png" alt="Preplyx" width={16} height={16} />
            </div>
            <span className="text-sm font-semibold text-[var(--text-muted)]">Preplyx</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">© 2025 Preplyx. Built with AI for interview excellence.</p>
        </div>
        <div className="mt-3 text-center w-full">
          <p className="text-[10px] text-[var(--text-muted)] opacity-70">Developed by <span className="font-semibold text-[var(--text-secondary)]">Soha Muzammil</span></p>
        </div>
      </footer>
    </main>
  );
}
