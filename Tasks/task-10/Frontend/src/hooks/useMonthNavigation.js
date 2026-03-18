import { useState, useCallback, useMemo } from "react";

export const useMonthNavigation = (initialMonth = null) => {
  // Memoized current month string to avoid recalculating on every render
  const defaultMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(initialMonth || defaultMonth);

  // Helper: Safely calculate year/month offsets
  const navigateBy = useCallback((offset) => {
    setSelectedMonth((curr) => {
      const [year, month] = curr.split("-").map(Number);
      const date = new Date(year, month - 1 + offset);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });
  }, []);

  const previousMonth = () => navigateBy(-1);
  const nextMonth = () => navigateBy(1);
  const goToCurrentMonth = () => setSelectedMonth(defaultMonth);

  // Memoized display value
  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [selectedMonth]);

  return {
    selectedMonth,
    monthLabel, // Use this for UI instead of calling a function
    isCurrentMonth: selectedMonth === defaultMonth,
    previousMonth,
    nextMonth,
    goToCurrentMonth,
    setMonth: setSelectedMonth,
  };
};