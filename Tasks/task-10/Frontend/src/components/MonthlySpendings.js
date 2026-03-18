import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../utils/helpers";
import "./Chart.css";

const MonthlySpendings = ({ data = [] }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Monthly Spending Trend</h3>
      {data.length === 0 ? (
        <div className="chart-empty">No trend data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} tick={{fill: 'var(--text-secondary)'}} />
            <Tooltip 
              cursor={{ stroke: 'var(--accent-color)', strokeWidth: 1 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="spending" 
              stroke="var(--accent-color)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSpending)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlySpendings;