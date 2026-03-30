import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiTruck, FiStar, FiHeart, FiPercent, FiShield } from "react-icons/fi";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";

const formatPrice = (n) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0 }).format(n);

const CATEGORIES = [
  { name: "Fashion", emoji: "👗" },
  { name: "Electronics", emoji: "📱" },
  { name: "Beauty", emoji: "💄" },
  { name: "Shoes", emoji: "👟" },
  { name: "Watches", emoji: "⌚" },
  { name: "Bags", emoji: "👜" },
];

const FEATURES = [
  { icon: <FiTruck size={14} />, text: "Free COD Delivery" },
  { icon: <FiShield size={14} />, text: "Secure Payments" },
  { icon: <FiPercent size={14} />, text: "Daily Deals" },
  { icon: <FiStar size={14} />, text: "Top Brands" },
];

const AuthShowcase = () => {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  // Fetch real products from Firestore
  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, COLLECTIONS.PRODUCTS), limit(8));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (items.length > 0) setProducts(items);
      } catch (e) {
        console.log("Showcase: no products yet");
      }
    };
    fetch();
  }, []);

  const goTo = useCallback((idx) => { setActive(idx); setProgressKey((k) => k + 1); }, []);

  // Auto-advance
  useEffect(() => {
    if (products.length === 0) return;
    const t = setInterval(() => {
      setActive((p) => { const n = (p + 1) % products.length; setProgressKey((k) => k + 1); return n; });
    }, 4000);
    return () => clearInterval(t);
  }, [products]);

  // If no products yet, show placeholder
  if (products.length === 0) {
    return (
      <div className="sf-showcase">
        <div className="sf-empty">
          <FiShoppingBag size={40} style={{ color: "#a855f7", marginBottom: 12 }} />
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Loading store products...</p>
        </div>
        <div className="sf-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="sf-feature">
              <span className="sf-feature-icon">{f.icon}</span>
              <span className="sf-feature-text">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const p = products[active];
  const discount = p?.price && p?.sellingPrice && p.price !== p.sellingPrice
    ? Math.round(((p.price - p.sellingPrice) / p.price) * 100) : 0;

  return (
    <div className="sf-showcase">
      {/* ═══ HERO PRODUCT ═══ */}
      <div className="sf-hero-product">
        <AnimatePresence mode="wait">
          <motion.div key={active} className="sf-product-spotlight"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -15 }}
            transition={{ duration: 0.45, ease: "backOut" }}>

            <div className="sf-img-wrap">
              <div className="sf-img-glow" />
              <img src={p?.productImage?.[0]} alt={p?.productName} className="sf-product-img" />
              {discount > 0 && <div className="sf-discount-tag">{discount}% OFF</div>}
              <motion.button className="sf-heart-btn" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <FiHeart size={14} />
              </motion.button>
            </div>

            <div className="sf-product-info">
              {p?.brandName && <span className="sf-product-brand">{p.brandName}</span>}
              <span className="sf-product-cat">{p?.category}</span>
              <h3 className="sf-product-name">{p?.productName}</h3>
              <div className="sf-product-meta">
                <span className="sf-product-price">{formatPrice(p?.sellingPrice)}</span>
                {discount > 0 && <span className="sf-product-old">{formatPrice(p?.price)}</span>}
              </div>
              <motion.button className="sf-add-cart" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiShoppingBag size={13} /> Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ THUMBNAILS ═══ */}
      <div className="sf-thumb-row">
        {products.map((pr, i) => (
          <motion.div key={pr.id} className={`sf-thumb ${i === active ? "active" : ""}`}
            onClick={() => goTo(i)} whileHover={{ y: -4, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <img src={pr?.productImage?.[0]} alt={pr?.productName} />
          </motion.div>
        ))}
      </div>

      {/* Progress */}
      <div className="sf-progress-row" key={progressKey}>
        {products.map((_, i) => (
          <div key={i} className={`sf-progress ${i === active ? "active" : ""} ${i < active ? "done" : ""}`} onClick={() => goTo(i)}>
            <div className="sf-progress-fill" />
          </div>
        ))}
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <div className="sf-cat-strip">
        {CATEGORIES.map((c, i) => (
          <motion.div key={i} className="sf-cat-chip" whileHover={{ scale: 1.08, y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
            <span className="sf-cat-emoji">{c.emoji}</span>
            <span className="sf-cat-name">{c.name}</span>
          </motion.div>
        ))}
      </div>

      {/* ═══ FEATURES ═══ */}
      <div className="sf-features">
        {FEATURES.map((f, i) => (
          <motion.div key={i} className="sf-feature" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
            <span className="sf-feature-icon">{f.icon}</span>
            <span className="sf-feature-text">{f.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AuthShowcase;
