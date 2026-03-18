import React, { useEffect, useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({ isOpen, title, onClose, children }) => {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 350);
      document.body.style.overflow = "unset";
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!rendered) return null;

  return ReactDOM.createPortal(
    <>
      <div className={`modal__overlay ${visible ? "modal--in" : "modal--out"}`} onClick={onClose} aria-hidden="true" />
      <div className={`modal__content ${visible ? "modal--in" : "modal--out"}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </>,
    document.body
  );
};

export default Modal;
