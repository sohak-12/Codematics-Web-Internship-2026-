import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import formatPrice from "../utilities/formatPrice";
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiCalendar } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#7c3aed", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const RevenueAnalytics = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, COLLECTIONS.ORDERS));
      const orders = snap.docs.map((d) => d.data());

      setTotalOrders(orders.length);
      setTotalRevenue(orders.reduce((s, o) => s + (o.totalPrice || 0), 0));

      const monthly = {};
      const catMap = {};
      orders.forEach((o) => {
        const date = o.createdAt?.toDate?.();
        if (date) {
          const key = date.toLocaleString("default", { month: "short", year: "2-digit" });
          monthly[key] = (monthly[key] || 0) + (o.totalPrice || 0);
        }
        o.products?.forEach((p) => {
          catMap[p.name?.split(" ")[0] || "Other"] = (catMap[p.name?.split(" ")[0] || "Other"] || 0) + (p.price * p.qty);
        });
      });

      setMonthlyData(Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })));
      setCategoryData(Object.entries(catMap).slice(0, 6).map(([name, value]) => ({ name, value })));
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Revenue Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: formatPrice(totalRevenue), icon: FiDollarSign, gradient: "linear-gradient(135deg, #10b981, #059669)", glow: "rgba(16,185,129,0.3)" },
          { label: "Total Orders", value: totalOrders, icon: FiShoppingCart, gradient: "linear-gradient(135deg, #7c3aed, #9333ea)", glow: "rgba(124,58,237,0.3)" },
          { label: "Avg Order", value: totalOrders > 0 ? formatPrice(totalRevenue / totalOrders) : "N/A", icon: FiTrendingUp, gradient: "linear-gradient(135deg, #f59e0b, #d97706)", glow: "rgba(245,158,11,0.3)" },
        ].map(({ label, value, icon: Icon, gradient, glow }) => (
          <div key={label} className="rounded-2xl p-5 card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: gradient, boxShadow: `0 8px 20px ${glow}` }}><Icon size={18} /></div>
            <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{value}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}><FiCalendar style={{ color: "var(--accent)" }} /> Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <Tooltip formatter={(v) => formatPrice(v)} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--divider)", borderRadius: 12, color: "var(--text-primary)" }} />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
          <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Revenue by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name }) => name}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatPrice(v)} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--divider)", borderRadius: 12, color: "var(--text-primary)" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center" style={{ color: "var(--text-muted)" }}>No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
