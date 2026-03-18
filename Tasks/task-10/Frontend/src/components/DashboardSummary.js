import React, { useMemo } from "react";
import { DollarSign, Activity, TrendingUp, Target, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { formatCurrency, calculateTrendIndicator, getCategoryLabel } from "../utils/helpers";
import "./DashboardSummary.css";

const DashboardSummary = ({ stats, transactions = [], previousTransactions = [] }) => {
  const metrics = useMemo(() => {
    // Advanced calculation logic
    const currentTotal = stats.totalExpenses || 0;
    const prevTotal = previousTransactions.reduce((sum, t) => sum + t.amount, 0);
    const trend = calculateTrendIndicator(currentTotal, prevTotal);
    
    // Efficiently finding largest category
    const categoryMap = transactions.reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {});
    const largestKey = Object.keys(categoryMap).reduce((a, b) => categoryMap[a] > categoryMap[b] ? a : b, "");

    return { trend, largestCategory: { name: largestKey, amount: categoryMap[largestKey] || 0 } };
  }, [stats, transactions, previousTransactions]);

  const cards = [
    { title: "Total Expenses", value: formatCurrency(stats.totalExpenses), icon: DollarSign, trend: metrics.trend, color: "primary" },
    { title: "Transactions", value: stats.totalTransactions, icon: Activity, subtitle: "Total count this period", color: "secondary" },
    { title: "Avg. Spend", value: formatCurrency(stats.totalExpenses / (stats.totalTransactions || 1)), icon: TrendingUp, color: "tertiary" },
    { title: "Top Category", value: getCategoryLabel(metrics.largestCategory.name), subtitle: formatCurrency(metrics.largestCategory.amount), icon: Target, color: "quaternary" },
  ];

  return (
    <div className="dashboard-summary">
      {cards.map((c, i) => <SummaryCard key={i} {...c} />)}
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, trend, subtitle, color }) => (
  <div className={`summary-card summary-card--${color}`}>
    <div className="summary-card__header">
      <h3 className="summary-card__title">{title}</h3>
      <div className="summary-card__icon-wrapper"><Icon size={20} /></div>
    </div>
    <div className="summary-card__content">
      <p className="summary-card__value">{value}</p>
      {subtitle && <p className="summary-card__subtitle">{subtitle}</p>}
    </div>
    {trend && (
      <div className={`summary-card__trend summary-card__trend--${trend.direction}`}>
        {trend.direction === "up" ? <ArrowUp size={14}/> : trend.direction === "down" ? <ArrowDown size={14}/> : <Minus size={14}/>}
        <span>{Math.abs(trend.percentage)}%</span>
      </div>
    )}
  </div>
);

export default DashboardSummary;