import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import { FiShoppingCart, FiStar, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import formatPrice from "../utilities/formatPrice";
import basketHelper from "../utilities/basketHelper";
import AppContext from "../provider";
import CategoryItemDisplay from "../views/CategoryItemDisplay";

const ItemOverview = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const fetchItem = useCallback(async () => {
    setLoading(true);
    const snap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    if (snap.exists()) setItem({ _id: snap.id, id: snap.id, ...snap.data() });
    setActiveImage(0);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchItem(); window.scrollTo({ top: 0, behavior: "smooth" }); }, [fetchItem]);

  const handleAddToBasket = (e) => { basketHelper(e, item, context?.openAuthGate); context?.fetchBasketCount(); };
  const handleBuyNow = (e) => {
    e?.stopPropagation(); e?.preventDefault();
    if (!auth.currentUser) { context?.openAuthGate?.(); return; }
    const buyItem = [{ id: item._id || item.id, productName: item.productName, brandName: item.brandName, category: item.category, productImage: item.productImage, price: item.price, sellingPrice: item.sellingPrice, qty: 1 }];
    localStorage.setItem("sohafy_cart", JSON.stringify(buyItem));
    context?.fetchBasketCount();
    navigate("/checkout");
  };

  const handleZoom = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(1.8)" });
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="h-[400px] bg-slate-100 rounded-3xl" />
        <div className="space-y-4"><div className="h-6 w-24 bg-slate-100 rounded" /><div className="h-8 w-3/4 bg-slate-100 rounded" /><div className="h-10 w-40 bg-slate-100 rounded" /></div>
      </div>
    );
  }

  if (!item) return <div className="text-center py-20 text-slate-500">Product not found</div>;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="h-[350px] md:h-[450px] rounded-3xl flex items-center justify-center p-8 overflow-hidden cursor-crosshair" style={{ background: "var(--gradient-card)", border: "1px solid var(--divider)" }} onMouseMove={handleZoom} onMouseLeave={() => setZoomStyle({})}>
            <img src={item?.productImage?.[activeImage]} alt={item?.productName} className="max-h-full object-contain transition-transform duration-200" style={zoomStyle} />
          </div>
          <div className="flex gap-2 overflow-x-auto scroll-smooth-custom">
            {item?.productImage?.map((img, idx) => (
              <button key={idx} onClick={() => setActiveImage(idx)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all p-1`} style={{ border: idx === activeImage ? "2px solid var(--accent)" : "2px solid var(--divider)", boxShadow: idx === activeImage ? "0 4px 15px var(--accent-glow)" : "none" }}>
                <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>{item?.brandName}</span>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>{item?.productName}</h1>
          <p className="text-sm capitalize" style={{ color: "var(--text-muted)" }}>{item?.category}</p>
          <div className="flex items-center gap-1 text-amber-400">
            {Array(5).fill(null).map((_, i) => <FiStar key={i} className="fill-current" />)}
            <span className="text-sm text-slate-400 ml-2">(128 reviews)</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black" style={{ color: "var(--text-primary)" }}>{formatPrice(item?.sellingPrice)}</span>
            {item?.price !== item?.sellingPrice && (
              <>
                <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>{formatPrice(item?.price)}</span>
                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">
                  Save {Math.round(((item.price - item.sellingPrice) / item.price) * 100)}%
                </span>
              </>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddToBasket} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-base"><FiShoppingCart /> Add to Cart</button>
            <button onClick={handleBuyNow} className="btn-secondary flex-1 py-3.5 text-base text-center">Buy Now</button>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[{ icon: FiTruck, label: "Free Delivery" }, { icon: FiShield, label: "1 Year Warranty" }, { icon: FiRefreshCw, label: "7 Day Return" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center" style={{ background: "var(--bg-elevated)" }}>
                <Icon style={{ color: "var(--accent)" }} /><span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{label}</span>
              </div>
            ))}
          </div>
          {item?.description && <div className="pt-4"><h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>Description</h3><p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.description}</p></div>}
        </div>
      </div>
      {item?.category && <CategoryItemDisplay category={item.category} heading="You May Also Like" />}
    </div>
  );
};

export default ItemOverview;
