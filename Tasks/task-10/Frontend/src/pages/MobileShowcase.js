import React, { useState, useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import "./MobileShowcase.css";

/* ─── Story card data ─────────────────────────────────────
   CSS-only animated visuals — no Recharts for mobile perf.
──────────────────────────────────────────────────────────── */
const MOBILE_STORIES = [
  {
    id: "transactions",
    label: "01 — Transactions",
    headline: "Track every\nfinancial move",
    subtext: "",
    visual: "transactions",
  },
  {
    id: "spending",
    label: "02 — Analytics",
    headline: "Visualize your\nspending patterns",
    subtext: "Monthly trend charts that reveal where your money actually goes.",
    visual: "chart",
  },
  {
    id: "budgets",
    label: "03 — Budgets",
    headline: "Control your\ncategory budgets",
    subtext: "Set spending limits per category. Real-time progress shows exactly where you stand.",
    visual: "budgets",
  },
  {
    id: "overview",
    label: "04 — Insights",
    headline: "Understand your\nwhole picture",
    subtext: "Net balance, savings rate, and spending breakdown — all in one clean view.",
    visual: "overview",
  },
];

/* ─── CSS-only visual components ─────────────────────────── */

const TransactionsVisual = () => (
  <div className="mv-tx-list">
    {[
      { name: "Salary Deposit",      cat: "Income",         amount: "+$4,200", neg: false },
      { name: "Whole Foods Market",  cat: "Groceries",      amount: "-$67.42", neg: true  },
      { name: "Spotify Premium",     cat: "Subscriptions",  amount: "-$9.99",  neg: true  },
      { name: "Freelance Invoice",   cat: "Income",         amount: "+$850",   neg: false },
    ].map((tx, i) => (
      <div className="mv-tx-row" key={i} style={{ animationDelay: `${i * 70}ms` }}>
        <div className="mv-tx-avatar">{tx.name[0]}</div>
        <div className="mv-tx-info">
          <span className="mv-tx-name">{tx.name}</span>
          <span className="mv-tx-cat">{tx.cat}</span>
        </div>
        <span className={`mv-tx-amount ${tx.neg ? "neg" : "pos"}`}>{tx.amount}</span>
      </div>
    ))}
  </div>
);

const ChartVisual = () => (
  <div className="mv-chart">
    <div className="mv-chart-number">$3,600</div>
    <div className="mv-chart-label">January spending</div>
    <div className="mv-bars">
      {[42, 68, 55, 78, 62, 88].map((h, i) => (
        <div className="mv-bar-col" key={i}>
          <div
            className="mv-bar"
            style={{
              "--bar-h": `${h}%`,
              animationDelay: `${i * 60}ms`,
            }}
          />
          <span className="mv-bar-label">
            {["A","S","O","N","D","J"][i]}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const BudgetsVisual = () => (
  <div className="mv-budgets">
    {[
      { label: "Food & Dining",  pct: 76, over: false },
      { label: "Shopping",       pct: 100, over: true },
      { label: "Transport",      pct: 58, over: false },
      { label: "Utilities",      pct: 56, over: false },
    ].map((b, i) => (
      <div className="mv-budget-row" key={i} style={{ animationDelay: `${i * 80}ms` }}>
        <div className="mv-budget-top">
          <span className="mv-budget-name">{b.label}</span>
          <span className={`mv-budget-pct ${b.over ? "over" : ""}`}>{b.pct}%</span>
        </div>
        <div className="mv-budget-track">
          <div
            className={`mv-budget-fill ${b.over ? "over" : ""}`}
            style={{ "--fill-w": `${Math.min(b.pct, 100)}%`, animationDelay: `${i * 80 + 200}ms` }}
          />
        </div>
      </div>
    ))}
  </div>
);

const OverviewVisual = () => (
  <div className="mv-overview">
    <div className="mv-stats-grid">
      {[
        { label: "Net Balance", value: "$12,480", trend: "+8.4%" },
        { label: "Total Spent", value: "$3,240",  trend: "+5.2%" },
        { label: "Saved",       value: "$4,800",  trend: "+12.1%" },
      ].map((s, i) => (
        <div className="mv-stat-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
          <span className="mv-stat-value">{s.value}</span>
          <span className="mv-stat-label">{s.label}</span>
          <span className="mv-stat-trend">{s.trend}</span>
        </div>
      ))}
    </div>
    <div className="mv-cat-bars">
      {[
        { name: "Food",      pct: 38 },
        { name: "Transport", pct: 22 },
        { name: "Shopping",  pct: 20 },
        { name: "Other",     pct: 20 },
      ].map((c, i) => (
        <div className="mv-cat-row" key={i}>
          <span className="mv-cat-name">{c.name}</span>
          <div className="mv-cat-track">
            <div
              className="mv-cat-fill"
              style={{ "--fill-w": `${c.pct}%`, animationDelay: `${i * 60 + 300}ms` }}
            />
          </div>
          <span className="mv-cat-pct">{c.pct}%</span>
        </div>
      ))}
    </div>
  </div>
);

const VISUALS = {
  transactions: TransactionsVisual,
  chart: ChartVisual,
  budgets: BudgetsVisual,
  overview: OverviewVisual,
};

/* ─── Main component ──────────────────────────────────────── */

const MobileShowcase = ({ onGetStarted }) => {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-advance
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % MOBILE_STORIES.length;
        scrollTo(next);
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  // Detect swipe scroll and sync dots
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    if (idx !== active) {
      clearInterval(timerRef.current);
      setActive(idx);
      startTimer();
    }
  };

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setActive(idx);
    scrollTo(idx);
    startTimer();
  };

  return (
    <div className="mobile-showcase">
      {/* Brand bar */}
      <div className="msb-brand">
        <TrendingUp size={20} strokeWidth={2} />
        <span>Sohanix Wealth</span>
      </div>

      {/* Scroll-snap carousel track */}
      <div className="msb-track" ref={trackRef} onScroll={handleScroll}>
        {MOBILE_STORIES.map((story, idx) => {
          const Visual = VISUALS[story.visual];
          return (
            <div className="msb-card" key={story.id}>
              <div className="msb-card-label">{story.label}</div>
              <h2 className="msb-card-headline">
                {story.headline.split("\n").map((line, i) => (
                  <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                ))}
              </h2>
              {/* Visual preview */}
              <div className="msb-card-visual">
                {idx === active && <Visual />}
              </div>
              <p className="msb-card-subtext">{story.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Indicator dots */}
      <div className="msb-dots">
        {MOBILE_STORIES.map((_, idx) => (
          <button
            key={idx}
            className={`msb-dot ${idx === active ? "active" : ""}`}
            onClick={() => goTo(idx)}
            aria-label={`Story ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileShowcase;