import React from "react";

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo1.png" alt="Sohafy" className="w-9 h-9 rounded-xl object-contain" style={{ boxShadow: "0 4px 12px var(--accent-glow)" }} />
      <span className="text-xl font-extrabold tracking-tight">
        <span className="gradient-text">Soh</span>
        <span style={{ color: "var(--text-primary)" }}>afy</span>
      </span>
    </div>
  );
};

export default BrandLogo;
