import React, { useEffect, useState, useCallback, useMemo } from "react";
import Header from "../components/Header";
import { Plus, Download, Undo2, Redo2, Search, Filter } from "lucide-react";
import Modal from "../components/Modal";
import PremiumLoader from "../components/PremiumLoader";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TransactionAnalytics from "../components/TransactionAnalytics";
import { useTheme } from "../hooks/useTheme";
import { useCommandHistory } from "../hooks/useUndoRedo";
import useDebounce from "../hooks/useDebounce";
import * as api from "../utils/api";
import { useToast } from "../hooks/useToast";
import { formatCurrency, getCategoryLabel } from "../utils/helpers";
import "./Transactions.css";

const CATEGORIES = ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"];

const Transactions = () => {
  const { isDark, toggleTheme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("current-month");
  const [currentPage, setCurrentPage] = useState(1);

  const { push, undo, redo, canUndo, canRedo } = useCommandHistory();
  const toast = useToast();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchTransactions = useCallback(async () => {
    try {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();
      const filters = {};
      if (dateFilter === "current-month") {
        filters.startDate = new Date(Date.UTC(year, month, 1)).toISOString().split("T")[0];
        filters.endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59)).toISOString().split("T")[0];
      } else if (dateFilter === "last-3-months") {
        filters.startDate = new Date(Date.UTC(year, month - 2, 1)).toISOString().split("T")[0];
        filters.endDate = new Date(Date.UTC(year, month, now.getUTCDate(), 23, 59, 59)).toISOString().split("T")[0];
      }
      if (categoryFilter) filters.category = categoryFilter;
      const response = await api.getTransactions(filters);
      const data = response.data?.data || response.data || [];
      setTransactions(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (e) {
      toast.error("Failed to sync transactions");
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, categoryFilter, toast]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // ── Analytics computations ──────────────────────────────
  const { insights, dailyData, categoryData } = useMemo(() => {
    const total = transactions.reduce((s, t) => s + t.amount, 0);
    const count = transactions.length;
    const avg = count > 0 ? total / count : 0;

    // Top category
    const catMap = {};
    transactions.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

    const insights = [
      { label: "Total Spent",    value: formatCurrency(total),          color: "primary" },
      { label: "Transactions",   value: count,                          color: "" },
      { label: "Avg. Amount",    value: formatCurrency(avg),            color: "" },
      { label: "Top Category",   value: topCat ? getCategoryLabel(topCat[0]) : "—", color: "success" },
    ];

    // Daily data for area chart
    const dayMap = {};
    transactions.forEach(t => {
      const d = new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dayMap[d] = (dayMap[d] || 0) + t.amount;
    });
    const dailyData = Object.entries(dayMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Category data for bar chart
    const categoryData = Object.entries(catMap)
      .map(([cat, amount]) => ({
        category: getCategoryLabel(cat),
        rawCategory: cat,
        amount,
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { insights, dailyData, categoryData };
  }, [transactions]);

  // ── Filtered + paginated list ───────────────────────────
  const filtered = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    const matchesCat = categoryFilter ? t.category === categoryFilter : true;
    return matchesSearch && matchesCat;
  });
  const paginated = filtered.slice((currentPage - 1) * 20, currentPage * 20);

  const exportCSV = () => {
    if (!transactions.length) { toast.error("No transactions to export"); return; }
    const headers = ["Date", "Title", "Category", "Amount", "Notes"];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString("en-US"),
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.amount.toFixed(2),
      `"${(t.notes || "").replace(/"/g, '""')}"`
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const handleAction = async (command) => {
    try {
      await command.execute();
      push(command);
      fetchTransactions();
      toast.success(command.successMsg);
    } catch (e) {
      toast.error(command.errorMsg);
    }
  };

  return (
    <div className="transactions-page">
      <Header isDark={isDark} onToggleTheme={toggleTheme} title="Transactions" />
      <div className="transactions__container">
        {isLoading ? <PremiumLoader message="Syncing transactions..." /> : (
          <>
            {/* ── Transaction Insights ── */}
            <div className="transactions__header">
              <h2 className="section-title">Transaction Insights</h2>
            </div>
            <div className="transactions__summary-row">
              {insights.map((s, i) => (
                <div key={i} className="summary-card">
                  <span className="summary-card__label">{s.label}</span>
                  <span className={`summary-card__value ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* ── Transaction Variance (charts) ── */}
            <div className="transactions__analytics-container">
              <h2 className="section-title">Transaction Variance</h2>
              <TransactionAnalytics dailyData={dailyData} categoryData={categoryData} />
            </div>

            {/* ── Transaction Allocation (list) ── */}
            <div className="transactions__management">
              <div className="transactions__alloc-header">
                <h2 className="section-title">Transaction Allocation</h2>
                <div className="transactions__controls">
                  <div className="search-box">
                    <Search size={18} />
                    <input className="control-input" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="filter-group">
                    <Filter size={15} className="filter-icon" />
                    <select className="control-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                      <option value="">All Categories</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="filter-group">
                    <select className="control-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                      <option value="current-month">This Month</option>
                      <option value="last-3-months">Last 3 Months</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                  <button className="control-button" onClick={exportCSV} title="Export CSV"><Download size={18} /></button>
                  <button className="control-button primary" onClick={() => setShowAddModal(true)}><Plus size={18} /> Add</button>
                  <div className="history-controls">
                    <button className="control-button" onClick={undo} disabled={!canUndo} title="Undo"><Undo2 size={18} /></button>
                    <button className="control-button" onClick={redo} disabled={!canRedo} title="Redo"><Redo2 size={18} /></button>
                  </div>
                </div>
              </div>

              <TransactionList
                transactions={paginated}
                onEdit={setEditingTransaction}
                onDelete={(id) => handleAction({
                  execute: () => api.deleteTransaction(id),
                  undo: fetchTransactions,
                  redo: fetchTransactions,
                  successMsg: "Deleted",
                  errorMsg: "Failed"
                })}
                currentPage={currentPage}
                totalPages={Math.ceil(filtered.length / 20)}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      <Modal isOpen={showAddModal} title="Add Transaction" onClose={() => setShowAddModal(false)}>
        <TransactionForm onSubmit={(d) => handleAction({
          execute: () => api.createTransaction(d).then(() => setShowAddModal(false)),
          undo: fetchTransactions,
          redo: fetchTransactions,
          successMsg: "Saved",
          errorMsg: "Failed"
        })} categories={CATEGORIES} onCancel={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={!!editingTransaction} title="Edit Transaction" onClose={() => setEditingTransaction(null)}>
        {editingTransaction && (
          <TransactionForm initialData={editingTransaction} onSubmit={(d) => handleAction({
            execute: () => api.updateTransaction(editingTransaction._id, d).then(() => setEditingTransaction(null)),
            undo: fetchTransactions,
            redo: fetchTransactions,
            successMsg: "Updated",
            errorMsg: "Failed"
          })} categories={CATEGORIES} onCancel={() => setEditingTransaction(null)} />
        )}
      </Modal>
    </div>
  );
};

export default Transactions;
