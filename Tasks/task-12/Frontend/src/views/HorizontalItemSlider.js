import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import loadCategoryItems from "../utilities/loadCategoryItems";
import formatPrice from "../utilities/formatPrice";
import basketHelper from "../utilities/basketHelper";
import AppContext from "../provider";

const HorizontalItemSlider = ({ category, heading }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const context = useContext(AppContext);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await loadCategoryItems(category);
      setItems(data?.data || []);
      setLoading(false);
    };
    fetchItems();
  }, [category]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const handleAddToBasket = async (e, id) => {
    await basketHelper(e, id, context?.openAuthGate);
    context?.fetchBasketCount();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} />
        <div className="flex gap-4 overflow-hidden">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="min-w-[260px] h-[320px] rounded-2xl animate-pulse" style={{ background: "var(--bg-elevated)" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{heading}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)", color: "var(--text-secondary)" }}>
            <FiChevronLeft />
          </button>
          <button onClick={() => scroll("right")} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)", color: "var(--text-secondary)" }}>
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth-custom pb-2">
        {items.map((item) => (
          <Link
            key={item._id}
            to={`/item/${item._id}`}
            className="min-w-[240px] md:min-w-[270px] rounded-2xl overflow-hidden card-hover card-shine group"
            style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}
          >
            <div className="h-44 p-4 flex items-center justify-center relative overflow-hidden" style={{ background: "var(--gradient-card)" }}>
              <img src={item?.productImage?.[0]} alt={item?.productName} className="h-full w-full object-cover product-image-zoom" loading="lazy" />
              {item?.price !== item?.sellingPrice && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                  {Math.round(((item.price - item.sellingPrice) / item.price) * 100)}% OFF
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>{item?.brandName}</p>
              <h3 className="text-sm font-semibold line-clamp-1 transition-colors" style={{ color: "var(--text-primary)" }}>
                {item?.productName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{formatPrice(item?.sellingPrice)}</span>
                {item?.price !== item?.sellingPrice && (
                  <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>{formatPrice(item?.price)}</span>
                )}
              </div>
              <button
                onClick={(e) => handleAddToBasket(e, item?._id)}
                className="w-full mt-1 flex items-center justify-center gap-2 text-white py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: "var(--gradient-accent)" }}
              >
                <FiShoppingCart className="text-sm" /> Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HorizontalItemSlider;
