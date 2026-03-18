import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import PremiumLoader from "../components/PremiumLoader";
import FinancialOverview from "../components/FinancialOverview";
import SpendingTrendChart from "../components/SpendingTrendChart";
import CategoryAnalysis from "../components/CategoryAnalysis";
import { useTheme } from "../hooks/useTheme";
import * as api from "../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();
      const filters = {
        startDate: new Date(Date.UTC(year, month, 1)).toISOString().split("T")[0],
        endDate: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59)).toISOString().split("T")[0],
      };
      const response = await api.getTransactions(filters);
      const data = response.data?.data || response.data || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  return (
    <div className="dashboard">
      <Header isDark={isDark} onToggleTheme={toggleTheme} title="Wealth Analysis" />
      <div className="dashboard__container">
        {isLoading ? <PremiumLoader message="Syncing workspace..." /> : (
          <>
            <FinancialOverview transactions={transactions} />
            <div className="analytics-grid">
              <SpendingTrendChart transactions={transactions} />
              <CategoryAnalysis transactions={transactions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
