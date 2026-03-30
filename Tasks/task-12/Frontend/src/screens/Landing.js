import React from "react";
import HeroBanner from "../views/HeroBanner";
import CategoryGrid from "../views/CategoryGrid";
import HorizontalItemSlider from "../views/HorizontalItemSlider";
import VerticalItemSlider from "../views/VerticalItemSlider";

const Landing = () => {
  return (
    <div className="space-y-10 md:space-y-14">
      <HeroBanner />

      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Shop by Category</h2>
        <CategoryGrid />
      </div>

      <HorizontalItemSlider category="womens-fashion" heading="👗 Women's Fashion" />
      <HorizontalItemSlider category="mens-fashion" heading="👔 Men's Fashion" />
      <VerticalItemSlider category="makeup" heading="💄 Makeup & Beauty" />
      <HorizontalItemSlider category="shoes" heading="👟 Trending Shoes" />
      <VerticalItemSlider category="smartphones" heading="📱 Latest Smartphones" />
      <HorizontalItemSlider category="earbuds" heading="🎧 Earbuds & Headphones" />
      <VerticalItemSlider category="watches" heading="⌚ Stylish Watches" />
      <HorizontalItemSlider category="bags" heading="👜 Bags & Accessories" />
      <VerticalItemSlider category="skincare" heading="🧴 Skincare Essentials" />
      <HorizontalItemSlider category="perfumes" heading="🌸 Perfumes & Fragrances" />
      <VerticalItemSlider category="laptops" heading="💻 Laptops & Computers" />
      <HorizontalItemSlider category="sunglasses" heading="🕶️ Sunglasses" />
      <VerticalItemSlider category="jewelry" heading="💍 Jewelry Collection" />
      <HorizontalItemSlider category="gaming" heading="🎮 Gaming Zone" />
      <VerticalItemSlider category="cameras" heading="📷 Cameras" />
      <HorizontalItemSlider category="speakers" heading="🔊 Speakers" />
      <VerticalItemSlider category="smart-tvs" heading="📺 Smart TVs" />
      <HorizontalItemSlider category="fitness" heading="🏋️ Fitness & Sports" />
      <VerticalItemSlider category="home-kitchen" heading="🏠 Home & Kitchen" />
      <HorizontalItemSlider category="kids" heading="👶 Kids & Baby" />
    </div>
  );
};

export default Landing;
