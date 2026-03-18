import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency, categoryColors } from "../utils/helpers";
import "./TransactionAnalytics.css";

const TransactionAnalytics = ({ dailyData, categoryData }) => {
  const axisStyle = { fontSize: 11, fill: "var(--text-secondary, #64748b)" };
  const gridStroke = "rgba(168,85,247,0.08)";

  return (
    <div className="transaction-analytics">
      <div className="analytics-section">
        <h3 className="analytics-title">Spending Velocity</h3>
        <p className="analytics-subtitle">Daily spend over time</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`} />
            <Tooltip content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="custom-tooltip">
                  <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{label}</p>
                  <p style={{ color: "#a855f7", fontWeight: 700 }}>Spent: {formatCurrency(payload[0].value || 0)}</p>
                </div>
              ) : null
            } />
            <Area type="monotone" dataKey="amount" name="Spent" stroke="#a855f7" strokeWidth={2.5} fill="url(#txGradient)" connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-section">
        <h3 className="analytics-title">Category Variance</h3>
        <p className="analytics-subtitle">Spending by category</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
            <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis dataKey="category" type="category" tick={axisStyle} axisLine={false} tickLine={false} width={90} />
            <Tooltip content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="custom-tooltip">
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
                  <p style={{ color: "#34d399", fontSize: 12 }}>{formatCurrency(payload[0].value)}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 11 }}>{payload[0].payload.percentage}% of total</p>
                </div>
              ) : null
            } />
            <Bar dataKey="amount" name="Spent" radius={[0, 6, 6, 0]} barSize={14}>
              {categoryData.map((entry, i) => (
                <Cell key={i} fill={categoryColors[entry.rawCategory] || "#a855f7"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
