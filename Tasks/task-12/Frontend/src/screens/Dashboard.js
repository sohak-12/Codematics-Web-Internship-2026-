import React, { useState } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { FiUsers, FiPackage, FiGrid, FiShoppingCart, FiBarChart2, FiTag, FiZap, FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: FiGrid, exact: true, badge: null },
  { path: "/dashboard/catalog", label: "Products", icon: FiPackage, badge: null },
  { path: "/dashboard/categories", label: "Categories", icon: FiTag, badge: null },
  { path: "/dashboard/orders", label: "Orders", icon: FiShoppingCart, badge: "hot" },
  { path: "/dashboard/accounts", label: "Users", icon: FiUsers, badge: null },
  { path: "/dashboard/analytics", label: "Revenue", icon: FiBarChart2, badge: "new" },
];

const Dashboard = () => {
  const user = useSelector((s) => s?.account?.user);
  const role = useSelector((s) => s?.account?.role);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (!user || role !== "admin") return <Navigate to="/" />;

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out!");
  };

  return (
    <div className={`flex min-h-[80vh] gap-4 animate-fade-in ${collapsed ? "" : "md:gap-6"}`}>
      {/* ═══ SIDEBAR ═══ */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col rounded-2xl sticky top-24 h-fit overflow-hidden"
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid var(--divider)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* User Card */}
        <div className="p-3">
          <div className="flex items-center gap-3 p-3 rounded-xl relative overflow-hidden" style={{ background: "var(--accent-soft)" }}>
            {/* Animated glow behind avatar */}
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 50%, var(--accent-glow), transparent 70%)" }} />
            <div className="relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: "var(--gradient-accent)", boxShadow: "0 4px 15px var(--accent-glow)" }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2" style={{ background: "#10b981", borderColor: "var(--bg-card)" }} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="min-w-0 relative">
                  <p className="font-bold text-sm truncate" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                  <div className="flex items-center gap-1">
                    <FiZap size={10} style={{ color: "var(--accent)" }} />
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Admin</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 pb-2 space-y-0.5">
          {navItems.map(({ path, label, icon: Icon, exact, badge }) => {
            const isActive = exact ? location.pathname === path : location.pathname.startsWith(path) && path !== "/dashboard";
            return (
              <Link key={path} to={path}
                className="relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300 group"
                style={{
                  padding: collapsed ? "10px 0" : "10px 14px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  ...(isActive ? {
                    background: "var(--gradient-accent)", color: "white",
                    boxShadow: "0 4px 15px var(--accent-glow)",
                  } : { color: "var(--text-secondary)" }),
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{ background: "white" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <Icon size={18} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap">
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Badge */}
                {badge && !collapsed && (
                  <span className="ml-auto text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md"
                    style={badge === "hot"
                      ? { background: "rgba(239,68,68,0.15)", color: "#f87171" }
                      : { background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-2 pb-3 space-y-1">
          <div className="h-px mx-2 mb-1" style={{ background: "var(--divider)" }} />
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              padding: collapsed ? "10px 0" : "10px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}>
            <FiLogOut size={18} />
            <AnimatePresence>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Logout</motion.span>}
            </AnimatePresence>
          </button>

          {/* Collapse Toggle */}
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300"
            style={{
              padding: collapsed ? "10px 0" : "10px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}>
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            <AnimatePresence>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Collapse</motion.span>}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ═══ MOBILE NAV ═══ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 px-1"
        style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--divider)" }}>
        {navItems.map(({ path, icon: Icon, label, exact }) => {
          const isActive = exact ? location.pathname === path : location.pathname.startsWith(path) && path !== "/dashboard";
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all"
              style={isActive ? { color: "var(--accent)" } : { color: "var(--text-muted)" }}>
              <Icon size={18} />
              <span className="text-[9px] font-semibold">{label}</span>
              {isActive && <div className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: "var(--gradient-accent)" }} />}
            </Link>
          );
        })}
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 min-h-[50vh] pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
