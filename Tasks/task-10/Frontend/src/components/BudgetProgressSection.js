import React from "react";
import { AlertCircle, TrendingDown, TrendingUp, CheckCircle2 } from "lucide-react";
import { formatCurrency, getCategoryLabel } from "../utils/helpers";
import "./BudgetProgressSection.css";

const BudgetProgressSection = ({ budgets = [] }) => {
  if (!budgets || budgets.length === 0) return null;

  return (
    <div className="budget-progress-section">
      <div className="budget-header">
        <h3 className="budget-title">Budget Intelligence</h3>
        <p className="budget-description">Real-time expenditure tracking analysis</p>
      </div>

      <div className="budget-items-container">
        {budgets.map((budget) => (
          <BudgetProgressItem key={budget._id} budget={budget} />
        ))}
      </div>
    </div>
  );
};

const BudgetProgressItem = ({ budget }) => {
  const { category, spent, limit } = budget;
  const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  
  // Advanced Status Logic
  const isExceeded = spent > limit;
  const isNearLimit = percentage >= 80;
  
  const statusConfig = isExceeded 
    ? { class: "exceeded", icon: AlertCircle, label: "Over Budget" }
    : isNearLimit 
    ? { class: "near-limit", icon: TrendingUp, label: "Approaching Limit" }
    : { class: "under", icon: CheckCircle2, label: "On Track" };

  const StatusIcon = statusConfig.icon;

  return (
    <div className={`budget-item budget-item--${statusConfig.class}`}>
      <div className="budget-item-header">
        <div className="budget-item-label">
          <h4 className="budget-category">{typeof category === "string" ? getCategoryLabel(category) : category?.name}</h4>
          <p className="budget-amounts">{formatCurrency(spent)} of {formatCurrency(limit)}</p>
        </div>
        <div className="budget-item-status">
          <span className="budget-percentage" style={{ color: `var(--status-${statusConfig.class})` }}>
            {Math.round(percentage)}%
          </span>
          <StatusIcon size={16} />
        </div>
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div className={`progress-fill progress-fill--${statusConfig.class}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="budget-footer-info">
         {isExceeded ? (
            <p className="budget-alert">Exceeded by {formatCurrency(spent - limit)}</p>
         ) : isNearLimit ? (
            <p className="budget-warning">Only {formatCurrency(limit - spent)} left</p>
         ) : null}
      </div>
    </div>
  );
};

export default BudgetProgressSection;