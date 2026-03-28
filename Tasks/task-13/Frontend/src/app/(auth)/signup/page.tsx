"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Input } from "@/components/ui/Input";
import { Robot3D } from "@/components/ui/Robot3D";
import { AuthShowcase } from "@/components/AuthShowcase";
import {
  Mail, Lock, User, ArrowRight, Sparkles, CheckCircle,
  Shield, Zap, Sun, Moon, Eye, EyeOff, Star, ArrowLeft, KeyRound,
} from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  // OTP state
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { signUp, signInWithGoogle, verifyOtp, user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) router.push("/dashboard");
  }, [user, authLoading]);

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex((i) => (i + 1) % 4), 5000);
    return () => clearInterval(timer);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success("Verification code sent to your email!");
      setStep("otp");
      setResendCooldown(60);
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // single digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    if (pasted.length === 6) handleVerifyOtp(pasted);
    else otpRefs.current[pasted.length]?.focus();
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) { toast.error("Please enter the 6-digit code"); return; }
    setVerifying(true);
    try {
      await verifyOtp(email, code);
      toast.success("Email verified! Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await signUp(email, password, name);
      toast.success("New verification code sent!");
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend. Please try again.");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try { await signInWithGoogle(); }
    catch (err: any) { toast.error(err.message || "Google sign-in failed"); setGoogleLoading(false); }
  };

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      {/* ═══════ LEFT PANEL — Task-10 Style ═══════ */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-8 xl:p-10 relative overflow-hidden" style={{ background: "#020617" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)", top: "-100px", left: "-100px" }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)", bottom: "-80px", right: "-80px" }} animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} />
        {[3,8,15,22,30,37,44,51,58,65,72,79,85,91,12,26,48,63,76,95].map((x, i) => (
          <motion.div key={i} className="absolute rounded-full" style={{ width: 2 + (i % 3), height: 2 + ((i + 1) % 3), left: `${x}%`, bottom: "-5%", background: "radial-gradient(circle, rgba(168,85,247,0.7), rgba(99,102,241,0.3))", boxShadow: "0 0 4px rgba(168,85,247,0.5)" }} animate={{ y: [0, -800], opacity: [0, 0.8, 0] }} transition={{ duration: 8 + (i % 5) * 2, delay: (i % 7) * 0.8, repeat: Infinity, ease: "linear" }} />
        ))}

        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }} className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/30 relative">
              <Image src="/icon.png" alt="Preplyx" width={24} height={24} />
              <motion.div className="absolute inset-[-4px] rounded-xl border-2 border-[#a78bfa]/40" animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
            </motion.div>
            <span className="text-2xl font-bold text-white font-[Space_Grotesk]">Preplyx</span>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 120 }} className="hidden xl:block">
            <Robot3D size={90} />
          </motion.div>
        </motion.div>

        <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
          <motion.div className="flex gap-3 flex-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {[{ icon: Zap, value: "99.9%", label: "Uptime" }, { icon: Star, value: "50K+", label: "Users" }, { icon: Shield, value: "AES-256", label: "Encrypted" }].map((s) => (
              <motion.div key={s.label} whileHover={{ scale: 1.08, y: -3 }} className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#a78bfa]/15 bg-[#a78bfa]/[0.06] backdrop-blur-sm">
                <s.icon className="w-3.5 h-3.5 text-[#a78bfa]" />
                <div className="flex flex-col leading-none">
                  <span className="text-white text-xs font-bold">{s.value}</span>
                  <span className="text-white/30 text-[9px] uppercase tracking-wider">{s.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }}>
            <AuthShowcase activeSlide={slideIndex} onDotClick={setSlideIndex} />
          </motion.div>
        </div>

        <motion.div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] backdrop-blur-sm w-fit" whileHover={{ scale: 1.05 }}>
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">Military-grade AES-256 Encryption Active</span>
        </motion.div>
      </div>

      {/* ═══════ RIGHT PANEL ═══════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-[#7c3aed]/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={toggleTheme}
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--accent-bg)] transition-all z-20 border border-[var(--border-glass)]"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-[var(--text-muted)]" /> : <Moon className="w-4 h-4 text-[var(--text-muted)]" />}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-[420px] relative"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Image src="/icon.png" alt="Preplyx" width={22} height={22} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent font-[Space_Grotesk]">Preplyx</span>
          </div>

          {/* ═══════ STEP 1: SIGNUP FORM ═══════ */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold mb-4"
                  style={{ background: "rgba(16,185,129,0.08)", color: "#10b981" }}
                >
                  <Zap className="w-3 h-3" /> Get started free
                </motion.div>
                <h1 className="text-3xl font-black text-[var(--text-primary)] font-[Space_Grotesk] mb-2 tracking-tight">Create your account</h1>
                <p className="text-[var(--text-muted)] text-sm">Start your interview preparation journey</p>
              </div>

              <div className="gradient-border p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1.5px]">
                  <div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)", animation: "shimmer 3s infinite" }} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                      <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                      <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 block uppercase tracking-wider">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                      <Input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" minLength={6} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-glow w-full !py-2.5 !mt-6" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</span>
                    ) : (
                      <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
                    )}
                  </button>
                </form>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-glass)]" /></div>
                  <div className="relative flex justify-center"><span className="bg-[var(--bg-glass-strong)] px-3 text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">or</span></div>
                </div>

                <button onClick={handleGoogle} disabled={googleLoading}
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

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center text-sm text-[var(--text-muted)] mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-[var(--accent)] font-semibold hover:underline">Sign in</Link>
              </motion.p>
            </motion.div>
          )}

          {/* ═══════ STEP 2: OTP VERIFICATION ═══════ */}
          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => { setStep("form"); setOtp(["", "", "", "", "", ""]); }}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-all mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>

              <div className="mb-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed]/15 to-[#a78bfa]/10 flex items-center justify-center mb-5 border border-[var(--accent)]/10"
                >
                  <KeyRound className="w-7 h-7 text-[var(--accent)]" />
                </motion.div>
                <h1 className="text-3xl font-black text-[var(--text-primary)] font-[Space_Grotesk] mb-2 tracking-tight">Verify your email</h1>
                <p className="text-[var(--text-muted)] text-sm">
                  We sent a 6-digit code to <span className="text-[var(--text-primary)] font-semibold">{email}</span>
                </p>
              </div>

              <div className="gradient-border p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1.5px]">
                  <div className="h-full w-full" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #7c3aed, transparent)", animation: "shimmer 3s infinite" }} />
                </div>

                <label className="text-[11px] font-semibold text-[var(--text-muted)] mb-3 block uppercase tracking-wider text-center">
                  Enter verification code
                </label>

                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-2.5 mb-6" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      disabled={verifying}
                      className="w-12 h-14 text-center text-xl font-bold font-[Space_Grotesk] rounded-xl border-2 transition-all duration-200 outline-none bg-[var(--bg-glass)] text-[var(--text-primary)] disabled:opacity-50"
                      style={{
                        borderColor: digit ? "var(--accent)" : "var(--border-glass)",
                        boxShadow: digit ? "0 0 12px rgba(124,58,237,0.15)" : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  onClick={() => handleVerifyOtp(otp.join(""))}
                  disabled={verifying || otp.some((d) => !d)}
                  className="btn-glow w-full !py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</span>
                  ) : (
                    <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Verify Email</span>
                  )}
                </button>

                {/* Resend */}
                <div className="text-center mt-5">
                  <p className="text-[var(--text-muted)] text-xs mb-1">Didn&apos;t receive the code?</p>
                  {resendCooldown > 0 ? (
                    <p className="text-[var(--text-muted)] text-xs">
                      Resend in <span className="text-[var(--accent)] font-bold">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button onClick={handleResend} className="text-[var(--accent)] text-xs font-semibold hover:underline">
                      Resend Code
                    </button>
                  )}
                </div>
              </div>

              {/* Security note */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 mt-6 text-[var(--text-muted)]"
              >
                <Shield className="w-3 h-3 opacity-50" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Code expires in 60 minutes</span>
              </motion.div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-4 mt-5">
            {[{ icon: Shield, text: "Secure" }, { icon: Zap, text: "Fast" }, { icon: CheckCircle, text: "Free" }].map(({ icon: Icon, text }) => (
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
      `}</style>
    </main>
  );
}
