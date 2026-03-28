import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle, FiTruck, FiArrowUpRight, FiZap, FiPlus, FiBarChart2, FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import formatPrice from "../utilities/formatPrice";

/* Animated counter hook */
const useCounter = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return count;
};

const DashboardOverview = () => {
  const user = useSelector((s) => s?.account?.user);
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0, pending: 0, delivered: 0, processing: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const [prodSnap, orderSnap, userSnap] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.PRODUCTS)),
        getDocs(query(collection(db, COLLECTIONS.ORDERS), orderBy("createdAt", "desc"))),
        getDocs(collection(db, COLLECTIONS.USERS)),
      ]);
      const orders = orderSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const revenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
      const pending = orders.filter((o) => o.status === "Pending").length;
      const delivered = orders.filter((o) => o.status === "Delivered").length;
      const processing = orders.filter((o) => o.status === "Processing").length;
      setStats({ products: prodSnap.size, orders: orderSnap.size, users: userSnap.size, revenue, pending, delivered, processing });
      setRecentOrders(orders.slice(0, 5));
      setTopProducts(prodSnap.docs.slice(0, 4).map((d) => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  const animProducts = useCounter(stats.products);
  const animOrders = useCounter(stats.orders);
  const animUsers = useCounter(stats.users);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const cards = [
    { label: "Total Products", value: animProducts, icon: FiPackage, gradient: "linear-gradient(135deg, #7c3aed, #a855f7)", glow: "rgba(124,58,237,0.35)", trend: "+12%" },
    { label: "Total Orders", value: animOrders, icon: FiShoppingCart, gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", glow: "rgba(245,158,11,0.35)", trend: "+8%" },
    { label: "Total Users", value: animUsers, icon: FiUsers, gradient: "linear-gradient(135deg, #10b981, #34d399)", glow: "rgba(16,185,129,0.35)", trend: "+22%" },
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: FiDollarSign, gradient: "linear-gradient(135deg, #ec4899, #f472b6)", glow: "rgba(236,72,153,0.35)", trend: "+18%" },
  ];

  const pipeline = [
    { label: "Pending", count: stats.pending, icon: FiClock, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { label: "Processing", count: stats.processing, icon: FiTruck, color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    { label: "Delivered", count: stats.delivered, icon: FiCheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  ];

  const quickActions = [
    { label: "Add Product", icon: FiPlus, path: "/dashboard/catalog", color: "#7c3aed" },
    { label: "View Orders", icon: FiShoppingCart, path: "/dashboard/orders", color: "#f59e0b" },
    { label: "Analytics", icon: FiBarChart2, path: "/dashboard/analytics", color: "#10b981" },
    { label: "Users", icon: FiUsers, path: "/dashboard/accounts", color: "#ec4899" },
  ];

  return (
    <div className="space-y-6">
      {/* ═══ WELCOME BANNER ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "var(--gradient-accent)", boxShadow: "0 8px 30px var(--accent-glow)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 60%)" }} />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiZap size={16} className="text-yellow-300" />
              <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Dashboard</span>
            </div>
            <h2 className="text-2xl font-black text-white">{greeting}, {user?.name?.split(" ")[0]} 👋</h2>
            <p className="text-white/60 text-sm mt-1">Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-xs font-semibold">Store Live</span>
          </div>
        </div>
      </motion.div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, gradient, glow, trend }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5 card-hover card-shine relative overflow-hidden group"
            style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" style={{ background: gradient, borderRadius: "0 0 0 100%" }} />
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: gradient, boxShadow: `0 8px 20px ${glow}` }}>
                <Icon size={20} />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                <FiArrowUpRight size={10} /> {trend}
              </div>
            </div>
            <p className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>{typeof value === "number" ? value.toLocaleString() : value}</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ MIDDLE ROW: Pipeline + Quick Actions ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order Pipeline */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <FiTrendingUp style={{ color: "var(--accent)" }} /> Order Pipeline
            </h3>
            <Link to="/dashboard/orders" className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: "var(--accent)" }}>
              View All <FiArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-5">
            {pipeline.map(({ label, count, icon: Icon, color, bg }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg, color }}>
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{count}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {stats.orders > 0 ? `${Math.round((count / stats.orders) * 100)}%` : "0%"}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: stats.orders > 0 ? `${(count / stats.orders) * 100}%` : "0%" }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}44` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4" style={{ borderTop: "1px solid var(--divider)" }}>
            <div className="text-center p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
              <p className="text-lg font-black" style={{ color: "var(--text-primary)" }}>{stats.orders}</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Total Orders</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
              <p className="text-lg font-black" style={{ color: "#10b981" }}>
                {stats.orders > 0 ? `${Math.round((stats.delivered / stats.orders) * 100)}%` : "0%"}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Delivery Rate</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
              <p className="text-lg font-black" style={{ color: "var(--text-primary)" }}>
                {stats.orders > 0 ? formatPrice(Math.round(stats.revenue / stats.orders)) : "N/A"}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Avg Order</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <FiZap style={{ color: "var(--accent)" }} /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, icon: Icon, path, color }) => (
              <Link key={label} to={path}
                className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-300 group"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--divider)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${color}15`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--divider)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{label}</span>
              </Link>
            ))}
          </div>

          {/* Top Products Mini */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--divider)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Top Products</p>
            <div className="space-y-2">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg transition-all" style={{ background: "var(--bg-elevated)" }}>
                  <img src={p?.productImage?.[0]} alt="" className="w-8 h-8 rounded-lg object-contain" style={{ background: "var(--bg-card)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{p?.productName}</p>
                    <p className="text-[10px]" style={{ color: "var(--accent)" }}>{formatPrice(p?.sellingPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RECENT ORDERS TABLE ═══ */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <FiShoppingCart style={{ color: "var(--accent)" }} /> Recent Orders
          </h3>
          <Link to="/dashboard/orders" className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--accent)" }}>
            View All <FiArrowUpRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto p-5 pt-3">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--divider)" }}>
                {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="transition-colors"
                  style={{ borderBottom: "1px solid var(--divider)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-soft)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>#{o.id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "var(--gradient-accent)" }}>
                        {o.userName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{o.userName}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{o.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-bold text-xs" style={{ color: "var(--text-primary)" }}>{formatPrice(o.totalPrice)}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
                      style={o.status === "Delivered" ? { background: "rgba(16,185,129,0.1)", color: "#10b981" }
                        : o.status === "Processing" ? { background: "rgba(99,102,241,0.1)", color: "#6366f1" }
                        : { background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                      {o.status === "Pending" && <FiClock size={10} />}
                      {o.status === "Processing" && <FiTruck size={10} />}
                      {o.status === "Delivered" && <FiCheckCircle size={10} />}
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {o.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
