import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { categoryColors, getCategoryLabel, formatCurrency } from "../utils/helpers";
import "./Chart.css";

const CategoryDistribution = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: getCategoryLabel(item.category),
    value: item.amount,
    category: item.category,
  }));

  return (
    <div className="chart-content">
      <h3 className="chart-title">Spending Breakdown</h3>
      {chartData.length === 0 ? (
        <div className="chart-empty">No spending data yet</div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={65} 
                outerRadius={85}
                paddingAngle={6}
                cornerRadius={8}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={categoryColors[entry.category] || "#94a3b8"} 
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Amount"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(168,85,247,0.2)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  background: "rgba(15,23,42,0.9)",
                  backdropFilter: "blur(12px)",
                  color: "#f8fafc"
                }}
              />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CategoryDistribution;