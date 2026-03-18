import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./SpendingTrendChart.css";

const SpendingTrendChart = ({ transactions = [] }) => {
  // Memoized data processing for high performance
  const { data, stats } = useMemo(() => {
    if (!transactions.length) return { data: [], stats: null };

    const dailyMap = transactions.reduce((acc, t) => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {});

    const processedData = Object.entries(dailyMap)
      .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(2)) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const total = processedData.reduce((sum, item) => sum + item.amount, 0);
    const highestItem = processedData.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev));

    return {
      data: processedData,
      stats: {
        highest: highestItem.amount,
        highestDay: highestItem.date,
        average: (total / processedData.length).toFixed(2),
        total: total.toFixed(2),
      },
    };
  }, [transactions]);

  if (!stats) return <div className="spending-trend empty-state">No data available</div>;

  return (
    <div className="spending-trend">
      <div className="trend-header">
        <h3>Spending Trend</h3>
        <span className="trend-period">{data.length} days active</span>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(168,85,247,0.08)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#475569'}} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} tick={{fontSize: 11, fill: '#475569'}} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={2.5} fill="url(#spendingGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="trend-stats">
        <StatItem label="Highest Day" value={`$${stats.highest}`} sub={stats.highestDay} />
        <StatItem label="Daily Average" value={`$${stats.average}`} sub="per day" />
        <StatItem label="Period Total" value={`$${stats.total}`} sub={`${data.length} days`} />
      </div>
    </div>
  );
};

const StatItem = ({ label, value, sub }) => (
  <div className="stat-item">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-text">{sub}</div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-date">{payload[0].payload.date}</div>
        <div className="tooltip-amount">${payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export default SpendingTrendChart;