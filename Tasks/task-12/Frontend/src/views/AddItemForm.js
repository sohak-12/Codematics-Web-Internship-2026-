import React, { useState, useEffect } from "react";
import { FiX, FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";
import cloudUpload from "../utilities/cloudUpload";
import ImagePreview from "./ImagePreview";

const AddItemForm = ({ onClose, refreshItems }) => {
  const [data, setData] = useState({ productName: "", brandName: "", category: "", productImage: [], description: "", price: "", sellingPrice: "", stock: "" });
  const [previewImg, setPreviewImg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchCats();
  }, []);

  const handleChange = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await cloudUpload(file);
      setData((p) => ({ ...p, productImage: [...p.productImage, result.url] }));
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const handleDeleteImage = (idx) => {
    setData((p) => ({ ...p, productImage: p.productImage.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
        ...data,
        price: Number(data.price),
        sellingPrice: Number(data.sellingPrice),
        stock: Number(data.stock) || 0,
        createdAt: serverTimestamp(),
      });
      toast.success("Product added! ✨");
      refreshItems();
      onClose();
    } catch { toast.error("Failed to add product"); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md p-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl z-10">
          <h3 className="text-lg font-bold text-slate-800">Add New Product</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><FiX /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div><label className="text-sm font-medium text-slate-600 mb-1 block">Product Name</label><input name="productName" value={data.productName} onChange={handleChange} required className="input-field" placeholder="Enter product name" /></div>
          <div><label className="text-sm font-medium text-slate-600 mb-1 block">Brand</label><input name="brandName" value={data.brandName} onChange={handleChange} required className="input-field" placeholder="Enter brand" /></div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Category</label>
            <select name="category" value={data.category} onChange={handleChange} required className="input-field">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Images</label>
            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
              <FiUploadCloud className="text-2xl text-slate-400 mb-1" />
              <span className="text-sm text-slate-400">{uploading ? "Uploading..." : "Click to upload"}</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} />
            </label>
            {data.productImage.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {data.productImage.map((img, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                    <img src={img} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => setPreviewImg(img)} />
                    <button type="button" onClick={() => handleDeleteImage(idx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 className="text-white" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-sm font-medium text-slate-600 mb-1 block">Price</label><input name="price" type="number" value={data.price} onChange={handleChange} required className="input-field" /></div>
            <div><label className="text-sm font-medium text-slate-600 mb-1 block">Selling Price</label><input name="sellingPrice" type="number" value={data.sellingPrice} onChange={handleChange} required className="input-field" /></div>
            <div><label className="text-sm font-medium text-slate-600 mb-1 block">Stock</label><input name="stock" type="number" value={data.stock} onChange={handleChange} className="input-field" /></div>
          </div>
          <div><label className="text-sm font-medium text-slate-600 mb-1 block">Description</label><textarea name="description" value={data.description} onChange={handleChange} rows={3} className="input-field resize-none" /></div>
          <button type="submit" className="btn-primary w-full text-center">Upload Product</button>
        </form>
      </div>
      {previewImg && <ImagePreview imgUrl={previewImg} onClose={() => setPreviewImg("")} />}
    </div>
  );
};

export default AddItemForm;
