/**
 * Advanced UTC Date Utilities
 * Optimized for Consistency, Precision, and Testability.
 */

// Helper to normalize dates to start of day
const normalizeToUTC = (date = new Date()) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

/**
 * Parses date string with strict validation
 */
const parseUTCDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error("Invalid Date format provided");
  return date;
};

/**
 * Professional Month Boundary Generator
 * Logic: Uses Date.UTC directly for atomic boundary calculation.
 */
const getUTCMonthBounds = (year = new Date().getUTCFullYear(), month = new Date().getUTCMonth() + 1) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return { start, end };
};

/**
 * Returns current day boundary
 */
const getUTCDayBounds = (daysAgo = 0) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
};

module.exports = {
  parseUTCDate,
  getUTCMonthBounds, // Returns both start/end in one object
  getUTCDayBounds,   // Returns both start/end in one object
  toUTCDateString: (date) => date.toISOString().split("T")[0],
  getUTCMonthString: (date = new Date()) => 
    `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
};