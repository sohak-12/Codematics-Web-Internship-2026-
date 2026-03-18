import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, User, Loader2, ShieldCheck, ChevronLeft, Sparkles, Zap, Star } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import axios from "axios";
import AuthShowcase from "./AuthShowcase";
import MobileShowcase from "./MobileShowcase";
import "./Auth.css";

/* ─── Floating Particle Component ─────────────────────── */
const Particle = ({ index }) => {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 5;
  const randomDuration = 8 + Math.random() * 10;
  const randomSize = 2 + Math.random() * 4;

  return (
    <motion.div
      className="particle"
      style={{ left: `${randomX}%`, width: randomSize, height: randomSize }}
      animate={{ y: [0, -800], opacity: [0, 1, 0] }}
      transition={{ duration: randomDuration, delay: randomDelay, repeat: Infinity, ease: "linear" }}
    />
  );
};

/* ─── Tilt Card Component ──────────────────────────────── */
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

const Auth = ({ onLoginSuccess }) => {
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    const endpoint = view === "login" ? "/auth/login" : view === "signup" ? "/auth/register" : "/auth/forgot-password";
    const payload = view === "login"
      ? { email: formData.email, password: formData.password }
      : view === "signup"
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { email: formData.email };

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'}${endpoint}`, payload);
      if (view === "login") {
        localStorage.setItem("token", data.data.token);
        onLoginSuccess();
      } else {
        setSuccessMessage(view === "signup" ? "Account created successfully! ✨" : "Reset link sent! 📧");
        setTimeout(() => { setView("login"); setSuccessMessage(""); }, 2000);
      }
    } catch (err) {
      setGeneralError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const viewConfig = {
    login:  { title: "Welcome Back",    subtitle: "Access your financial command center",  btn: "Initialize Session" },
    signup: { title: "Join the Elite",  subtitle: "Build your wealth intelligence system", btn: "Establish Account"  },
    forgot: { title: "Access Recovery", subtitle: "We'll dispatch a secure recovery link",  btn: "Dispatch Reset"     },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="auth-master-container">
      <MobileShowcase />

      {/* ── Floating Particles ── */}
      <div className="particles-container">
        {Array.from({ length: 20 }).map((_, i) => <Particle key={i} index={i} />)}
      </div>

      {/* ══════════════════════════════════════
          LEFT PANEL — VISUAL SHOWCASE
      ══════════════════════════════════════ */}
      <div className="auth-showcase">
        {/* Animated mesh background */}
        <div className="mesh-bg" />
        <motion.div className="glow-orb orb-1" animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="glow-orb orb-2" animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="glow-orb orb-3" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity }} />

        <div className="auth-showcase-content">
          {/* Brand */}
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: "backOut" }} className="brand-logo-large">
            <motion.div className="logo-glass-icon" whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}>
              <img src="./Images2.png" alt="logo" style={{ width: 44, height: 44, objectFit: "contain" }} />
              <motion.div className="icon-pulse-ring" animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} />
            </motion.div>
            <h1>Sohanix<span>Wealth</span></h1>
            <motion.p className="tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Sparkles size={14} /> Experience the future of finance <Sparkles size={14} />
            </motion.p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="stats-row"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {[
              { icon: <Zap size={16} />, value: "99.9%", label: "Uptime" },
              { icon: <Star size={16} />, value: "50K+", label: "Users" },
              { icon: <ShieldCheck size={16} />, value: "AES-256", label: "Encrypted" },
            ].map((stat, i) => (
              <motion.div key={i} className="stat-chip" whileHover={{ scale: 1.1, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                {stat.icon}
                <div>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Showcase Slider */}
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="slider-container-premium">
            <AuthShowcase activeSlide={slideIndex} onDotClick={setSlideIndex} />
          </motion.div>

          {/* Footer Badge */}
          <motion.div className="showcase-footer-premium" whileHover={{ scale: 1.05 }}>
            <ShieldCheck size={18} />
            <span>Military-grade AES-256 Encryption Active</span>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — FORM
      ══════════════════════════════════════ */}
      <div className="auth-form-panel">
        <TiltCard className="auth-form-wrapper">
          {/* Glowing border effect */}
          <div className="card-glow-border" />

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ x: 50, opacity: 0, filter: "blur(10px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ x: -50, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "backOut" }}
            >
              {/* Header */}
              <div className="auth-header">
                {view === "forgot" && (
                  <motion.button className="back-btn" onClick={() => setView("login")} whileHover={{ x: -4 }}>
                    <ChevronLeft size={16} /> Back to Vault
                  </motion.button>
                )}
                <motion.h2 key={view + "h2"} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  {viewConfig[view].title}
                </motion.h2>
                <motion.p key={view + "p"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  {viewConfig[view].subtitle}
                </motion.p>
              </div>

              {/* Banners */}
              <AnimatePresence>
                {generalError && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="error-banner">
                    {generalError}
                  </motion.div>
                )}
                {successMessage && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="success-banner">
                    {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form className="auth-form" onSubmit={handleAuthAction}>
                <AnimatePresence>
                  {view === "signup" && (
                    <motion.div className="input-group" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <label>Operator Name</label>
                      <div className={`input-inner ${focusedField === "username" ? "focused" : ""}`}>
                        <User size={18} className="icon" />
                        <input name="username" type="text" placeholder="Full Name" onChange={handleChange}
                          onFocus={() => setFocusedField("username")} onBlur={() => setFocusedField(null)} required />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="input-group">
                  <label>Secure Email</label>
                  <div className={`input-inner ${focusedField === "email" ? "focused" : ""}`}>
                    <Mail size={18} className="icon" />
                    <input name="email" type="email" placeholder="name@domain.com" onChange={handleChange}
                      onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} required />
                  </div>
                </div>

                <AnimatePresence>
                  {view !== "forgot" && (
                    <motion.div className="input-group" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="label-row">
                        <label>Access Key</label>
                        {view === "login" && (
                          <button type="button" className="text-link" onClick={() => setView("forgot")}>Forgot?</button>
                        )}
                      </div>
                      <div className={`input-inner ${focusedField === "password" ? "focused" : ""}`}>
                        <Lock size={18} className="icon" />
                        <input name="password" type="password" placeholder="••••••••" onChange={handleChange}
                          onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} required />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(168, 85, 247, 0.7)" }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  <span className="btn-shine" />
                  {isLoading
                    ? <Loader2 size={22} className="animate-spin" />
                    : <><span>{viewConfig[view].btn}</span><ArrowRight size={18} /></>
                  }
                </motion.button>
              </form>

              {/* Footer */}
              <div className="auth-footer">
                <p>
                  {view === "login" ? "New to the system?" : "Returning operator?"}
                  <motion.button
                    onClick={() => setView(view === "login" ? "signup" : "login")}
                    className="mode-toggle"
                    whileHover={{ scale: 1.05 }}
                  >
                    {view === "login" ? "Register Now" : "Login here"}
                  </motion.button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </TiltCard>
      </div>
    </motion.div>
  );
};

export default Auth;
