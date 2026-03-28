import { useState, useEffect, useMemo } from "react";

const useAppTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem("sohafy_theme") || "system");
  const systemPref = useMemo(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", []);

  useEffect(() => {
    const resolved = theme === "system" ? systemPref : theme;
    document.documentElement.setAttribute("data-theme", resolved);
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
    meta.setAttribute("content", resolved === "dark" ? "#0a0618" : "#ffffff");
    localStorage.setItem("sohafy_theme", theme);
  }, [theme, systemPref]);

  return [theme, setTheme];
};

export default useAppTheme;
