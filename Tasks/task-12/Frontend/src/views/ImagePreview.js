import React from "react";
import { FiX } from "react-icons/fi";

const ImagePreview = ({ imgUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl p-4 max-w-[80vw] max-h-[80vh] shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50 transition-all group"
        >
          <FiX className="text-slate-500 group-hover:text-red-500" />
        </button>
        <img src={imgUrl} alt="Preview" className="max-w-full max-h-[70vh] object-contain rounded-2xl" />
      </div>
    </div>
  );
};

export default ImagePreview;
