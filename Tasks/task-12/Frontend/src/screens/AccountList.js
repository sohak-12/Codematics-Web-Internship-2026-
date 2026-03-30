import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import { FiShield, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const AccountList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (userId, newRole) => {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), { role: newRole });
    toast.success("Role updated!");
    fetchUsers();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>All Users ({users.length})</h2>
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: "var(--bg-elevated)" }}>
              <th className="px-5 py-3 font-semibold text-xs uppercase" style={{ color: "var(--text-muted)" }}>#</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase text-left" style={{ color: "var(--text-muted)" }}>Name</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase text-left" style={{ color: "var(--text-muted)" }}>Email</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase text-left" style={{ color: "var(--text-muted)" }}>Role</th>
              <th className="px-5 py-3 font-semibold text-xs uppercase text-left" style={{ color: "var(--text-muted)" }}>Action</th>
            </tr></thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className="transition-colors" style={{ borderTop: "1px solid var(--divider)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-soft)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td className="px-5 py-3" style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--gradient-accent)" }}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{user?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--text-secondary)" }}>{user?.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${user?.role === "admin" ? "bg-purple-100 text-purple-700" : ""}`}
                      style={user?.role !== "admin" ? { background: "var(--bg-elevated)", color: "var(--text-secondary)" } : {}}>
                      {user?.role === "admin" ? <FiShield className="text-[10px]" /> : <FiUser className="text-[10px]" />} {user?.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => updateRole(user.id, user.role === "admin" ? "client" : "admin")} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ border: "1px solid var(--divider)", color: "var(--text-secondary)" }}>
                      {user.role === "admin" ? "Make Client" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountList;
