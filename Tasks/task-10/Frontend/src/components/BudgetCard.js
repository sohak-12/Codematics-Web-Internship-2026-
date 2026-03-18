import React from "react";
import { Edit2, Trash2, AlertCircle, TrendingUp } from "lucide-react";
import { formatCurrency, categoryColors } from "../utils/helpers";
import "./BudgetCard.css";

// Sub-component for clean stats rendering
const StatItem = ({ label, value, className = "" }) => (
  <div className="stat">
    <span className="stat__label">{label}</span>
    <span className={`stat__value ${className}`}>{value}</span>
  </div>
);

const BudgetCard = ({ category, budget, spent = 0, onEdit, onDelete }) => {
  const remaining = budget.monthlyLimit - spent;
  const percentageUsed = Math.min((spent / budget.monthlyLimit) * 100, 100);
  const isOverBudget = spent > budget.monthlyLimit;
  const isApproaching = !isOverBudget && percentageUsed >= 75;

  return (
    <div className={`budget-card ${isOverBudget ? "budget-card--over" : isApproaching ? "budget-card--warning" : ""}`}>
      <div className="budget-card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
            <TrendingUp size={16} color={categoryColors[category] || "#3b82f6"} />
          </div>
          <h3 className="budget-card__title">{category}</h3>
        </div>
        
        <div className="budget-card__actions">
          <button className="budget-card__action-btn edit" onClick={() => onEdit(category)}>
            <Edit2 size={16} />
          </button>
          <button className="budget-card__action-btn delete" onClick={() => onDelete(category)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="budget-card__progress">
        <div
          className="budget-card__progress-bar"
          style={{
            width: `${percentageUsed}%`,
            background: isOverBudget 
              ? '#ef4444' 
              : `linear-gradient(90deg, ${categoryColors[category] || '#3b82f6'}, #8b5cf6)`
          }}
        />
      </div>

      <div className="budget-card__stats">
        <StatItem label="Spent" value={formatCurrency(spent)} />
        <StatItem label="Limit" value={formatCurrency(budget.monthlyLimit)} />
        <StatItem 
          label="Remaining" 
          value={formatCurrency(Math.max(remaining, 0))} 
          className={isOverBudget ? "over-budget" : "remaining"} 
        />
      </div>

      {isOverBudget && (
        <div className="budget-card__warning">
          <AlertCircle size={14} className="warning-icon" />
          <span>Limit Exceeded by {formatCurrency(spent - budget.monthlyLimit)}</span>
        </div>
      )}
      {isApproaching && (
        <div className="budget-card__approaching">
          <AlertCircle size={14} />
          <span>{Math.round(percentageUsed)}% used — approaching limit</span>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;