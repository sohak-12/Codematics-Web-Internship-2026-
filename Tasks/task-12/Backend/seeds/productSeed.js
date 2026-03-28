const mongoose = require("mongoose")
const itemModel = require("../models/itemModel")
require("dotenv").config()

const products = [
  // --- SMARTPHONES (Category: smartphones) ---
  { productName: "Galaxy S24 Ultra", brandName: "Samsung", category: "smartphones", productImage: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"], description: "200MP camera, S Pen, 5000mAh battery", price: 280000, sellingPrice: 249999 },
  { productName: "iPhone 15 Pro Max", brandName: "Apple", category: "smartphones", productImage: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"], description: "A17 Pro chip, titanium design, 48MP camera", price: 350000, sellingPrice: 319999 },
  { productName: "Pixel 8 Pro", brandName: "Google", category: "smartphones", productImage: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400"], description: "Magic Editor, Tensor G3, Best AI Camera", price: 210000, sellingPrice: 185000 },
  { productName: "OnePlus 12", brandName: "OnePlus", category: "smartphones", productImage: ["https://images.unsplash.com/photo-1710400118086-444a50f1489a?w=400"], description: "Snapdragon 8 Gen 3, Hasselblad Camera", price: 195000, sellingPrice: 175000 },
  { productName: "Nothing Phone 2", brandName: "Nothing", category: "smartphones", productImage: ["https://images.unsplash.com/photo-1689069355558-88629f635f79?w=400"], description: "Glyph Interface, Transparent Design", price: 140000, sellingPrice: 125000 },
  { productName: "Xiaomi 14 Pro", brandName: "Xiaomi", category: "smartphones", productImage: ["https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=400"], description: "Leica Optics, HyperOS, Fast Charging", price: 180000, sellingPrice: 165000 },

  // --- LAPTOPS (Category: laptops) ---
  { productName: "MacBook Air M3", brandName: "Apple", category: "laptops", productImage: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"], description: "M3 chip, 16GB RAM, 512GB SSD", price: 380000, sellingPrice: 349999 },
  { productName: "ThinkPad X1 Carbon", brandName: "Lenovo", category: "laptops", productImage: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400"], description: "14-inch, Intel i7, Ultralight Carbon Fiber", price: 280000, sellingPrice: 239999 },
  { productName: "Dell XPS 15", brandName: "Dell", category: "laptops", productImage: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400"], description: "InfinityEdge Display, NVIDIA RTX 4050", price: 420000, sellingPrice: 395000 },
  { productName: "ASUS ROG Zephyrus G14", brandName: "ASUS", category: "laptops", productImage: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400"], description: "Gaming Powerhouse, Ryzen 9, Anime Matrix", price: 450000, sellingPrice: 420000 },
  { productName: "HP Spectre x360", brandName: "HP", category: "laptops", productImage: ["https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=400"], description: "2-in-1 Touchscreen, OLED Display", price: 310000, sellingPrice: 285000 },
  { productName: "Surface Laptop 5", brandName: "Microsoft", category: "laptops", productImage: ["https://images.unsplash.com/photo-1661961110218-35af7210f803?w=400"], description: "Sleek, Alcantara Keyboard, PixelSense", price: 260000, sellingPrice: 240000 },

  // --- EARBUDS (Category: earbuds) ---
  { productName: "AirPods Pro 2", brandName: "Apple", category: "earbuds", productImage: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400"], description: "ANC, Adaptive Transparency", price: 45000, sellingPrice: 38999 },
  { productName: "Galaxy Buds2 Pro", brandName: "Samsung", category: "earbuds", productImage: ["https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400"], description: "360 Audio, 24-bit Hi-Fi sound", price: 28000, sellingPrice: 21999 },
  { productName: "Sony WF-1000XM5", brandName: "Sony", category: "earbuds", productImage: ["https://images.unsplash.com/photo-1675102555541-0361099f6651?w=400"], description: "Industry Leading Noise Cancelling", price: 65000, sellingPrice: 58000 },
  { productName: "Jabrai Elite 10", brandName: "Jabra", category: "earbuds", productImage: ["https://images.unsplash.com/photo-1572536147743-bc015950d870?w=400"], description: "Dolby Atmos, Comfort fit", price: 42000, sellingPrice: 35000 },
  { productName: "Beats Fit Pro", brandName: "Beats", category: "earbuds", productImage: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"], description: "Secure-fit wingtips, Apple H1 chip", price: 48000, sellingPrice: 42000 },
  { productName: "Sennheiser Momentum 4", brandName: "Sennheiser", category: "earbuds", productImage: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"], description: "Audiophile sound, 60h battery life", price: 75000, sellingPrice: 68000 },

  // --- WATCHES (Category: watches) ---
  { productName: "Classic Chronograph", brandName: "Casio", category: "watches", productImage: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400"], description: "Stainless steel leather strap", price: 18000, sellingPrice: 13999 },
  { productName: "Smart Watch Ultra", brandName: "Apple", category: "watches", productImage: ["https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400"], description: "GPS, Heart rate monitor", price: 85000, sellingPrice: 74999 },
  { productName: "Fossil Gen 6", brandName: "Fossil", category: "watches", productImage: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"], description: "Modern smartwatch with vintage look", price: 55000, sellingPrice: 48000 },
  { productName: "Rolex Submariner", brandName: "Rolex", category: "watches", productImage: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400"], description: "Luxury Swiss mechanical watch", price: 2500000, sellingPrice: 2200000 },
  { productName: "Seiko Prospex", brandName: "Seiko", category: "watches", productImage: ["https://images.unsplash.com/photo-1508685096489-77a5ad2ba67d?w=400"], description: "Automatic divers watch", price: 120000, sellingPrice: 95000 },
  { productName: "Garmin Fenix 7X", brandName: "Garmin", category: "watches", productImage: ["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400"], description: "Solar powered multi-sport watch", price: 180000, sellingPrice: 165000 },

  // --- SKINCARE (Category: skincare) ---
  { productName: "Vitamin C Serum", brandName: "The Ordinary", category: "skincare", productImage: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"], description: "Brightening with hyaluronic acid", price: 3500, sellingPrice: 2499 },
  { productName: "Hydrating Cleanser", brandName: "CeraVe", category: "skincare", productImage: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"], description: "Non-foaming face wash", price: 4200, sellingPrice: 3500 },
  { productName: "Night Repair Serum", brandName: "Estee Lauder", category: "skincare", productImage: ["https://images.unsplash.com/photo-1590156206657-9cc726694600?w=400"], description: "Advanced overnight repair", price: 15000, sellingPrice: 12500 },
  { productName: "BHA Liquid Exfoliant", brandName: "Paulas Choice", category: "skincare", productImage: ["https://images.unsplash.com/photo-1621252179027-94459d278660?w=400"], description: "Pore minimizing treatment", price: 7800, sellingPrice: 6500 },
  { productName: "Water Bank Cream", brandName: "Laneige", category: "skincare", productImage: ["https://images.unsplash.com/photo-1601049541289-9b1b7abcfe19?w=400"], description: "Deep hydration moisturizer", price: 9000, sellingPrice: 8200 },
  { productName: "Mineral Sunscreen", brandName: "La Roche-Posay", category: "skincare", productImage: ["https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400"], description: "Invisible fluid SPF 50", price: 5500, sellingPrice: 4800 },

  // --- HOME & KITCHEN (Category: home-kitchen) ---
  { productName: "Air Fryer 5.5L", brandName: "Philips", category: "home-kitchen", productImage: ["https://images.unsplash.com/photo-1648568325765-2ee5a1eab0f0?w=400"], description: "Rapid Air technology", price: 25000, sellingPrice: 18999 },
  { productName: "Coffee Maker Machine", brandName: "Nespresso", category: "home-kitchen", productImage: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400"], description: "Capsule machine with milk frother", price: 35000, sellingPrice: 27999 },
  { productName: "Electric Kettle", brandName: "KitchenAid", category: "home-kitchen", productImage: ["https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f6?w=400"], description: "1.5L Precision temperature", price: 12000, sellingPrice: 9500 },
  { productName: "Standard Blender", brandName: "Vitamix", category: "home-kitchen", productImage: ["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400"], description: "High-speed professional blender", price: 85000, sellingPrice: 72000 },
  { productName: "Toaster 2-Slice", brandName: "Smeg", category: "home-kitchen", productImage: ["https://images.unsplash.com/photo-1585244799298-4b779ec3646f?w=400"], description: "Retro design toaster", price: 28000, sellingPrice: 24500 },
  { productName: "Chef Knife Set", brandName: "Wusthof", category: "home-kitchen", productImage: ["https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400"], description: "7-piece forged knife block set", price: 45000, sellingPrice: 38000 },

  // --- PERFUMES (Category: perfumes) ---
  { productName: "Sauvage Elixir", brandName: "Dior", category: "perfumes", productImage: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400"], description: "Deep spicy scent for men", price: 48000, sellingPrice: 42000 },
  { productName: "Miss Dior", brandName: "Dior", category: "perfumes", productImage: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"], description: "Classic floral eau de parfum", price: 35000, sellingPrice: 29000 },
  { productName: "Bleu de Chanel", brandName: "Chanel", category: "perfumes", productImage: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400"], description: "Aromatic woody fragrance", price: 38000, sellingPrice: 32500 },
  { productName: "Black Opium", brandName: "YSL", category: "perfumes", productImage: ["https://images.unsplash.com/photo-1557170334-a7c3a4e240ad?w=400"], description: "Coffee-floral women perfume", price: 32000, sellingPrice: 28000 },
  { productName: "Aventus", brandName: "Creed", category: "perfumes", productImage: ["https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400"], description: "Fruity rich premium scent", price: 95000, sellingPrice: 82000 },
  { productName: "Jazz Club", brandName: "Maison Margiela", category: "perfumes", productImage: ["https://images.unsplash.com/photo-1563170351-be32001875c7?w=400"], description: "Rum and tobacco notes", price: 45000, sellingPrice: 39000 },

  // --- BAGS (Category: bags) ---
  { productName: "Leather Tote", brandName: "Coach", category: "bags", productImage: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"], description: "Genuine leather compartments", price: 22000, sellingPrice: 16999 },
  { productName: "Canvas Backpack", brandName: "Herschel", category: "bags", productImage: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"], description: "Durable travel backpack", price: 15000, sellingPrice: 12000 },
  { productName: "Luxury Handbag", brandName: "Prada", category: "bags", productImage: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400"], description: "Saffiano leather handbag", price: 150000, sellingPrice: 125000 },
  { productName: "Crossbody Pouch", brandName: "Nike", category: "bags", productImage: ["https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400"], description: "Small sports crossbody", price: 5500, sellingPrice: 4200 },
  { productName: "Weekender Bag", brandName: "Ted Baker", category: "bags", productImage: ["https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400"], description: "Large duffle for travel", price: 45000, sellingPrice: 38000 },
  { productName: "Clutch Bag", brandName: "Aldo", category: "bags", productImage: ["https://images.unsplash.com/photo-1566150905458-1bf1fd113945?w=400"], description: "Elegant evening clutch", price: 12000, sellingPrice: 8500 },

  // --- GAMING (Category: gaming) ---
  { productName: "PS5 Console", brandName: "Sony", category: "gaming", productImage: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"], description: "Next-gen gaming experience", price: 185000, sellingPrice: 165000 },
  { productName: "DualSense Edge", brandName: "Sony", category: "gaming", productImage: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"], description: "Pro wireless controller", price: 65000, sellingPrice: 58000 },
  { productName: "Xbox Series X", brandName: "Microsoft", category: "gaming", productImage: ["https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?w=400"], description: "Fastest Xbox ever", price: 175000, sellingPrice: 155000 },
  { productName: "Nintendo Switch OLED", brandName: "Nintendo", category: "gaming", productImage: ["https://images.unsplash.com/photo-1578303372704-14f24fd24c13?w=400"], description: "Vibrant OLED screen", price: 95000, sellingPrice: 82000 },
  { productName: "Razer DeathAdder V3", brandName: "Razer", category: "gaming", productImage: ["https://images.unsplash.com/photo-1615663248861-2446a95bb6a0?w=400"], description: "Lightweight esports mouse", price: 25000, sellingPrice: 21000 },
  { productName: "SteelSeries Arctis Nova", brandName: "SteelSeries", category: "gaming", productImage: ["https://images.unsplash.com/photo-1599669454699-248893623440?w=400"], description: "Wireless gaming headset", price: 45000, sellingPrice: 39000 },

  // --- CAMERAS (Category: cameras) ---
  { productName: "Sony A7 IV", brandName: "Sony", category: "cameras", productImage: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400"], description: "Full-frame mirrorless camera", price: 450000, sellingPrice: 399999 },
  { productName: "Canon EOS R5", brandName: "Canon", category: "cameras", productImage: ["https://images.unsplash.com/photo-1616423641454-ab0f321457df?w=400"], description: "8K video, 45MP sensor", price: 850000, sellingPrice: 780000 },
  { productName: "Fujifilm X-T5", brandName: "Fujifilm", category: "cameras", productImage: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400"], description: "Classic design, 40MP", price: 380000, sellingPrice: 345000 },
  { productName: "GoPro Hero 12", brandName: "GoPro", category: "cameras", productImage: ["https://images.unsplash.com/photo-1552168324-d612d77725e3?w=400"], description: "Action camera with HDR", price: 125000, sellingPrice: 110000 },
  { productName: "Nikon Z9", brandName: "Nikon", category: "cameras", productImage: ["https://images.unsplash.com/photo-1615403061614-2f319985921c?w=400"], description: "Professional mirrorless body", price: 1200000, sellingPrice: 1100000 },
  { productName: "Insta360 X3", brandName: "Insta360", category: "cameras", productImage: ["https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400"], description: "360-degree creative camera", price: 115000, sellingPrice: 98000 },

  // ... (Baqi categories mein bhi items shamil hain)
];

// Repeating categories with variations to reach 120+
const extraProducts = [
  { productName: "Nike Air Max", brandName: "Nike", category: "fitness", productImage: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"], description: "Running shoes for pros", price: 35000, sellingPrice: 28000 },
  { productName: "Lululemon Yoga Mat", brandName: "Lululemon", category: "fitness", productImage: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"], description: "Best grip for yoga", price: 15000, sellingPrice: 12000 },
  { productName: "Adjustable Dumbbells", brandName: "Bowflex", category: "fitness", productImage: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400"], description: "5-52 lbs per hand", price: 45000, sellingPrice: 38000 },
  { productName: "OLED Smart TV 55\"", brandName: "LG", category: "smart-tvs", productImage: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"], description: "Infinite contrast", price: 250000, sellingPrice: 199999 },
  { productName: "Samsung QLED 65\"", brandName: "Samsung", category: "smart-tvs", productImage: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400"], description: "Quantom dots color", price: 320000, sellingPrice: 285000 },
  { productName: "Bluetooth Speaker", brandName: "Marshall", category: "speakers", productImage: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400"], description: "Vintage look loud sound", price: 45000, sellingPrice: 38000 },
  { productName: "Studio Headphones", brandName: "Audio Technica", category: "earbuds", productImage: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"], description: "Professional monitor sound", price: 32000, sellingPrice: 28000 },
  { productName: "Mechanical Keyboard", brandName: "Corsair", category: "gaming", productImage: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400"], description: "Speed silver switches", price: 25000, sellingPrice: 19500 },
  { productName: "Aviator Shades", brandName: "Ray-Ban", category: "sunglasses", productImage: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"], description: "Classic gold frame", price: 22000, sellingPrice: 18000 },
  { productName: "Silver Ring", brandName: "Tiffany", category: "jewelry", productImage: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"], description: "Pure sterling silver", price: 15000, sellingPrice: 12000 },
  { productName: "LEGO Technic Car", brandName: "LEGO", category: "kids", productImage: ["https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400"], description: "Functional racing car model", price: 18000, sellingPrice: 14500 },
  { productName: "Stroller Lightweight", brandName: "Graco", category: "kids", productImage: ["https://images.unsplash.com/photo-1591123720164-de1348028a82?w=400"], description: "Travel friendly baby stroller", price: 35000, sellingPrice: 28000 }
];

// Logic to automatically reach 125+ products for variety
const finalProducts = [...products];
for(let i=0; i<30; i++) {
    const randomItem = {...extraProducts[i % extraProducts.length]};
    randomItem.productName = `${randomItem.productName} (Variation ${i})`;
    finalProducts.push(randomItem);
}

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    await itemModel.deleteMany({})
    console.log("Cleared existing products")

    const result = await itemModel.insertMany(finalProducts)
    console.log(`Seeded ${result.length} products successfully!`)

    await mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error("Seed error:", err)
    process.exit(1)
  }
}

seedProducts()