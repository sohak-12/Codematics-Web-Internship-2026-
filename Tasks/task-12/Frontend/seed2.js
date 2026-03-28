const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, Timestamp } = require("firebase/firestore");

const app = initializeApp({
  apiKey: "AIzaSyAWLTpZI_lknSFitOfQnERXQuyK0cWiaj0",
  authDomain: "sohafy-store.firebaseapp.com",
  projectId: "sohafy-store",
  storageBucket: "sohafy-store.firebasestorage.app",
  messagingSenderId: "240649109068",
  appId: "1:240649109068:web:9f0f54a98bc1331a10bee9",
});
const db = getFirestore(app);

const products = [
  // ── MENS FASHION ──
  { productName: "Classic Slim Fit Blazer", brandName: "Hugo Boss", category: "mens-fashion", price: 15999, sellingPrice: 11499, description: "Premium slim fit blazer for formal occasions", productImage: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop"] },
  { productName: "Casual Denim Jacket", brandName: "Levi's", category: "mens-fashion", price: 6999, sellingPrice: 4999, description: "Classic blue denim jacket", productImage: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop"] },
  { productName: "Premium Cotton Polo Shirt", brandName: "Ralph Lauren", category: "mens-fashion", price: 4500, sellingPrice: 2999, description: "Soft cotton polo in navy blue", productImage: ["https://images.unsplash.com/photo-1625910513413-5fc421e0fd6d?w=400&h=400&fit=crop"] },

  // ── WOMENS FASHION ──
  { productName: "Silk Evening Gown", brandName: "Gucci", category: "womens-fashion", price: 25000, sellingPrice: 18999, description: "Elegant silk evening gown", productImage: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop"] },
  { productName: "High Waist Palazzo Pants", brandName: "H&M", category: "womens-fashion", price: 3200, sellingPrice: 1999, description: "Comfortable wide leg palazzo pants", productImage: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"] },
  { productName: "Embroidered Kurti Collection", brandName: "Khaadi", category: "womens-fashion", price: 4800, sellingPrice: 3499, description: "Hand embroidered lawn kurti", productImage: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop"] },

  // ── MAKEUP ──
  { productName: "Matte Lipstick Set (6 Shades)", brandName: "MAC", category: "makeup", price: 5999, sellingPrice: 3999, description: "Long lasting matte lipstick collection", productImage: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop"] },
  { productName: "Full Coverage Foundation", brandName: "Maybelline", category: "makeup", price: 2499, sellingPrice: 1799, description: "24hr full coverage liquid foundation", productImage: ["https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop"] },
  { productName: "Eyeshadow Palette 18 Colors", brandName: "Urban Decay", category: "makeup", price: 7500, sellingPrice: 4999, description: "Shimmer and matte eyeshadow palette", productImage: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop"] },

  // ── SKINCARE ──
  { productName: "Hyaluronic Acid Moisturizer", brandName: "CeraVe", category: "skincare", price: 2800, sellingPrice: 1999, description: "Deep hydrating moisturizer for all skin types", productImage: ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop"] },
  { productName: "Retinol Night Cream", brandName: "Olay", category: "skincare", price: 3500, sellingPrice: 2499, description: "Anti-aging retinol night cream", productImage: ["https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&h=400&fit=crop"] },
  { productName: "Sunscreen SPF 50+ PA+++", brandName: "Neutrogena", category: "skincare", price: 1800, sellingPrice: 1299, description: "Ultra sheer dry-touch sunscreen", productImage: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop"] },

  // ── PERFUMES ──
  { productName: "Sauvage Eau de Parfum 100ml", brandName: "Dior", category: "perfumes", price: 22000, sellingPrice: 17999, description: "Iconic masculine fragrance", productImage: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"] },
  { productName: "Black Opium EDP 90ml", brandName: "YSL", category: "perfumes", price: 18000, sellingPrice: 13999, description: "Addictive feminine fragrance", productImage: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop"] },
  { productName: "Oud Wood Intense 50ml", brandName: "Tom Ford", category: "perfumes", price: 35000, sellingPrice: 28999, description: "Luxurious oud fragrance", productImage: ["https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=400&h=400&fit=crop"] },

  // ── SHOES ──
  { productName: "Classic White Sneakers", brandName: "Adidas", category: "shoes", price: 8999, sellingPrice: 5999, description: "Stan Smith classic white sneakers", productImage: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"] },
  { productName: "Leather Oxford Formal Shoes", brandName: "Clarks", category: "shoes", price: 12000, sellingPrice: 8499, description: "Genuine leather formal oxford shoes", productImage: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop"] },
  { productName: "Women's Block Heel Sandals", brandName: "Steve Madden", category: "shoes", price: 6500, sellingPrice: 4299, description: "Comfortable block heel sandals", productImage: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop"] },

  // ── SMARTPHONES ──
  { productName: "Samsung Galaxy S24 Ultra", brandName: "Samsung", category: "smartphones", price: 349999, sellingPrice: 299999, description: "AI powered flagship with S Pen", productImage: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop"] },
  { productName: "Google Pixel 8 Pro", brandName: "Google", category: "smartphones", price: 199999, sellingPrice: 169999, description: "Best camera phone with AI features", productImage: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop"] },

  // ── LAPTOPS ──
  { productName: "MacBook Air M3 15-inch", brandName: "Apple", category: "laptops", price: 399999, sellingPrice: 349999, description: "Thin and light with M3 chip", productImage: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"] },
  { productName: "Dell XPS 15 OLED", brandName: "Dell", category: "laptops", price: 299999, sellingPrice: 249999, description: "Stunning OLED display laptop", productImage: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop"] },
  { productName: "ASUS ROG Strix Gaming Laptop", brandName: "ASUS", category: "laptops", price: 259999, sellingPrice: 219999, description: "RTX 4070 gaming powerhouse", productImage: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop"] },

  // ── EARBUDS ──
  { productName: "AirPods Pro 2nd Gen", brandName: "Apple", category: "earbuds", price: 49999, sellingPrice: 39999, description: "Active noise cancellation with USB-C", productImage: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop"] },
  { productName: "Sony WF-1000XM5", brandName: "Sony", category: "earbuds", price: 45000, sellingPrice: 35999, description: "Industry leading noise cancellation", productImage: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop"] },

  // ── WATCHES ──
  { productName: "Casio G-Shock DW-5600", brandName: "Casio", category: "watches", price: 15000, sellingPrice: 10999, description: "Iconic digital tough watch", productImage: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop"] },
  { productName: "Fossil Gen 6 Hybrid", brandName: "Fossil", category: "watches", price: 28000, sellingPrice: 19999, description: "Classic look with smart features", productImage: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop"] },

  // ── BAGS ──
  { productName: "Canvas Backpack Travel", brandName: "Herschel", category: "bags", price: 7500, sellingPrice: 5499, description: "Durable canvas travel backpack", productImage: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"] },
  { productName: "Women's Tote Bag Premium", brandName: "Michael Kors", category: "bags", price: 12000, sellingPrice: 8999, description: "Spacious premium leather tote", productImage: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"] },

  // ── SUNGLASSES ──
  { productName: "Wayfarer Classic Black", brandName: "Ray-Ban", category: "sunglasses", price: 9500, sellingPrice: 6999, description: "Timeless wayfarer design", productImage: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop"] },
  { productName: "Cat Eye Polarized", brandName: "Prada", category: "sunglasses", price: 15000, sellingPrice: 10999, description: "Elegant cat eye polarized sunglasses", productImage: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop"] },

  // ── JEWELRY ──
  { productName: "Gold Plated Necklace Set", brandName: "Swarovski", category: "jewelry", price: 8500, sellingPrice: 5999, description: "Elegant gold plated crystal necklace", productImage: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"] },
  { productName: "Sterling Silver Ring Collection", brandName: "Pandora", category: "jewelry", price: 6000, sellingPrice: 4299, description: "Set of 3 sterling silver stackable rings", productImage: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"] },
  { productName: "Pearl Drop Earrings", brandName: "Tiffany", category: "jewelry", price: 12000, sellingPrice: 8999, description: "Freshwater pearl drop earrings", productImage: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"] },

  // ── GAMING ──
  { productName: "PS5 DualSense Controller", brandName: "Sony", category: "gaming", price: 14999, sellingPrice: 11999, description: "Wireless controller with haptic feedback", productImage: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop"] },
  { productName: "Gaming Mechanical Keyboard RGB", brandName: "Razer", category: "gaming", price: 18000, sellingPrice: 12999, description: "Mechanical switches with RGB lighting", productImage: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop"] },
  { productName: "Gaming Mouse Wireless", brandName: "Logitech", category: "gaming", price: 9500, sellingPrice: 6999, description: "Ultra lightweight wireless gaming mouse", productImage: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop"] },

  // ── CAMERAS ──
  { productName: "Mirrorless Camera Alpha 7", brandName: "Sony", category: "cameras", price: 299999, sellingPrice: 249999, description: "Full frame mirrorless camera", productImage: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop"] },
  { productName: "Instant Camera Mini 12", brandName: "Fujifilm", category: "cameras", price: 15000, sellingPrice: 11999, description: "Fun instant photo camera", productImage: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"] },

  // ── SPEAKERS ──
  { productName: "Portable Bluetooth Speaker", brandName: "JBL", category: "speakers", price: 12000, sellingPrice: 8499, description: "Waterproof portable speaker with bass boost", productImage: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"] },
  { productName: "Smart Home Speaker", brandName: "Amazon", category: "speakers", price: 8999, sellingPrice: 5999, description: "Alexa enabled smart speaker", productImage: ["https://images.unsplash.com/photo-1543512214-318228f8e9c8?w=400&h=400&fit=crop"] },

  // ── FITNESS ──
  { productName: "Yoga Mat Premium 6mm", brandName: "Lululemon", category: "fitness", price: 4500, sellingPrice: 2999, description: "Non-slip premium yoga mat", productImage: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop"] },
  { productName: "Adjustable Dumbbell Set 20kg", brandName: "Bowflex", category: "fitness", price: 18000, sellingPrice: 13999, description: "Space saving adjustable dumbbells", productImage: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop"] },
  { productName: "Resistance Bands Set (5 Pack)", brandName: "TheraBand", category: "fitness", price: 2500, sellingPrice: 1499, description: "5 resistance levels for full body workout", productImage: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop"] },

  // ── HOME & KITCHEN ──
  { productName: "Air Fryer Digital 5.5L", brandName: "Philips", category: "home-kitchen", price: 22000, sellingPrice: 15999, description: "Digital air fryer with rapid air technology", productImage: ["https://images.unsplash.com/photo-1648455702553-c0b3056e0e82?w=400&h=400&fit=crop"] },
  { productName: "Scented Candle Gift Set", brandName: "Yankee", category: "home-kitchen", price: 3500, sellingPrice: 2499, description: "Set of 4 premium scented candles", productImage: ["https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop"] },
  { productName: "Ceramic Plant Pot Set", brandName: "IKEA", category: "home-kitchen", price: 2800, sellingPrice: 1899, description: "Set of 3 minimalist ceramic pots", productImage: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop"] },

  // ── KIDS ──
  { productName: "Kids Building Blocks 500pcs", brandName: "LEGO", category: "kids", price: 8500, sellingPrice: 5999, description: "Creative building blocks mega set", productImage: ["https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop"] },
  { productName: "Baby Romper Set (3 Pack)", brandName: "Carter's", category: "kids", price: 3200, sellingPrice: 2199, description: "Soft cotton baby rompers", productImage: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=400&fit=crop"] },

  // ── SMART TVs ──
  { productName: "55 inch 4K OLED Smart TV", brandName: "LG", category: "smart-tvs", price: 199999, sellingPrice: 159999, description: "Stunning OLED display with webOS", productImage: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop"] },
  { productName: "43 inch Crystal UHD TV", brandName: "Samsung", category: "smart-tvs", price: 89999, sellingPrice: 69999, description: "Crystal clear 4K UHD display", productImage: ["https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop"] },
];

const newCategories = [
  "mens-fashion", "makeup", "perfumes", "laptops", "jewelry", "gaming",
  "cameras", "speakers", "fitness", "home-kitchen", "kids", "smart-tvs",
];

async function seed() {
  let count = 0;
  for (const p of products) {
    await addDoc(collection(db, "products"), { ...p, createdAt: Timestamp.now() });
    count++;
    process.stdout.write(`\rProducts added: ${count}/${products.length}`);
  }
  console.log("\n");

  for (const c of newCategories) {
    await addDoc(collection(db, "categories"), { name: c, createdAt: Timestamp.now() });
    console.log("Category:", c);
  }

  console.log(`\nDONE! Added ${products.length} products + ${newCategories.length} categories`);
  process.exit(0);
}

seed().catch((e) => { console.error(e.message); process.exit(1); });
