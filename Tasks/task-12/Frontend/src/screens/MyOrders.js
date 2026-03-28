import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import formatPrice from "../utilities/formatPrice";
import { FiPackage, FiClock, FiTruck, FiCheckCircle } from "react-icons/fi";

const statusConfig = {
  Pending: { color: "bg-amber-100 text-amber-700", icon: FiClock },
  Processing: { color: "bg-blue-100 text-blue-700", icon: FiTruck },
  Delivered: { color: "bg-green-100 text-green-700", icon: FiCheckCircle },
};

const MyOrders = () => {
  const user = useSelector((s) => s.account.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchOrders = async () => {
      const q = query(collection(db, COLLECTIONS.ORDERS), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) return <div className="space-y-4">{Array(3).fill(null).map((_, i) => <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "var(--bg-elevated)" }} />)}</div>;

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--accent-soft)" }}><FiPackage className="text-4xl" style={{ color: "var(--accent)" }} /></div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No orders yet</h2>
        <p style={{ color: "var(--text-muted)" }}>Start shopping to see your orders here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>My Orders ({orders.length})</h1>
      {orders.map((order) => {
        const StatusIcon = statusConfig[order.status]?.icon || FiClock;
        return (
          <div key={order.id} className="rounded-2xl p-5 card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${statusConfig[order.status]?.color || ""}`}>
                <StatusIcon size={12} /> {order.status}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto mb-3">
              {order.products?.map((p, i) => (
                <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl p-1" style={{ background: "var(--bg-elevated)" }}>
                  <img src={p.image} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-muted)" }}>{order.products?.length} item(s) • COD</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
