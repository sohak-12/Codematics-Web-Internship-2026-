import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, Loader2, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { FiShoppingBag, FiTruck, FiShield, FiPercent, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db, googleProvider } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, limit, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { COLLECTIONS } from "../shared";
import "./Authentication.css";

const formatPrice = (n) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0 }).format(n);

const Stars = () => {
  const stars = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    size: 1 + Math.random() * 2, delay: Math.random() * 3, dur: 2 + Math.random() * 3,
  })), []);
  return (
    <div className="nx-stars">
      {stars.map((s) => (
        <div key={s.id} className="nx-star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />
      ))}
    </div>
  );
};

const TRUST = [
  { icon: <FiTruck size={14} />, text: "Free COD Delivery" },
  { icon: <FiShield size={14} />, text: "Secure Payments" },
  { icon: <FiPercent size={14} />, text: "Daily Deals" },
  { icon: <FiStar size={14} />, text: "Top Brands" },
  { icon: <FiShoppingBag size={14} />, text: "63+ Products" },
];

const Authentication = () => {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, COLLECTIONS.PRODUCTS), limit(3));
        const snap = await getDocs(q);
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) { /* silent */ }
    })();
  }, []);

  const handleChange = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if (view === "login") {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        toast.success("Welcome back! 🎉");
        const r = sessionStorage.getItem("sohafy_redirect") || "/";
        sessionStorage.removeItem("sohafy_redirect"); navigate(r);
      } else if (view === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.name });
        await setDoc(doc(db, "users", cred.user.uid), { name: form.name, email: form.email, role: "client", createdAt: serverTimestamp() });
        toast.success("Account created! ✨");
        const r = sessionStorage.getItem("sohafy_redirect") || "/";
        sessionStorage.removeItem("sohafy_redirect"); navigate(r);
      } else {
        await sendPasswordResetEmail(auth, form.email);
        setSuccess("Reset link sent to your email! 📧");
        setTimeout(() => { setView("login"); setSuccess(""); }, 2500);
      }
    } catch (err) {
      console.log("Auth error:", err.code);
      const msg = err.code === "auth/invalid-credential" ? "Invalid email or password"
        : err.code === "auth/wrong-password" ? "Incorrect password"
        : err.code === "auth/user-not-found" ? "No account found"
        : err.code === "auth/email-already-in-use" ? "Email already registered"
        : err.code === "auth/weak-password" ? "Password must be 6+ characters"
        : err.code === "auth/too-many-requests" ? "Too many attempts. Try again later."
        : "Something went wrong";
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (!userDoc.exists()) await setDoc(doc(db, "users", cred.user.uid), { name: cred.user.displayName || "", email: cred.user.email, role: "client", createdAt: serverTimestamp() });
      toast.success(`Welcome, ${cred.user.displayName}! 🎉`);
      const r = sessionStorage.getItem("sohafy_redirect") || "/";
      sessionStorage.removeItem("sohafy_redirect"); navigate(r);
    } catch (err) { if (err.code !== "auth/popup-closed-by-user") setError("Google sign-in failed"); }
  };

  const cfg = {
    login: { title: "Welcome Back", sub: "Sign in to your Sohafy account", btn: "Sign In" },
    signup: { title: "Join Sohafy", sub: "Create account & start shopping", btn: "Create Account" },
    forgot: { title: "Reset Password", sub: "We'll send a secure reset link", btn: "Send Reset Link" },
  };

  return (
    <div className="nx-auth">
      {/* Aurora Background */}
      <div className="nx-aurora">
        <div className="nx-aurora-blob" />
        <div className="nx-aurora-blob" />
        <div className="nx-aurora-blob" />
        <div className="nx-aurora-blob" />
      </div>
      <div className="nx-grid-overlay" />
      <Stars />

      <div className="nx-layout">
        {/* ═══ LEFT — FLOATING PRODUCTS ═══ */}
        <motion.div className="nx-showcase" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "backOut" }}>
          {/* Brand */}
          <div className="nx-brand-section">
            <div className="nx-brand-row">
              <div className="nx-brand-icon">
                <img src="/logo1.png" alt="Sohafy" />
              </div>
              <h1 className="nx-brand-name">Soh<span>afy</span></h1>
            </div>
            <p className="nx-tagline">✨ Pakistan's Premium eCommerce Store ✨</p>
          </div>

          {/* Floating 3D Product Cards */}
          <div className="nx-floating-products">
            {products.map((p, i) => {
              const disc = p.price && p.sellingPrice && p.price !== p.sellingPrice ? Math.round(((p.price - p.sellingPrice) / p.price) * 100) : 0;
              return (
                <motion.div key={p.id} className="nx-float-card"
                  initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: "backOut" }}
                  whileHover={{ scale: 1.08, rotate: 0 }}>
                  {disc > 0 && <div className="nx-float-badge">{disc}% OFF</div>}
                  <img src={p.productImage?.[0]} alt={p.productName} className="nx-float-img" />
                  <div className="nx-float-info">
                    <div className="nx-float-brand">{p.brandName}</div>
                    <div className="nx-float-name">{p.productName}</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="nx-float-price">{formatPrice(p.sellingPrice)}</span>
                      {disc > 0 && <span className="nx-float-old">{formatPrice(p.price)}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div className="nx-trust-row">
            {TRUST.map((t, i) => (
              <motion.div key={i} className="nx-trust-chip" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.08 }}
                whileHover={{ scale: 1.06, y: -2 }}>
                <span className="nx-trust-icon">{t.icon}</span>
                <span className="nx-trust-text">{t.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ RIGHT — AUTH FORM ═══ */}
        <motion.div className="nx-form-panel" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }}>
          <div className="nx-form-card">
            <AnimatePresence mode="wait">
              <motion.div key={view} initial={{ x: 40, opacity: 0, filter: "blur(8px)" }} animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ x: -40, opacity: 0, filter: "blur(8px)" }} transition={{ duration: 0.35, ease: "backOut" }}>

                {/* Header */}
                <div className="nx-form-header">
                  {view === "forgot" && (
                    <button className="nx-back-link" onClick={() => setView("login")}>
                      <ChevronLeft size={15} /> Back to Login
                    </button>
                  )}
                  <h2>{cfg[view].title}</h2>
                  <p>{cfg[view].sub}</p>
                </div>

                {/* Errors */}
                <AnimatePresence>
                  {error && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="nx-error">{error}</motion.div>}
                  {success && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="nx-success">{success}</motion.div>}
                </AnimatePresence>

                {/* Google */}
                {view !== "forgot" && (
                  <>
                    <motion.button type="button" onClick={handleGoogle} className="nx-google-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <FcGoogle size={22} /> Continue with Google
                    </motion.button>
                    <div className="nx-divider">
                      <div className="nx-divider-line" />
                      <span className="nx-divider-text">or</span>
                      <div className="nx-divider-line" />
                    </div>
                  </>
                )}

                {/* Form */}
                <form className="nx-form" onSubmit={handleSubmit}>
                  <AnimatePresence>
                    {view === "signup" && (
                      <motion.div className="nx-field" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="nx-field-label"><label>Full Name</label></div>
                        <div className="nx-input-wrap">
                          <User size={17} className="nx-input-icon" />
                          <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="nx-field">
                    <div className="nx-field-label"><label>Email Address</label></div>
                    <div className="nx-input-wrap">
                      <Mail size={17} className="nx-input-icon" />
                      <input name="email" type="email" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <AnimatePresence>
                    {view !== "forgot" && (
                      <motion.div className="nx-field" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <div className="nx-field-label">
                          <label>Password</label>
                          {view === "login" && <button type="button" className="nx-forgot-link" onClick={() => setView("forgot")}>Forgot?</button>}
                        </div>
                        <div className="nx-input-wrap">
                          <Lock size={17} className="nx-input-icon" />
                          <input name="password" type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={handleChange} required />
                          <button type="button" onClick={() => setShowPw(!showPw)} className="nx-eye-btn">
                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button type="submit" className="nx-submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>{cfg[view].btn}</span><ArrowRight size={17} /></>}
                  </motion.button>
                </form>

                {/* Footer */}
                <div className="nx-form-footer">
                  <p>
                    {view === "login" ? "Don't have an account?" : "Already have an account?"}
                    <button className="nx-toggle-btn" onClick={() => { setView(view === "login" ? "signup" : "login"); setError(""); }}>
                      {view === "login" ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                  <p style={{ marginTop: "12px", fontSize: "0.65rem", opacity: 0.5, letterSpacing: "0.04em" }}>Developed by Soha Muzammil</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Authentication;
