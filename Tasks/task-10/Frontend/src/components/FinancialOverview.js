import React, { useMemo } from "react";
import { TrendingUp, Hash, BarChart2, Calendar } from "lucide-react";
import "./FinancialOverview.css";

const FinancialOverview = ({ transactions = [] }) => {
  const stats = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const count = transactions.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [transactions]);

  return (
    <div className="financial-overview">
      <MetricCard
        icon={<TrendingUp size={20} />}
        label="Total Spending"
        value={`$${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        subtext="This period"
        accent="#a855f7"
      />
      <MetricCard
        icon={<Hash size={20} />}
        label="Transactions"
        value={stats.count}
        subtext="Entries recorded"
        accent="#6366f1"
      />
      <MetricCard
        icon={<BarChart2 size={20} />}
        label="Avg. Transaction"
        value={`$${stats.avg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        subtext="Per spend"
        accent="#00d2ff"
      />
      <MetricCard
        icon={<Calendar size={20} />}
        label="Reporting Period"
        value={new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        subtext="Current Month"
        accent="#34d399"
      />
    </div>
  );
};

const MetricCard = ({ icon, label, value, subtext, accent }) => (
  <div className="metric-card">
    <div className="metric-icon" style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}>
      {icon}
    </div>
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
    <div className="metric-subtext">{subtext}</div>
  </div>
);

export default FinancialOverview;
