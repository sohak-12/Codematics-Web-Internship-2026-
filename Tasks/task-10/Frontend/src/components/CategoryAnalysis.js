import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./CategoryAnalysis.css";

const CategoryAnalysis = ({ transactions = [] }) => {
  const getCategoryBreakdown = () => {
    if (!transactions.length) return [];
    
    const categoryMap = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);
    
    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: parseFloat(value.toFixed(2)),
        percentage: ((value / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  };

  const categories = getCategoryBreakdown();
  
  // Professional color palette - Modern Indigo/Teal shades
  const COLORS = ["#a855f7", "#6366f1", "#00d2ff", "#f59e0b", "#34d399", "#f87171"];

  return (
    <div className="category-analysis">
      <div className="analysis-header">
        <h3>Category Intelligence</h3>
        <div className="header-stats">
           <div className="stat">
             <span className="stat-label">Total Spend</span>
             <span className="stat-value">${categories.reduce((a,b) => a + b.value, 0).toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              cornerRadius={10}
            >
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={({ active, payload }) => active && payload ? (
                <div className="category-tooltip">
                    <p className="tooltip-name">{payload[0].name}</p>
                    <p className="tooltip-value">${payload[0].value}</p>
                </div>
            ) : null} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="category-list">
        {categories.map((cat, index) => (
          <div key={cat.name} className="list-row">
            <div className="list-col category-name">
              <span className="category-indicator" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              {cat.name}
            </div>
            <div className="list-col category-amount">${cat.value}</div>
            <div className="list-col category-percent">{cat.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryAnalysis;