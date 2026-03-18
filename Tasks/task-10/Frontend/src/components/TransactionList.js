import React from "react";
import { Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate, getCategoryLabel } from "../utils/helpers";
import "./TransactionList.css";

const TransactionList = ({
  transactions = [],
  onEdit,
  onDelete,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (isLoading) {
    return <div className="transaction-list__loading">Fetching your data...</div>;
  }

  if (transactions.length === 0) {
    return <div className="transaction-list__empty">No transactions found.</div>;
  }

  return (
    <div className="transaction-list">
      {/* Desktop Table View */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="transaction-row">
              <td className="date-cell">{formatDate(t.date)}</td>
              <td>
                <div className="transaction-title">{t.title}</div>
                {t.notes && <div className="transaction-notes">{t.notes}</div>}
              </td>
              <td>
                <span className="category-badge">{getCategoryLabel(t.category)}</span>
              </td>
              <td className="amount-cell">{formatCurrency(t.amount)}</td>
              <td className="actions-cell">
                <button className="action-btn" onClick={() => onEdit(t)} aria-label="Edit">
                  <Edit2 size={16} />
                </button>
                <button className="action-btn delete-btn" onClick={() => onDelete(t._id)} aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="transaction-cards">
        {transactions.map((t) => (
          <div key={t._id} className="transaction-card">
            <div className="transaction-card__top">
              <div>
                <div className="transaction-title">{t.title}</div>
                <div className="date-cell">{formatDate(t.date)}</div>
              </div>
              <div className="amount-cell">{formatCurrency(t.amount)}</div>
            </div>
            <div className="transaction-card__bottom">
              <span className="category-badge">{getCategoryLabel(t.category)}</span>
              <div className="actions-cell">
                <button className="action-btn" onClick={() => onEdit(t)}><Edit2 size={16} /></button>
                <button className="action-btn delete-btn" onClick={() => onDelete(t._id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft size={16} />
          </button>
          <span className="pagination-info">Page {currentPage} of {totalPages}</span>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;