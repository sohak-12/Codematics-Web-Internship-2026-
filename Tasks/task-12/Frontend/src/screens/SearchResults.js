import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import { FiSearch } from "react-icons/fi";
import VerticalItemCard from "../views/VerticalItemCard";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get("q") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
      const all = snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
      const filtered = q ? all.filter((i) =>
        i.productName?.toLowerCase().includes(q.toLowerCase()) ||
        i.category?.toLowerCase().includes(q.toLowerCase()) ||
        i.brandName?.toLowerCase().includes(q.toLowerCase())
      ) : all;
      setItems(filtered);
      setLoading(false);
    };
    fetchResults();
  }, [q]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{q ? `Results for "${q}"` : "All Products"}</h1>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{items.length} products found</span>
      </div>
      {!loading && items.length === 0 && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--bg-elevated)" }}><FiSearch className="text-3xl" style={{ color: "var(--text-muted)" }} /></div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>No results found</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try searching with different keywords</p>
        </div>
      )}
      <VerticalItemCard items={items} loading={loading} />
    </div>
  );
};

export default SearchResults;
