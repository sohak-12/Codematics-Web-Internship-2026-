import React, { useMemo } from "react";
import { Zap, Activity, AlertCircle, TrendingUp, Lightbulb, CheckCircle } from "lucide-react";
import { generateFinancialInsights } from "../utils/helpers";
import "./FinancialInsights.css";

const FinancialInsights = ({ stats, transactions = [], isDarkTheme = false }) => {
  const insights = useMemo(() => generateFinancialInsights(stats, transactions, isDarkTheme), [stats, transactions, isDarkTheme]);

  // Mapping remains efficient, but we ensure icons are memoized for better re-render perf
  const IconMap = {
    category: TrendingUp,
    average: Zap,
    activity: Activity,
    alert: AlertCircle,
    success: CheckCircle,
    info: Lightbulb,
  };

  if (!insights.length) return null;

  return (
    <div className="financial-insights">
      <div className="insights-header">
        <h3 className="insights-title">Smart Financial Insights</h3>
        <p className="insights-description">AI-driven analysis of your spending patterns</p>
      </div>

      <div className="insights-container">
        {insights.map((insight, index) => {
          const Icon = IconMap[insight.type] || Lightbulb;
          return (
            <InsightItem 
              key={`${insight.type}-${index}`} 
              insight={insight} 
              index={index} 
              Icon={Icon} 
            />
          );
        })}
      </div>
    </div>
  );
};

const InsightItem = ({ insight, index, Icon }) => (
  <div className={`insight-item insight-item--${insight.type}`} style={{ animationDelay: `${index * 0.05}s` }}>
    <div className="insight-icon-wrapper">
      <Icon className="insight-icon" />
    </div>
    <p className="insight-message">{insight.message}</p>
  </div>
);

export default FinancialInsights;