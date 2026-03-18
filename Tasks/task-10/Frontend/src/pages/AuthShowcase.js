import React, { useEffect } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion"; // For premium feel
import "./AuthShowcase.css";

/* ─── Mock demo data (no real user data) ────────────────── */

const MONTHLY_SPEND = [
  { month: "Aug", amount: 2100 },
  { month: "Sep", amount: 2850 },
  { month: "Oct", amount: 2400 },
  { month: "Nov", amount: 3200 },
  { month: "Dec", amount: 2950 },
  { month: "Jan", amount: 3600 },
];

const CATEGORY_SPEND = [
  { name: "Food",       value: 38, color: "#a855f7" }, 
  { name: "Transport",  value: 22, color: "#7c3aed" },
  { name: "Shopping",   value: 20, color: "#6366f1" },
  { name: "Utilities",  value: 12, color: "#4f46e5" },
  { name: "Health",     value: 8,  color: "#3f3f46" },
];

const BUDGETS = [
  { label: "Food & Dining",   spent: 380,  limit: 500,  pct: 76 },
  { label: "Transport",       spent: 145,  limit: 250,  pct: 58 },
  { label: "Shopping",        spent: 490,  limit: 400,  pct: 100 },
  { label: "Utilities",       spent: 112,  limit: 200,  pct: 56 },
];

const TRANSACTIONS = [
  { name: "Spotify Premium",    cat: "Subscriptions", amount: "-$9.99",  delta: -1 },
  { name: "Salary Deposit",     cat: "Income",         amount: "+$4,200", delta: +1 },
  { name: "Whole Foods Market", cat: "Groceries",      amount: "-$67.42", delta: -1 },
  { name: "Netflix",            cat: "Entertainment",  amount: "-$15.99", delta: -1 },
  { name: "Freelance Invoice",  cat: "Income",         amount: "+$850",   delta: +1 },
];

const SUMMARY_STATS = [
  { label: "Net Balance",   value: "$12,480",  trend: "+8.4%" },
  { label: "Total Spent",   value: "$3,240",   trend: "+5.2%" },
  { label: "Saved",         value: "$4,800",   trend: "+12.1%" },
];

/* ─── Animation Variants ────────────────────────────────── */

const smoothTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.6
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: smoothTransition
  }
};

const metaVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ...smoothTransition, delay: 0.2 }
  },
  exit: { opacity: 0, y: -10 }
};

/* ─── Story components ───────────────────────────────────── */

