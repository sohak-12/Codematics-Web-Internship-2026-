import React, { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Header from "../components/Header";
import Modal from "../components/Modal";
import PremiumLoader from "../components/PremiumLoader";
import BudgetForm from "../components/BudgetForm";
import BudgetCard from "../components/BudgetCard";
import BudgetAnalytics from "../components/BudgetAnalytics";
import { useTheme } from "../hooks/useTheme";
import * as api from "../utils/api";
import { useToast } from "../hooks/useToast";
import { formatCurrency, getCategoryLabel } from "../utils/helpers";
import "./Budgets.css";

const CATEGORIES = ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"];

const Budgets = () => {
  const { isDark, toggleTheme } = useTheme();
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Default true for initial load
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Analytics state
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [velocityData, setVelocityData] = useState([]);
  const [varianceData, setVarianceData] = useState([]);
  const [totals, setTotals] = useState({ budget: 0, spent: 0 });
  
  const toast = useToast();
  const categories = CATEGORIES;

  const fetchData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();

      const [budgetsRes, txRes] = await Promise.all([
        api.getBudgets(),
        api.getTransactions({
          startDate: new Date(Date.UTC(year, month, 1)).toISOString().split("T")[0],
          endDate: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)).toISOString().split("T")[0],
        })
      ]);

      const budgetList = Array.isArray(budgetsRes.data?.data) ? budgetsRes.data.data
        : Array.isArray(budgetsRes.data) ? budgetsRes.data : [];
      const txList = Array.isArray(txRes.data?.data) ? txRes.data.data
        : Array.isArray(txRes.data) ? txRes.data : [];

      setBudgets(budgetList);

      const breakdown = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
      txList.forEach((t) => { if (breakdown.hasOwnProperty(t.category)) breakdown[t.category] += t.amount; });
      setCategoryBreakdown(breakdown);

      // Advanced Analytics
      const daysInMonth = new Date(year, month + 1, 0).getUTCDate();
      const totalBudgetLimit = budgetList.reduce((acc, b) => acc + b.monthlyLimit, 0);
      const dailyIdeal = totalBudgetLimit / daysInMonth;

      const velocity = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        actual: null,
        ideal: Math.round(dailyIdeal * (i + 1))
      }));

      txList.forEach(t => {
        const d = new Date(t.date).getUTCDate();
        if (velocity[d - 1]) velocity[d - 1].actual = (velocity[d - 1].actual || 0) + t.amount;
      });

      let runningTotal = 0;
      velocity.forEach(v => {
        runningTotal += (v.actual || 0);
        v.actual = runningTotal;
      });

      setVelocityData(velocity);
      setVarianceData(budgetList.map(b => ({
        category: getCategoryLabel(b.category),
        budget: b.monthlyLimit,
        actual: breakdown[b.category] || 0
      })));

      setTotals({
        budget: totalBudgetLimit,
        spent: Object.values(breakdown).reduce((a, val) => a + val, 0)
      });
    } catch (error) {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (actionFn, successMsg, errorMsg) => {
    try {
      await actionFn();
      await fetchData(false);
      toast.success(successMsg);
    } catch (e) {
      const msg = e?.response?.data?.message || errorMsg;
      toast.error(msg);
    }
  };

  return (
    <div className="budgets">
      <Header isDark={isDark} onToggleTheme={toggleTheme} title="Budgets" />
      <div className="budgets__container">
        <div className="budgets__header">
          <h2 className="section-title">Budget Management</h2>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Budget
          </button>
        </div>

        {isLoading ? <PremiumLoader message="Syncing financial data..." /> : (
          <>
            <div className="budgets__summary-row">
              {[
                { label: "Total Budget", val: formatCurrency(totals.budget), color: "primary" },
                { label: "Total Spent", val: formatCurrency(totals.spent), color: totals.spent > totals.budget ? 'danger' : '' },
                { label: "Utilization", val: `${totals.budget > 0 ? Math.round((totals.spent / totals.budget) * 100) : 0}%`, color: "" },
                { label: "Remaining", val: formatCurrency(Math.max(totals.budget - totals.spent, 0)), color: "success" },
              ].map((stat, i) => (
                <div key={i} className="summary-card">
                  <span className="summary-card__label">{stat.label}</span>
                  <span className={`summary-card__value ${stat.color}`}>{stat.val}</span>
                </div>
              ))}
            </div>

            <div className="budgets__analytics-container">
               <h2 className="section-title">Budget Insights</h2>
               <BudgetAnalytics velocityData={velocityData} varianceData={varianceData} />
            </div>

            <div className="budgets__management">
              <h2 className="section-title">Budget Allocation</h2>
              <div className="budgets__grid">
                {budgets.length === 0 ? <div className="empty-state">No budgets set yet.</div> :
                  budgets.map((budget) => (
                    <BudgetCard key={budget._id} category={budget.category} budget={budget}
                      spent={categoryBreakdown[budget.category] || 0}
                      onEdit={() => setEditingCategory(budget.category)}
                      onDelete={() => handleAction(() => api.deleteBudget(budget._id), "Budget deleted", "Delete failed")}
                    />
                  ))
                }
              </div>
            </div>
          </>
        )}
      </div>

      <Modal isOpen={showAddModal} title="Add Budget" onClose={() => setShowAddModal(false)}>
        <BudgetForm
          onSubmit={(d) => handleAction(() => api.createBudget(d).then(() => setShowAddModal(false)), "Budget created!", "Failed to create budget")}
          categories={categories}
          usedCategories={budgets.map(b => b.category)}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal isOpen={!!editingCategory} title="Edit Budget" onClose={() => setEditingCategory(null)}>
        {editingCategory && (
          <BudgetForm initialData={{ category: editingCategory, monthlyLimit: budgets.find(b => b.category === editingCategory)?.monthlyLimit }}
            onSubmit={(d) => handleAction(() => api.updateBudget(budgets.find(b => b.category === editingCategory)._id, d).then(() => setEditingCategory(null)), "Updated!", "Update failed")}
            categories={categories} onCancel={() => setEditingCategory(null)} />
        )}
      </Modal>
    </div>
  );
};

export default Budgets;