import React, { useState, useCallback } from "react";
import "./TransactionForm.css";

const TransactionForm = ({
  onSubmit,
  initialData = null,
  categories = ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"],
  onCancel,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      amount: "",
      category: categories[0],
      date: new Date().toISOString().split("T")[0],
      notes: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useCallback to avoid unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }, [errors]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (new Date(formData.date) > new Date()) newErrors.date = "Future dates not allowed";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, amount: parseFloat(formData.amount) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="title">Title / Description</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Grocery shopping"
          className={errors.title ? "input-error" : ""}
          disabled={isSubmitting}
          aria-invalid={!!errors.title}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={errors.amount ? "input-error" : ""}
            disabled={isSubmitting}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} disabled={isSubmitting}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : (initialData ? "Update Record" : "Add Transaction")}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;