import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../shared";

const loadCategoryItems = async (category) => {
  try {
    const q = query(collection(db, COLLECTIONS.PRODUCTS), where("category", "==", category));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ _id: d.id, id: d.id, ...d.data() }));
    return { data, success: true };
  } catch (err) {
    console.error(err);
    return { data: [], success: false };
  }
};

export default loadCategoryItems;
