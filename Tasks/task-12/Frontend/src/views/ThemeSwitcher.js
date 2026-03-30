import React from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import useAppTheme from "../utilities/useAppTheme";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useAppTheme();

  const options = [
    { key: "light", icon: FiSun, label: "Light" },
    { key: "dark", icon: FiMoon, label: "Dark" },
    { key: "system", icon: FiMonitor, label: "System" },
  ];

  return (
    <div className="theme-switcher">
      {options.map(({ key, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`theme-btn ${theme === key ? "active" : ""}`}
          title={key}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
