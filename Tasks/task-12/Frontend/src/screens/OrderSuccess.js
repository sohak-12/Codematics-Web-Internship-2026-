import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiPackage } from "react-icons/fi";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "backOut" }} className="text-center max-w-md">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30">
          <FiCheckCircle className="text-white text-4xl" />
        </motion.div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Order Placed! 🎉</h1>
        <p className="text-slate-500 mb-8">Thank you for shopping at Sohafy! You'll pay on delivery.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/my-orders" className="btn-primary flex items-center gap-2"><FiPackage /> My Orders</Link>
          <Link to="/" className="btn-secondary flex items-center gap-2"><FiShoppingBag /> Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
