import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import loadCategoryItems from "../utilities/loadCategoryItems";
import formatPrice from "../utilities/formatPrice";
import basketHelper from "../utilities/basketHelper";
import AppContext from "../provider";

const CategoryItemDisplay = ({ category, heading }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(AppContext);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await loadCategoryItems(category);
      setItems(data?.data || []);
      setLoading(false);
    };
    fetchItems();
  }, [category]);

  const handleAddToBasket = async (e, id) => {
    await basketHelper(e, id, context?.openAuthGate);
    context?.fetchBasketCount();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="h-[300px] rounded-2xl animate-pulse" style={{ background: "var(--bg-elevated)" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{heading}</h2>
        <Link to={`/category-items?category=${category}`} className="flex items-center gap-1 text-sm font-semibold transition-colors" style={{ color: "var(--accent)" }}>
          View All <FiArrowRight />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-animation">
        {items.slice(0, 4).map((item) => (
          <Link key={item._id} to={`/item/${item._id}`} className="rounded-2xl overflow-hidden card-hover card-shine group" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <div className="h-40 p-4 flex items-center justify-center relative overflow-hidden" style={{ background: "var(--gradient-card)" }}>
              <img src={item?.productImage?.[0]} alt={item?.productName} className="h-full w-full object-cover product-image-zoom" loading="lazy" />
            </div>
            <div className="p-3 space-y-1.5">
              <h3 className="text-sm font-semibold line-clamp-1" style={{ color: "var(--text-primary)" }}>{item?.productName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{formatPrice(item?.sellingPrice)}</span>
              </div>
              <button onClick={(e) => handleAddToBasket(e, item?._id)} className="w-full flex items-center justify-center gap-1.5 text-white py-2 rounded-xl text-xs font-semibold transition-all active:scale-95" style={{ background: "var(--gradient-accent)" }}>
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryItemDisplay;
