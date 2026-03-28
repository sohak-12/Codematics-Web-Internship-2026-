"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, Sun, Moon, Menu, X, Shield } from "lucide-react";
import { useState } from "react";

const HIDDEN_ROUTES = ["/login", "/signup"];

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 glass-static !rounded-none !border-x-0 !border-t-0"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
            <Image src="/icon.png" alt="Preplyx" width={22} height={22} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent font-[Space_Grotesk]">
            Preplyx
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--accent-bg)] transition-all duration-300"
            title="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-[18px] h-[18px] text-[var(--text-muted)]" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-[18px] h-[18px] text-[var(--text-muted)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {user ? (
            <>
              <Link href="/admin">
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)] transition-all">
                  <Shield className="w-4 h-4" /> Admin
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)] transition-all">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
              </Link>
              <div className="w-px h-6 bg-[var(--border-glass)] mx-1" />
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)] transition-all">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="btn-glow !py-2 !px-5 !text-sm">Get Started</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--accent-bg)]" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5 text-[var(--text-primary)]" /> : <Menu className="w-5 h-5 text-[var(--text-primary)]" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="glass-static !rounded-t-none mx-4 mb-4 p-3 space-y-1">
              <button onClick={() => { toggleTheme(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-bg)]">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-bg)]">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                  </Link>
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-bg)]">
                      <Shield className="w-4 h-4" /> Admin
                    </button>
                  </Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)]">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <button className="w-full px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-bg)]">Sign In</button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <button className="w-full btn-glow !py-2.5 !text-sm">Get Started</button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
