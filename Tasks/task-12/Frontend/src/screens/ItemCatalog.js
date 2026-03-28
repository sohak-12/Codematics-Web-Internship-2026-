import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import { FiPlus, FiTrash2, FiEdit3 } from "react-icons/fi";
import { toast } from "react-toastify";
import formatPrice from "../utilities/formatPrice";
import AddItemForm from "../views/AddItemForm";
import EditItemPanel from "../views/EditItemPanel";

const ItemCatalog = () => {
  const [items, setItems] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchItems = async () => {
    const q = query(collection(db, COLLECTIONS.PRODUCTS), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setItems(snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    toast.success("Product deleted");
    fetchItems();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>All Products ({items.length})</h2>
        <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Add Product</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-animation">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl overflow-hidden card-hover group" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
            <div className="h-36 p-3 flex items-center justify-center" style={{ background: "var(--gradient-card)" }}>
              <img src={item?.productImage?.[0]} alt={item?.productName} className="h-full w-full object-cover rounded-lg" />
            </div>
            <div className="p-3 space-y-1">
              <h3 className="text-sm font-semibold line-clamp-1" style={{ color: "var(--text-primary)" }}>{item?.productName}</h3>
              <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{item?.category}</p>
              <p className="text-base font-bold" style={{ color: "var(--accent)" }}>{formatPrice(item?.sellingPrice)}</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setEditItem(item)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all" style={{ border: "1px solid var(--divider)", color: "var(--accent)" }}>
                  <FiEdit3 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all" style={{ border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
                  <FiTrash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showUpload && <AddItemForm onClose={() => setShowUpload(false)} refreshItems={fetchItems} />}
      {editItem && <EditItemPanel data={editItem} onClose={() => setEditItem(null)} refreshItems={fetchItems} />}
    </div>
  );
};

export default ItemCatalog;
