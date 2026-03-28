import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import formatPrice from "../utilities/formatPrice";
import AppContext from "../provider";

const Basket = () => {
  const [items, setItems] = useState([]);
  const context = useContext(AppContext);
  const user = useSelector((s) => s.account.user);
  const navigate = useNavigate();

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("sohafy_cart") || "[]");
    setItems(cart);
  };

  useEffect(() => { loadCart(); }, []);

  const updateCart = (updated) => {
    localStorage.setItem("sohafy_cart", JSON.stringify(updated));
    setItems(updated);
    context?.fetchBasketCount();
  };

  const updateQty = (idx, delta) => {
    const updated = [...items];
    updated[idx].qty = Math.max(1, updated[idx].qty + delta);
    updateCart(updated);
  };

  const removeItem = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    updateCart(updated);
    toast.success("Removed from cart");
  };

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + (i.sellingPrice || i.price) * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--accent-soft)" }}><FiShoppingBag className="text-4xl" style={{ color: "var(--accent)" }} /></div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Your cart is empty</h2>
        <p className="mb-6" style={{ color: "var(--text-muted)" }}>Looks like you haven't added anything yet</p>
        <Link to="/" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) { toast.error("Please login to place an order"); navigate("/login"); return; }
    navigate("/checkout");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Shopping Cart ({totalQty} items)</h1>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4 rounded-2xl p-4 card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <Link to={`/item/${item.id}`} className="flex-shrink-0 w-28 h-28 rounded-xl p-2 flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
              <img src={item.productImage?.[0]} alt="" className="h-full w-full object-cover rounded-lg" />
            </Link>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold line-clamp-1" style={{ color: "var(--text-primary)" }}>{item.productName}</h3>
              <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{item.category}</p>
              <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{formatPrice(item.sellingPrice || item.price)}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(idx, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ border: "1px solid var(--divider)", color: "var(--text-secondary)" }}><FiMinus className="text-xs" /></button>
                  <span className="w-10 text-center font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.qty}</span>
                  <button onClick={() => updateQty(idx, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ border: "1px solid var(--divider)", color: "var(--text-secondary)" }}><FiPlus className="text-xs" /></button>
                </div>
                <button onClick={() => removeItem(idx)} className="p-2 rounded-lg transition-all" style={{ color: "var(--text-muted)" }}><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="rounded-3xl p-6 space-y-4 sticky top-24" style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px)", border: "1px solid var(--divider)", boxShadow: "var(--shadow-lg)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between" style={{ color: "var(--text-muted)" }}><span>Subtotal ({totalQty} items)</span><span>{formatPrice(totalPrice)}</span></div>
            <div className="flex justify-between" style={{ color: "var(--text-muted)" }}><span>Delivery</span><span className="font-medium" style={{ color: "#10b981" }}>Free</span></div>
            <div className="pt-3 flex justify-between" style={{ borderTop: "1px solid var(--divider)" }}><span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Total</span><span className="font-black text-xl" style={{ color: "var(--text-primary)" }}>{formatPrice(totalPrice)}</span></div>
          </div>
          <button onClick={handleCheckout} className="btn-secondary w-full text-center py-3 flex items-center justify-center gap-2 text-base">
            Proceed to Checkout <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Basket;
