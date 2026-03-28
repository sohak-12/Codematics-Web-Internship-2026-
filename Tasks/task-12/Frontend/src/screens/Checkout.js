import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import { toast } from "react-toastify";
import { FiMapPin, FiPhone, FiUser, FiCreditCard, FiCheck } from "react-icons/fi";
import formatPrice from "../utilities/formatPrice";
import AppContext from "../provider";

const Checkout = () => {
  const user = useSelector((s) => s.account.user);
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", postalCode: "", notes: "" });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const cart = JSON.parse(localStorage.getItem("sohafy_cart") || "[]");
    if (cart.length === 0) { navigate("/basket"); return; }
    setCartItems(cart);
    setForm((p) => ({ ...p, name: user?.name || "" }));
  }, [user, navigate]);

  const total = cartItems.reduce((s, i) => s + (i.sellingPrice || i.price) * i.qty, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, COLLECTIONS.ORDERS), {
        userId: user.uid,
        userName: form.name,
        userEmail: user.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        notes: form.notes,
        products: cartItems.map((i) => ({ id: i.id, name: i.productName, price: i.sellingPrice || i.price, qty: i.qty, image: i.productImage?.[0] || "" })),
        totalPrice: total,
        status: "Pending",
        paymentMethod: "COD",
        createdAt: serverTimestamp(),
      });
      localStorage.removeItem("sohafy_cart");
      context?.fetchBasketCount();
      toast.success("Order placed successfully! 🎉");
      navigate("/order-success");
    } catch (err) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Checkout</h1>
      <div className="grid md:grid-cols-[1fr_350px] gap-6">
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}><FiMapPin style={{ color: "var(--accent)" }} /> Delivery Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field pl-10" placeholder="Your name" />
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Phone Number *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="phone" value={form.phone} onChange={handleChange} required className="input-field pl-10" placeholder="03XX XXXXXXX" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Address *</label>
              <input name="address" value={form.address} onChange={handleChange} required className="input-field" placeholder="House #, Street, Area" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>City *</label>
                <input name="city" value={form.city} onChange={handleChange} required className="input-field" placeholder="Karachi" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Postal Code</label>
                <input name="postalCode" value={form.postalCode} onChange={handleChange} className="input-field" placeholder="75000" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Order Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="input-field resize-none" placeholder="Any special instructions..." />
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <h3 className="font-bold flex items-center gap-2 mb-3" style={{ color: "var(--text-primary)" }}><FiCreditCard style={{ color: "var(--accent)" }} /> Payment Method</h3>
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ border: "2px solid var(--accent)", background: "var(--accent-soft)" }}>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "var(--accent)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Cash on Delivery (COD)</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Pay when you receive your order</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-center py-3.5 text-base flex items-center justify-center gap-2">
            {loading ? "Placing Order..." : <><FiCheck /> Place Order - {formatPrice(total)}</>}
          </button>
        </form>

        <div className="rounded-2xl p-5 h-fit sticky top-24 space-y-3" style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px)", border: "1px solid var(--divider)", boxShadow: "var(--shadow-lg)" }}>
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Order Summary</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl p-1 flex-shrink-0" style={{ background: "var(--bg-elevated)" }}>
                  <img src={item.productImage?.[0]} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.productName}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.qty} × {formatPrice(item.sellingPrice || item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 space-y-2 text-sm" style={{ borderTop: "1px solid var(--divider)" }}>
            <div className="flex justify-between" style={{ color: "var(--text-muted)" }}><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between" style={{ color: "var(--text-muted)" }}><span>Delivery</span><span className="font-medium" style={{ color: "#10b981" }}>Free</span></div>
            <div className="flex justify-between font-bold text-base pt-1" style={{ color: "var(--text-primary)", borderTop: "1px solid var(--divider)" }}><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
