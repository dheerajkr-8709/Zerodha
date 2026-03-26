import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "USERID");

  useEffect(() => {
    // Check if username is passed in URL (from login)
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("username");
    if (user) {
      localStorage.setItem("username", user);
      setUsername(user);
    }
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (index) => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  // Derive initials for avatar
  const initials = username.substring(0, 2).toUpperCase();

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Logo" style={{ width: "20px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link className="menu-link" to="/" onClick={() => handleMenuClick(0)}>
              <p className={selectedMenu === 0 ? "menu selected" : "menu"}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/orders" onClick={() => handleMenuClick(1)}>
              <p className={selectedMenu === 1 ? "menu selected" : "menu"}>Orders</p>
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/holdings" onClick={() => handleMenuClick(2)}>
              <p className={selectedMenu === 2 ? "menu selected" : "menu"}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/positions" onClick={() => handleMenuClick(3)}>
              <p className={selectedMenu === 3 ? "menu selected" : "menu"}>Positions</p>
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/funds" onClick={() => handleMenuClick(4)}>
              <p className={selectedMenu === 4 ? "menu selected" : "menu"}>Funds</p>
            </Link>
          </li>
          <li>
            <Link className="menu-link" to="/apps" onClick={() => handleMenuClick(6)}>
              <p className={selectedMenu === 6 ? "menu selected" : "menu"}>Apps</p>
            </Link>
          </li>
        </ul>
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">{initials}</div>
          <p className="username">{username}</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
