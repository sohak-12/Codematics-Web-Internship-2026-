import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./views/Navbar";
import SiteFooter from "./views/SiteFooter";
import AppContext from "./provider";
import { auth, db } from "./firebase/config";
import { setAccountDetails, setUserRole, clearAccount } from "./state/accountSlice";
import AuthGateModal from "./views/AuthGateModal";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [basketCount, setBasketCount] = useState(0);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const user = useSelector((s) => s.account.user);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        dispatch(setAccountDetails({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || userData.name || "",
          email: firebaseUser.email,
          ...userData,
        }));
        dispatch(setUserRole(userData.role || "client"));
      } else {
        dispatch(clearAccount());
      }
    });
    return () => unsub();
  }, [dispatch]);

  const fetchBasketCount = () => {
    const cart = JSON.parse(localStorage.getItem("sohafy_cart") || "[]");
    setBasketCount(cart.length);
  };

  useEffect(() => {
    fetchBasketCount();
    window.addEventListener("storage", fetchBasketCount);
    return () => window.removeEventListener("storage", fetchBasketCount);
  }, []);

  if (isAuthPage) {
    return (
      <>
        <ToastContainer position="top-center" autoClose={2000} theme="colored" toastClassName="!rounded-xl !shadow-xl !font-medium !text-sm" />
        <Outlet />
      </>
    );
  }

  return (
    <AppContext.Provider value={{ fetchBasketCount, basketCount, openAuthGate: () => setAuthGateOpen(true) }}>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" toastClassName="!rounded-xl !shadow-xl !font-medium !text-sm" />
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-8 min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>
      <SiteFooter />
      <AuthGateModal isOpen={authGateOpen} onClose={() => setAuthGateOpen(false)} onSuccess={fetchBasketCount} />
    </AppContext.Provider>
  );
}

export default App;
