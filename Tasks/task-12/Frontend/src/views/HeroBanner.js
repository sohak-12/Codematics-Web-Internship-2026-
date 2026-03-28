import React, { useEffect, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const desktopBanners = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&h=500&fit=crop",
];

const mobileBanners = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop",
];

const overlayTexts = [
  { title: "Fashion Week Sale!", subtitle: "Up to 70% off on trending outfits" },
  { title: "Beauty Essentials", subtitle: "Makeup, skincare & fragrances" },
  { title: "Gadget Fest", subtitle: "Latest electronics at best prices" },
  { title: "Glow Up Season", subtitle: "Premium beauty & skincare deals" },
  { title: "Tech Deals Live!", subtitle: "Smartphones, laptops & more" },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % desktopBanners.length);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + desktopBanners.length) % desktopBanners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden group" style={{ boxShadow: "var(--shadow-xl)" }}>
      <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px]">
        {desktopBanners.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <picture>
              <source media="(max-width: 640px)" srcSet={mobileBanners[idx]} />
              <img src={img} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 text-white animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo1.png" alt="Sohafy" className="w-8 h-8 rounded-lg object-contain" />
                <span className="text-sm font-bold tracking-wider opacity-80">SOHAFY</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black mb-2 drop-shadow-lg">
                {overlayTexts[idx].title}
              </h2>
              <p className="text-sm md:text-xl text-white/80 font-medium">
                {overlayTexts[idx].subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40">
        <FiChevronLeft className="text-xl" />
      </button>
      <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40">
        <FiChevronRight className="text-xl" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {desktopBanners.map((_, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={`h-2 rounded-full transition-all duration-300 ${idx === current ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
