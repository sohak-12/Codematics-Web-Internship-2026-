import React from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import "./Header.css";

const Header = ({ isDark, onToggleTheme, onSignOut, title = "Overview" }) => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <h1 className="header__title">{title}</h1>
        </div>

        <div className="header__right">
          <button
            className="header__theme-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {onSignOut && (
            <button
              className="header__logout-btn"
              onClick={onSignOut}
              aria-label="Sign out"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
