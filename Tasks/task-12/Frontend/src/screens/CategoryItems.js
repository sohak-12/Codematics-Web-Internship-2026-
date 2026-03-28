import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import VerticalItemCard from "../views/VerticalItemCard";

const CategoryItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryList = urlSearch.getAll("category");

  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(urlCategoryList);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [prodSnap, catSnap] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.PRODUCTS)),
        getDocs(collection(db, COLLECTIONS.CATEGORIES)),
      ]);
      setAllItems(prodSnap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() })));
      setCategories(catSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCategoryChange = (value) => {
    const updated = selectedCategories.includes(value)
      ? selectedCategories.filter((c) => c !== value)
      : [...selectedCategories, value];
    setSelectedCategories(updated);
    navigate(`/category-items?${updated.map((c) => `category=${c}`).join("&")}`);
  };

  const filtered = selectedCategories.length > 0
    ? allItems.filter((i) => selectedCategories.includes(i.category))
    : allItems;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "asc") return (a.sellingPrice || a.price) - (b.sellingPrice || b.price);
    if (sortBy === "desc") return (b.sellingPrice || b.price) - (a.sellingPrice || a.price);
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 animate-fade-in">
      <div className="rounded-2xl p-5 h-fit sticky top-24 space-y-4" style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px)", border: "1px solid var(--divider)", boxShadow: "var(--shadow-md)" }}>
        <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Filters</h3>
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Sort by Price</h4>
          <div className="space-y-2">
            {[{ label: "Low to High", value: "asc" }, { label: "High to Low", value: "desc" }].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                <input type="radio" name="sort" checked={sortBy === opt.value} onChange={() => setSortBy(opt.value)} className="accent-purple-600" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Categories</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer transition-colors" style={{ color: "var(--text-secondary)" }}>
                <input type="checkbox" checked={selectedCategories.includes(cat.name)} onChange={() => handleCategoryChange(cat.name)} className="accent-purple-600 rounded" />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Products</h1>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>{sorted.length} results</span>
        </div>
        <VerticalItemCard items={sorted} loading={loading} />
      </div>
    </div>
  );
};

export default CategoryItems;
