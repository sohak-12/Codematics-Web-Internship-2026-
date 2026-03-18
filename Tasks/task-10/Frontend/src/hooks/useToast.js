import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import "./Toast.css";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // Ref to store timeout IDs to prevent memory leaks
  const timeouts = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timeouts.current.has(id)) {
      clearTimeout(timeouts.current.get(id));
      timeouts.current.delete(id);
    }
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = crypto.randomUUID(); // Modern and faster than Date.now()
    setToasts((prev) => [...prev, { id, message, type }]);

    // Set timeout and store reference
    const timer = setTimeout(() => removeToast(id), 5000); // Increased to 5s for better readability
    timeouts.current.set(id, timer);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ 
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      info: (msg) => addToast(msg, "info") 
    }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === "success" && <CheckCircle size={20} />}
              {toast.type === "error" && <AlertCircle size={20} />}
              {toast.type === "info" && <Info size={20} />}
            </div>
            <p className="toast-message">{toast.message}</p>
            <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Close">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);