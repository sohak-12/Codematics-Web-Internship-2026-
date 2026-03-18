import { useState, useEffect, useCallback } from "react";

export const useTheme = () => {
  // 1. Initial State: localStorage se check karo, ya system preference
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved !== null) {
      try { return JSON.parse(saved); } catch { return saved === "dark"; }
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 2. Sync with DOM: Jab bhi isDark badle, HTML tag update karo
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", JSON.stringify(isDark));
  }, [isDark]);

  // 3. Toggle Logic
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggleTheme };
};