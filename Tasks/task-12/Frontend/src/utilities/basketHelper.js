import { toast } from "react-toastify";
import { auth } from "../firebase/config";

const basketHelper = (e, product, openAuthGate) => {
  e?.stopPropagation();
  e?.preventDefault();

  if (!auth.currentUser) {
    if (openAuthGate) openAuthGate();
    else toast.info("Please login first 🔐");
    return { success: false, needsAuth: true };
  }

  const cart = JSON.parse(localStorage.getItem("sohafy_cart") || "[]");
  const exists = cart.find((i) => i.id === product._id || i.id === product.id);

  if (exists) {
    toast.info("Already in cart");
    return { success: false };
  }

  cart.push({
    id: product._id || product.id,
    productName: product.productName,
    brandName: product.brandName,
    category: product.category,
    productImage: product.productImage,
    price: product.price,
    sellingPrice: product.sellingPrice,
    qty: 1,
  });

  localStorage.setItem("sohafy_cart", JSON.stringify(cart));
  toast.success("Added to cart! 🛒");
  window.dispatchEvent(new Event("storage"));
  return { success: true };
};

export default basketHelper;
