import React from "react";
import { Bell, MoonStar, Search, Star, UserCircle2 } from "lucide-react";

const TopBar = ({ search, setSearch, user, onLogout }) => {
  // ==============================
  // 🚧 Placeholder handler
  // ==============================
  const handleComingSoon = (feature) => {
    alert(`${feature} will be available soon. For now, explore the Social feed 🚀`);
  };

  // ==============================
  // 👤 User Initial
  // ==============================
  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : null;

  return (
    <header className="topbar">
      {/* Top Row */}
      <div className="topbar-row">
        {/* Title */}
        <div>
          <h1 className="page-title">Social</h1>
          <p className="page-subtitle">Your TaskPlanet community feed</p>
        </div>

        {/* Right Section */}
        <div className="topbar-right">
          <div className="pill">
            <Star size={14} />
            <span>52</span>
          </div>

          <div className="pill wallet-pill">₹0.00</div>

          <button
            className="icon-btn"
            type="button"
            onClick={() => handleComingSoon("Notifications")}
          >
            <Bell size={18} />
          </button>

          <button
            className="icon-btn"
            type="button"
            onClick={() => handleComingSoon("Theme settings")}
          >
            <MoonStar size={18} />
          </button>

          <div className="avatar">
            {userInitial ? userInitial : <UserCircle2 size={18} />}
          </div>
        </div>
      </div>

      {/* Search Row */}
      <div className="search-row">
        <div className="search-box">
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts, people, keywords..."
          />
        </div>

        <button className="ghost-btn" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;