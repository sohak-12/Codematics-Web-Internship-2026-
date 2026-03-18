// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to format date
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to get month-year string
export const getMonthYear = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Helper function to get month-year display string
export const formatMonthYear = (date = new Date()) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

// Category colors for consistency
export const categoryColors = {
  food: "#FF6B6B",
  transport: "#4ECDC4",
  entertainment: "#95E1D3",
  utilities: "#FFD93D",
  healthcare: "#FF6B9D",
  shopping: "#C44569",
  other: "#999999",
};

// Get category label
export const getCategoryLabel = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// ============================================
// Dashboard Analytics & Data Transformation
// ============================================

/**
 * Calculate daily spending for the given transactions
 * Returns array of { date, amount } suitable for line chart
 */
export const calculateDailySpending = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  const dailyMap = {};
  transactions.forEach((t) => {
    const date = new Date(t.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dailyMap[date] = (dailyMap[date] || 0) + t.amount;
  });

  return Object.entries(dailyMap)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Calculate category breakdown with spending trends
 * Returns array of { category, amount, percentage }
 */
export const calculateCategoryBreakdown = (transactions) => {
  if (!transactions || transactions.length === 0) return [];

  const categoryMap = {};
  let totalAmount = 0;

  transactions.forEach((t) => {
    const category = t.category.toLowerCase();
    categoryMap[category] = (categoryMap[category] || 0) + t.amount;
    totalAmount += t.amount;
  });

  return Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

/**
 * Calculate trend indicator (up/down/flat) between current and previous period
 */
export const calculateTrendIndicator = (current, previous) => {
  if (current === previous)
    return { direction: "flat", percentage: 0, arrow: "→" };
  const change = ((current - previous) / previous) * 100;
  const direction = change > 0 ? "up" : "down";
  const arrow = direction === "up" ? "↑" : "↓";
  return { direction, percentage: Math.abs(change).toFixed(1), arrow };
};

/**
 * Get average transaction amount
 */
export const getAverageTransactionValue = (transactions) => {
  if (!transactions || transactions.length === 0) return 0;
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return (total / transactions.length).toFixed(2);
};

/**
 * Get largest spending category
 */
export const getLargestCategory = (transactions) => {
  if (!transactions || transactions.length === 0)
    return { category: "N/A", amount: 0 };

  const breakdown = calculateCategoryBreakdown(transactions);
  return breakdown.length > 0 ? breakdown[0] : { category: "N/A", amount: 0 };
};

/**
 * Generate smart financial insights from transaction data
 */
export const generateFinancialInsights = (
  stats,
  transactions,
  isDarkTheme = false
) => {
  const insights = [];

  if (!transactions || transactions.length === 0) {
    return [
      {
        type: "info",
        message: "No transactions yet. Start tracking your spending!",
      },
    ];
  }

  const breakdown = calculateCategoryBreakdown(transactions);
  const largestCategory = breakdown[0];

  // Insight 1: Largest spending category
  if (largestCategory) {
    const percentage = largestCategory.percentage;
    insights.push({
      type: "category",
      message: `${getCategoryLabel(
        largestCategory.category
      )} is your largest expense (${percentage}% of spending).`,
      icon: "TrendingUp",
    });
  }

  // Insight 2: Average transaction value
  if (stats.totalTransactions > 0) {
    const avgValue = (stats.totalExpenses / stats.totalTransactions).toFixed(2);
    insights.push({
      type: "average",
      message: `Your average transaction is ${formatCurrency(avgValue)}.`,
      icon: "Zap",
    });
  }

  // Insight 3: Spending status
  if (stats.totalTransactions > 5) {
    insights.push({
      type: "activity",
      message: `You've made ${stats.totalTransactions} transactions this month.`,
      icon: "Activity",
    });
  }

  // Insight 4: Budget alert (if applicable)
  if (breakdown.length > 0 && largestCategory.percentage > 40) {
    insights.push({
      type: "alert",
      message: `${getCategoryLabel(largestCategory.category)} accounts for ${
        largestCategory.percentage
      }% of your spending. Consider setting a budget!`,
      icon: "AlertCircle",
    });
  }

  return insights.slice(0, 4);
};

/**
 * Calculate spending change compared to previous period
 */
export const calculateSpendingChange = (
  currentTransactions,
  previousTransactions
) => {
  const current = currentTransactions.reduce((sum, t) => sum + t.amount, 0);
  const previous = previousTransactions.reduce((sum, t) => sum + t.amount, 0);
  return calculateTrendIndicator(current, previous);
};