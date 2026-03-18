import React from "react";
import Modal from "./Modal";
import { LogOut } from "lucide-react";
import "./SignOutModal.css";

const SignOutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      title="Confirm Sign Out" 
      onClose={onClose}
    >
      <div className="sign-out-content">
        <div className="sign-out-icon-wrapper" aria-hidden="true">
          <LogOut size={32} />
        </div>
        
        <p className="sign-out-text">
          Are you sure you want to sign out? Your session will be securely terminated, and you will need to re-authenticate to access your financial data.
        </p>

        <div className="sign-out-actions form-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Stay Signed In
          </button>
          <button 
            className="btn btn-primary danger-btn" 
            onClick={onConfirm}
            autoFocus
          >
            Sign Out Now
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SignOutModal;