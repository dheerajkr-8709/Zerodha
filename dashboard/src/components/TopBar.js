import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{18200.2} </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{61500.5}</p>
        </div>
        <button 
          onClick={toggleTheme} 
          style={{
            marginLeft: "20px",
            background: "none",
            border: "1px solid var(--border-light)",
            color: "var(--text-main)",
            padding: "6px 12px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s"
          }}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
