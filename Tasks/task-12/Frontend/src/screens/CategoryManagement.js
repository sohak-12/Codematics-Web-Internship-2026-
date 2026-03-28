import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2, FiTag } from "react-icons/fi";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchCategories(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    await addDoc(collection(db, COLLECTIONS.CATEGORIES), { name: newCat.trim(), createdAt: serverTimestamp() });
    toast.success("Category added!");
    setNewCat("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
    toast.success("Category deleted");
    fetchCategories();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Categories ({categories.length})</h2>

      <form onSubmit={addCategory} className="flex gap-3">
        <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category name..." className="input-field flex-1" />
        <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap"><FiPlus /> Add</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-xl p-4 card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-soft)" }}><FiTag style={{ color: "var(--accent)" }} /></div>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{cat.name}</span>
            </div>
            <button onClick={() => deleteCategory(cat.id)} className="p-2 rounded-lg transition-all" style={{ color: "var(--text-muted)" }}><FiTrash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
