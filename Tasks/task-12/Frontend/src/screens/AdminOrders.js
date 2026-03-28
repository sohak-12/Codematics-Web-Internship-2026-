import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS, ORDER_STATUS } from "../shared";
import formatPrice from "../utilities/formatPrice";
import { toast } from "react-toastify";
import { FiClock, FiTruck, FiCheckCircle, FiDownload } from "react-icons/fi";

const statusColors = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    const q = query(collection(db, COLLECTIONS.ORDERS), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), { status: newStatus });
    toast.success(`Order marked as ${newStatus}`);
    fetchOrders();
  };

  const exportOrders = () => {
    const csv = ["Order ID,Customer,Email,Phone,City,Total,Status,Date"];
    orders.forEach((o) => {
      csv.push(`${o.id},${o.userName},${o.userEmail},${o.phone},${o.city},${o.totalPrice},${o.status},${o.createdAt?.toDate?.()?.toLocaleDateString() || ""}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
  };

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Orders ({orders.length})</h2>
        <button onClick={exportOrders} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all" style={{ border: "1px solid var(--divider)", color: "var(--text-secondary)", background: "var(--bg-card)" }}>
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "Processing", "Delivered"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={filter === s
              ? { background: "var(--gradient-accent)", color: "white", boxShadow: "0 4px 15px var(--accent-glow)" }
              : { background: "var(--bg-card)", border: "1px solid var(--divider)", color: "var(--text-secondary)" }}>
            {s} {s !== "All" && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="rounded-2xl p-5 card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.userName} • {order.phone}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.address}, {order.city}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{formatPrice(order.totalPrice)}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto mb-3">
              {order.products?.map((p, i) => (
                <div key={i} className="flex-shrink-0 flex items-center gap-2 rounded-lg px-2 py-1" style={{ background: "var(--bg-elevated)" }}>
                  <img src={p.image} alt="" className="w-8 h-8 object-contain" />
                  <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{p.name?.slice(0, 20)}... x{p.qty}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${statusColors[order.status] || ""}`}>
                {order.status === "Pending" && <FiClock size={12} />}
                {order.status === "Processing" && <FiTruck size={12} />}
                {order.status === "Delivered" && <FiCheckCircle size={12} />}
                {order.status}
              </span>
              <div className="flex gap-2">
                {Object.values(ORDER_STATUS).filter((s) => s !== order.status).map((s) => (
                  <button key={s} onClick={() => updateStatus(order.id, s)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ border: "1px solid var(--divider)", color: "var(--text-secondary)" }}>
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
