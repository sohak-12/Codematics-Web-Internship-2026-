import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LayoutDashboard, PieChart, ArrowLeftRight } from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Transactions from "./pages/Transactions";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import SignOutModal from "./components/SignOutModal";
import PremiumLoader from "./components/PremiumLoader";
import { ToastProvider, useToast } from "./hooks/useToast";

import "./App.css";

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };

    const handleUnauthorized = () => {
      setIsLoggedIn(false);
      navigate("/login", { replace: true });
    };

    checkAuth();
    window.addEventListener("focus", checkAuth);
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleLogoutConfirm = () => {
    setShowSignOutModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.info("Session ended securely.");
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <PremiumLoader message="Syncing Wealth Systems..." />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Auth onLoginSuccess={handleLoginSuccess} />}
        />

        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/dashboard" element={
            <AppShell currentPage="dashboard" onSignOut={() => setShowSignOutModal(true)}>
              <Dashboard />
            </AppShell>
          } />
          <Route path="/budgets" element={
            <AppShell currentPage="budgets" onSignOut={() => setShowSignOutModal(true)}>
              <Budgets />
            </AppShell>
          } />
          <Route path="/transactions" element={
            <AppShell currentPage="transactions" onSignOut={() => setShowSignOutModal(true)}>
              <Transactions />
            </AppShell>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

function AppShell({ currentPage, onSignOut, children }) {
  const navigate = useNavigate();

  return (
    <div className="app">
      <nav className="app-sidebar">
        <div className="sidebar-brand">
          <div className="custom-brand-logo">
            <img src="./Images1.png" alt="Soha" />
          </div>
          <span className="brand-text">Sohanix Wealth</span>
        </div>

        <div className="sidebar-links">
          {[
            { id: "dashboard", icon: <LayoutDashboard size={22} />, label: "Dashboard", path: "/dashboard" },
            { id: "transactions", icon: <ArrowLeftRight size={22} />, label: "Transactions", path: "/transactions" },
            { id: "budgets", icon: <PieChart size={22} />, label: "Budgets", path: "/budgets" }
          ].map(link => (
            <button
              key={link.id}
              className={`sidebar-link ${currentPage === link.id ? "active" : ""}`}
              onClick={() => navigate(link.path)}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-operator-footer">
            <div className="operator-info">
              <span className="operator-label">Operator</span>
              <span className="operator-name">Soha Muzammil</span>
            </div>
            <button className="sidebar-power-btn" onClick={onSignOut} title="Logout">
              ⏻
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}

export default App;
