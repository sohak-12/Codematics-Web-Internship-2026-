import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";

const categoryIcons = { "mens-fashion": "👔", "womens-fashion": "👗", makeup: "💄", skincare: "🧴", shoes: "👟", bags: "👜", jewelry: "💍", watches: "⌚", smartphones: "📱", earbuds: "🎧", laptops: "💻", cameras: "📷", "smart-tvs": "📺", speakers: "🔊", gaming: "🎮", "home-kitchen": "🏠", fitness: "🏋️", sunglasses: "🕶️", perfumes: "🌸", kids: "👶" };

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex gap-4 overflow-x-auto py-4">{Array(8).fill(null).map((_, i) => <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0"><div className="w-20 h-20 rounded-2xl animate-pulse" style={{ background: "var(--bg-elevated)" }} /><div className="w-14 h-3 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} /></div>)}</div>;

  return (
    <div className="flex gap-4 md:gap-6 overflow-x-auto py-4 scroll-smooth-custom stagger-animation">
      {categories.map((cat) => (
        <Link key={cat.id} to={`/category-items?category=${cat.name}`} className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-transparent flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1"
            style={{ background: "var(--bg-elevated)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 8px 25px var(--accent-glow)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span className="text-3xl">{categoryIcons[cat.name?.toLowerCase()] || "📦"}</span>
          </div>
          <span className="text-xs md:text-sm font-medium transition-colors capitalize text-center" style={{ color: "var(--text-secondary)" }}>{cat.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