const StoryTransactions = ({ isActive }) => (
  <motion.div 
    className="story-card"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="story-card-header">
      <span className="story-chip">Recent Transactions</span>
      <span className="story-chip-secondary">January 2026</span>
    </div>
    <div className="tx-list">
      {TRANSACTIONS.map((tx, i) => (
        <motion.div key={i} variants={itemVariants} className="tx-row">
          <div className="tx-icon-wrap">
            <span className="tx-initials">{tx.name[0]}</span>
          </div>
          <div className="tx-details">
            <span className="tx-name">{tx.name}</span>
            <span className="tx-cat">{tx.cat}</span>
          </div>
          <span className={`tx-amount ${tx.delta > 0 ? "positive" : "negative"}`}>
            {tx.amount}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const StoryChart = ({ isActive }) => (
  <motion.div 
    className="story-card"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="story-card-header">
      <span className="story-chip">Monthly Spending</span>
      <span className="story-chip-positive">↑ 8.4%</span>
    </div>
    <div className="chart-summary-row">
      <motion.div variants={itemVariants}>
        <p className="chart-big-number">$3,600</p>
        <p className="chart-big-label">January spend</p>
      </motion.div>
    </div>
    <motion.div variants={itemVariants} style={{ width: "100%", height: 130 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={MONTHLY_SPEND} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"   stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%"  stopColor="#a855f7" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "rgba(26, 26, 26, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              backdropFilter: "blur(10px)",
              fontSize: 12,
              color: "#fff",
            }}
            formatter={(v) => [`$${v.toLocaleString()}`, "Spent"]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#areaGrad)"
            isAnimationActive={isActive}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  </motion.div>
);

const StoryBudgets = ({ isActive }) => (
  <motion.div 
    className="story-card"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="story-card-header">
      <span className="story-chip">Budget Tracker</span>
      <span className="story-chip-secondary">This month</span>
    </div>
    <div className="budget-list">
      {BUDGETS.map((b, i) => (
        <motion.div key={i} variants={itemVariants} className="budget-row">
          <div className="budget-row-top">
            <span className="budget-label">{b.label}</span>
            <span className={`budget-fraction ${b.pct >= 100 ? "over" : ""}`}>
              ${b.spent} <span className="budget-limit">/ ${b.limit}</span>
            </span>
          </div>
          <div className="budget-track">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(b.pct, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
              className={`budget-fill ${b.pct >= 100 ? "budget-fill-over" : ""}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const StoryOverview = ({ isActive }) => (
  <motion.div 
    className="story-card"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="story-card-header">
      <span className="story-chip">Financial Overview</span>
      <span className="story-chip-secondary">Q1 2026</span>
    </div>
    <div className="overview-body">
      <motion.div variants={itemVariants} style={{ width: 130, height: 130, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CATEGORY_SPEND}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={60}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={isActive}
            >
              {CATEGORY_SPEND.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      <div className="pie-legend">
        {CATEGORY_SPEND.map((c, i) => (
          <motion.div key={i} variants={itemVariants} className="pie-legend-row">
            <span className="pie-dot" style={{ background: c.color }} />
            <span className="pie-cat-name">{c.name}</span>
            <span className="pie-cat-pct">{c.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
    <div className="summary-stats-row">
      {SUMMARY_STATS.map((s, i) => (
        <motion.div key={i} variants={itemVariants} className="summary-stat">
          <span className="summary-stat-value">{s.value}</span>
          <span className="summary-stat-label">{s.label}</span>
          <span className="summary-stat-trend">{s.trend}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ─── Story metadata ─────────────────────────────────────── */

const STORIES = [
  {
    id: "transactions",
    headline: "Track every transaction",
    subtext: "Every expense and income entry, organized and searchable.",
    Component: StoryTransactions,
  },
  {
    id: "chart",
    headline: "Visualize your spending",
    subtext: "Monthly trends and patterns, rendered in real time.",
    Component: StoryChart,
  },
  {
    id: "budgets",
    headline: "Control your budgets",
    subtext: "Set category limits and monitor exactly where you stand.",
    Component: StoryBudgets,
  },
  {
    id: "overview",
    headline: "Understand your finances",
    subtext: "A complete picture of your wealth, at a glance.",
    Component: StoryOverview,
  },
];

/* ─── Main export ─────────────────────────────────────────── */

const AuthShowcase = ({ activeSlide, onDotClick }) => {
  const story = STORIES[activeSlide] || STORIES[0];
  const { Component } = story;

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (activeSlide + 1) % STORIES.length;
      if (onDotClick) onDotClick(nextSlide);
    }, 5000); // Switches every 5 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, [activeSlide, onDotClick]);

  return (
    <div className="showcase-body">
      <div className="preview-window">
        <div className="preview-window-bar">
          <span className="window-dot red" />
          <span className="window-dot yellow" />
          <span className="window-dot green" />
          <span className="window-title">Sohanix — insights</span>
        </div>
        <div className="preview-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Component isActive />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          className="story-meta" 
          key={`meta-${activeSlide}`}
          variants={metaVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p className="story-headline">{story.headline}</p>
          <p className="story-subtext">{story.subtext}</p>
        </motion.div>
      </AnimatePresence>

      <div className="story-dots">
        {STORIES.map((_, idx) => (
          <button
            key={idx}
            className={`story-dot ${idx === activeSlide ? "active" : ""}`}
            onClick={() => onDotClick && onDotClick(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthShowcase;