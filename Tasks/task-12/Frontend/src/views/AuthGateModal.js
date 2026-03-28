import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShoppingBag, FiLock, FiMail, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";
import { toast } from "react-toastify";

const AuthGateModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, form.email, form.password);
        toast.success("Welcome back! 🎉");
      } else {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.name });
        await setDoc(doc(db, "users", cred.user.uid), { name: form.name, email: form.email, role: "client", createdAt: serverTimestamp() });
        toast.success("Account created! ✨");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.code === "auth/invalid-credential" ? "Invalid email or password"
        : err.code === "auth/email-already-in-use" ? "Email already registered"
        : err.code === "auth/weak-password" ? "Password must be 6+ characters"
        : err.code === "auth/too-many-requests" ? "Too many attempts, try later"
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
      onSuccess?.();
      onClose();
    } catch (err) { if (err.code !== "auth/popup-closed-by-user") setError("Google sign-in failed"); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
          onClick={onClose}>

          <motion.div initial={{ scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[420px] overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--divider)", borderRadius: 28, boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 60px var(--accent-glow)" }}
            onClick={(e) => e.stopPropagation()}>

            {/* Glow accent */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "var(--accent)", opacity: 0.08, filter: "blur(60px)", pointerEvents: "none" }} />

            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--divider)" }}>
              <FiX size={16} />
            </button>

            {/* Header */}
            <div className="text-center pt-8 pb-2 px-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--accent-soft)", border: "1px solid var(--divider)" }}>
                <FiShoppingBag size={28} style={{ color: "var(--accent)" }} />
              </motion.div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {mode === "login" ? "Login to Continue" : "Create Your Account"}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {mode === "login" ? "Sign in to add items to cart & checkout" : "Join Sohafy for the best shopping experience"}
              </p>
            </div>

            {/* Body */}
            <div className="px-8 pb-8 pt-4">
              {/* Google */}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--divider)", color: "var(--text-primary)", cursor: "pointer" }}>
                <FcGoogle size={20} /> Continue with Google
              </motion.button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>OR</span>
                <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
              </div>

              {error && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  className="mb-3 px-3 py-2.5 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <AnimatePresence>
                  {mode === "signup" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="flex items-center gap-2.5 px-3.5 rounded-xl transition-all"
                        style={{ background: "transparent", border: "1.5px solid var(--accent)", borderOpacity: 0.3 }}>
                        <FiUser size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
                        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
                          className="w-full py-3 bg-transparent outline-none text-sm" style={{ color: "var(--text-primary)" }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2.5 px-3.5 rounded-xl transition-all"
                  style={{ background: "transparent", border: "1.5px solid var(--accent)", borderOpacity: 0.3 }}>
                  <FiMail size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required
                    className="w-full py-3 bg-transparent outline-none text-sm" style={{ color: "var(--text-primary)" }} />
                </div>

                <div className="flex items-center gap-2.5 px-3.5 rounded-xl transition-all"
                  style={{ background: "transparent", border: "1.5px solid var(--accent)", borderOpacity: 0.3 }}>
                  <FiLock size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <input name="password" type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={handleChange} required
                    className="w-full py-3 bg-transparent outline-none text-sm" style={{ color: "var(--text-primary)" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 2 }}>
                    {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: "var(--gradient-accent)", boxShadow: "0 4px 20px var(--accent-glow)", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                </motion.button>
              </form>

              <p className="text-center mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                  style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}>
                  {mode === "login" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthGateModal;
