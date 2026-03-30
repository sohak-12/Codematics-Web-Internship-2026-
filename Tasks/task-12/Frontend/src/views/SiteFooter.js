import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiMail, FiPhone } from "react-icons/fi";

const SiteFooter = () => {
  return (
    <footer className="mt-16" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--divider)" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo1.png" alt="Sohafy" className="w-10 h-10 rounded-xl object-contain" />
              <span className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>Sohafy</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Your ultimate destination for fashion, electronics & lifestyle products at unbeatable prices.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: "var(--accent)" }}>Quick Links</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <li><Link to="/" className="transition-colors" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => e.target.style.color = "var(--accent)"} onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}>Home</Link></li>
              <li><Link to="/search" className="transition-colors" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => e.target.style.color = "var(--accent)"} onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}>Products</Link></li>
              <li><Link to="/basket" className="transition-colors" style={{ color: "var(--text-muted)" }} onMouseEnter={(e) => e.target.style.color = "var(--accent)"} onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}>Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: "var(--accent)" }}>Categories</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <li>Fashion</li>
              <li>Makeup</li>
              <li>Electronics</li>
              <li>Lifestyle</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: "var(--accent)" }}>Contact</h3>
            <ul className="space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <li className="flex items-center gap-2"><FiMail style={{ color: "var(--accent)" }} /> support@sohafy.com</li>
              <li className="flex items-center gap-2"><FiPhone style={{ color: "var(--accent)" }} /> +92 300 1234567</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--divider)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Sohafy. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            Made with <FiHeart className="animate-pulse" style={{ color: "#ef4444" }} /> using React + Firebase
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.7 }}>Developed by <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Soha Muzammil</span></p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
