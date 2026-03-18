import React, { useState } from "react";
import { Loader2, Save, X } from "lucide-react"; // Icons add kiye
import "./BudgetForm.css";

const BudgetForm = ({ onSubmit, initialData = null, categories = ["food", "transport", "entertainment", "utilities", "healthcare", "shopping", "other"], usedCategories = [], onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || { category: categories.find(c => !usedCategories.includes(c)) || categories[0], monthlyLimit: "" }
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.monthlyLimit || formData.monthlyLimit <= 0) 
        newErrors.monthlyLimit = "Enter a valid amount greater than 0";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    await onSubmit({ ...formData, monthlyLimit: parseFloat(formData.monthlyLimit) });
    setIsSubmitting(false);
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit} lang="en">
      <div className="form-group">
        <label htmlFor="budget-category">Category</label>
        <select id="budget-category" name="category" value={formData.category} onChange={handleChange} disabled={!!initialData}>
          {categories.map((cat) => (
            <option key={cat} value={cat} disabled={!initialData && usedCategories.includes(cat)}>
              {cat.toUpperCase()}{!initialData && usedCategories.includes(cat) ? " (set)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="budget-monthlyLimit">Monthly Budget Limit</label>
        <div className="input-wrapper">
          <input
            id="budget-monthlyLimit"
            type="number"
            name="monthlyLimit"
            value={formData.monthlyLimit}
            onChange={handleChange}
            placeholder="e.g. 500.00"
            className={errors.monthlyLimit ? "input-error" : ""}
          />
        </div>
        {errors.monthlyLimit && <span className="error-message">{errors.monthlyLimit}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <X size={18} /> Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 size={18} className="animate-spin" /> Processing...</>
          ) : (
            <><Save size={18} /> {initialData ? "Update Budget" : "Save Budget"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;