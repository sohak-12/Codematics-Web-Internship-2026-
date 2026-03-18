import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency } from "../utils/helpers";
import "./BudgetAnalytics.css";

const BudgetAnalytics = ({ velocityData, varianceData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = data.budget > 0 ? ((data.actual / data.budget) * 100).toFixed(0) : 0;
      return (
        <div className="custom-tooltip">
          <p style={{ marginBottom: 4, fontWeight: 600 }}>{label}: {formatCurrency(data.actual)}</p>
          <p style={{ color: '#34d399', fontSize: 12 }}>Utilization: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const axisStyle = { fontSize: 11, fill: 'var(--text-secondary, #64748b)' };
  const gridStroke = 'rgba(168,85,247,0.08)';

  return (
    <div className="budget-analytics">
      <div className="analytics-section">
        <h3 className="analytics-title">Spending Velocity</h3>
        <p className="analytics-subtitle">Cumulative spend vs ideal pace</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={velocityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradientIdeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} />
            <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
              <div className="custom-tooltip">
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Day {label}</p>
                {payload.map((p, i) => <p key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name}: {formatCurrency(p.value || 0)}</p>)}
              </div>
            ) : null} />
            <Area type="monotone" dataKey="actual" name="Actual" stroke="#a855f7" strokeWidth={2.5} fill="url(#gradientActual)" connectNulls />
            <Area type="monotone" dataKey="ideal" name="Ideal" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="5 3" fill="url(#gradientIdeal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-section">
        <h3 className="analytics-title">Budget Variance</h3>
        <p className="analytics-subtitle">Category-wise performance</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={varianceData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
            <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis dataKey="category" type="category" tick={axisStyle} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="budget" name="Budget" fill="rgba(168,85,247,0.15)" radius={[0, 6, 6, 0]} barSize={14} />
            <Bar dataKey="actual" name="Actual" radius={[0, 6, 6, 0]} barSize={14}>
              {(varianceData || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.actual > entry.budget ? '#f87171' : '#34d399'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetAnalytics;