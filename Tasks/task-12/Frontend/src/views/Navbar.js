import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage, FiGrid } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";
import { clearAccount } from "../state/accountSlice";
import AppContext from "../provider";
import BrandLogo from "./BrandLogo";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const user = useSelector((s) => s?.account?.user);
  const role = useSelector((s) => s?.account?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearAccount());
    localStorage.removeItem("sohafy_cart");
    context?.fetchBasketCount();
    toast.success("Logged out successfully");
    navigate("/");
    setProfileOpen(false);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    if (value) navigate(`/search?q=${value}`);
    else navigate("/search");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "var(--bg-glass)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderColor: "var(--divider)" }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex-shrink-0">
          <BrandLogo />
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full group">
            <input
              type="text"
              placeholder="Search fashion, electronics & more..."
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl outline-none transition-all duration-300 text-sm"
              style={{ background: "var(--bg-elevated)", border: "2px solid transparent", color: "var(--text-primary)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "var(--bg-card)"; e.target.style.boxShadow = "0 0 0 4px var(--accent-glow)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.background = "var(--bg-elevated)"; e.target.style.boxShadow = "none"; }}
              value={searchQuery}
              onChange={handleSearch}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--text-muted)" }} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          <Link to="/basket" className="relative p-2.5 rounded-xl transition-all duration-300 group" style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            <FiShoppingCart className="text-xl" />
            {context?.basketCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center floating-badge" style={{ background: "var(--gradient-accent)" }}>
                {context?.basketCount}
              </span>
            )}
          </Link>

          <div className="relative">
            {user ? (
              <>
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-2 rounded-xl transition-all duration-300">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--gradient-accent)", boxShadow: "0 4px 12px var(--accent-glow)" }}>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-14 w-56 rounded-2xl py-2 animate-slide-down" style={{ background: "var(--bg-card)", border: "1px solid var(--divider)", boxShadow: "var(--shadow-xl)" }}>
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--divider)" }}>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                    </div>
                    <Link to="/my-orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                      <FiPackage /> My Orders
                    </Link>
                    {role === "admin" && (
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all" style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                        <FiGrid /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm w-full transition-all" style={{ color: "#ef4444" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-5">Login</Link>
            )}
          </div>

          <button className="md:hidden p-2 rounded-xl transition-all" style={{ color: "var(--text-secondary)" }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 animate-slide-down">
          <input type="text" placeholder="Search products..." className="input-field" value={searchQuery} onChange={handleSearch} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
