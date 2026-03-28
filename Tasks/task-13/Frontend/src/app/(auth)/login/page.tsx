"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Input } from "@/components/ui/Input";
import { Robot3D } from "@/components/ui/Robot3D";
import { AuthShowcase } from "@/components/AuthShowcase";
import {
  Mail, Lock, ArrowRight, Mic, Shield,
  Sparkles, Zap, CheckCircle, Sun, Moon, Eye, EyeOff, Star,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show success toast if redirected after email verification
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now sign in.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user) router.push("/dashboard");
  }, [user, authLoading]);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % 4), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Login failed";
      if (msg.includes("Email not confirmed")) {
        toast.error("Email not verified yet. Check your inbox for the verification code.");
      } else if (msg.includes("Invalid") || msg.includes("invalid_credentials")) {
        toast.error("Invalid email or password. If you just signed up, please verify your email first.");
      } else {
        toast.error(msg);
      }
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try { await signInWithGoogle(); }
    catch (err: any) { toast.error(err.message || "Google sign-in failed"); setGoogleLoading(false); }
  };

  return (
    <main className="min-h-screen flex relative overflow-hidden">

      {/* ═══════════════════════════════════════════════
          LEFT PANEL — Showcase (Task-10 Style)
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-8 xl:p-10 relative overflow-hidden" style={{ background: "#020617" }}>
        {/* Mesh grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Glowing orbs */}
        <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)", top: "-100px", left: "-100px" }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)", bottom: "-80px", right: "-80px" }} animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity }} />

        {/* Floating particles — fixed positions to avoid hydration mismatch */}
        {[3,8,15,22,30,37,44,51,58,65,72,79,85,91,12,26,48,63,76,95].map((x, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: 2 + (i % 3), height: 2 + ((i + 1) % 3), left: `${x}%`, bottom: "-5%", background: "radial-gradient(circle, rgba(168,85,247,0.7), rgba(99,102,241,0.3))", boxShadow: "0 0 4px rgba(168,85,247,0.5)" }}
            animate={{ y: [0, -800], opacity: [0, 0.8, 0] }}
            transition={{ duration: 8 + (i % 5) * 2, delay: (i % 7) * 0.8, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Top — Logo */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }} className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/30 relative">
              <Image src="/icon.png" alt="Preplyx" width={24} height={24} />
              <motion.div className="absolute inset-[-4px] rounded-xl border-2 border-[#a78bfa]/40" animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
            </motion.div>
            <span className="text-2xl font-bold text-white font-[Space_Grotesk]">Preplyx</span>
          </div>
          {/* Robot — top right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
            className="hidden xl:block"
          >
            <Robot3D size={90} />
          </motion.div>
        </motion.div>

        {/* Center — Stats + Showcase */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
          {/* Stats row */}
          <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: Zap, value: "99.9%", label: "Uptime" },
              { icon: Star, value: "50K+", label: "Users" },
              { icon: Shield, value: "AES-256", label: "Encrypted" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.08, y: -3 }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#a78bfa]/15 bg-[#a78bfa]/[0.06] backdrop-blur-sm"
              >
                <s.icon className="w-3.5 h-3.5 text-[#a78bfa]" />
                <div className="flex flex-col leading-none">
                  <span className="text-white text-xs font-bold">{s.value}</span>
                  <span className="text-white/30 text-[9px] uppercase tracking-wider">{s.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Showcase Window */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <AuthShowcase activeSlide={slideIndex} onDotClick={setSlideIndex} />
          </motion.div>
        </div>

        {/* Bottom — Security badge */}
        <motion.div
          className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] backdrop-blur-sm w-fit"
          whileHover={{ scale: 1.05 }}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">Military-grade AES-256 Encryption Active</span>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT PANEL — Login Form
      ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Background orbs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#7c3aed]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-[#a78bfa]/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Theme toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={toggleTheme}
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--accent-bg)] transition-all z-20 border border-[var(--border-glass)]"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-[var(--text-muted)]" /> : <Moon className="w-4 h-4 text-[var(--text-muted)]" />}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[420px] relative"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Image src="/icon.png" alt="Preplyx" width={22} height={22} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent font-[Space_Grotesk]">Preplyx</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold mb-4" style={{ background: "var(--accent-bg)", color: "var(--accent)" }}>
              <Sparkles className="w-3 h-3" /> Welcome back
            </motion.div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] font-[Space_Grotesk] mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-[var(--text-muted)] text-sm">Access your interview command center</p>
          </div>

          {/* Form Card */}
          <div className="gradient-border p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px]">
              <div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #7c3aed, transparent)", animation: "shimmer 3s infinite" }} />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <Input type="email" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                className="btn-glow w-full !py-2.5 !mt-5 relative overflow-hidden"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: "0 0 35px rgba(124,58,237,0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute top-0 left-[-100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" style={{ animation: "btnShine 3s infinite" }} />
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-glass)]" /></div>
              <div className="relative flex justify-center"><span className="bg-[var(--bg-glass-strong)] px-3 text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">or</span></div>
            </div>

            {/* Google — compact like other platforms */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full glass-static !rounded-xl py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-glass-hover)] transition-all flex items-center justify-center gap-2.5"
            >
              {googleLoading ? (
                <span className="w-4 h-4 border-2 border-[var(--text-muted)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          {/* Footer */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center text-sm text-[var(--text-muted)] mt-6">
            New to Preplyx?{" "}
            <Link href="/signup" className="text-[var(--accent)] font-semibold hover:underline">Create Account</Link>
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-4 mt-5">
            {[
              { icon: Shield, text: "Secure" },
              { icon: Zap, text: "Fast" },
              { icon: CheckCircle, text: "Free" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <Icon className="w-3 h-3 opacity-50" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{text}</span>
              </div>
            ))}
          </motion.div>
          <p className="text-center text-[10px] text-[var(--text-muted)] opacity-60 mt-4">Developed by <span className="font-semibold">Soha Muzammil</span></p>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes btnShine {
          0% { left: -100%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }
      `}</style>
    </main>
  );
}
