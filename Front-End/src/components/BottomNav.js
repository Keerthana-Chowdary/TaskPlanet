import React from "react";
import { Home, ClipboardList, PlusCircle, Trophy, Users } from "lucide-react";

const BottomNav = ({ onCreateClick }) => {
  // ==============================
  // 🚧 Placeholder handler
  // ==============================
  const handleComingSoon = (feature) => {
    alert(`${feature} feature is coming soon 🚀\nMeanwhile, explore the Social feed.`);
  };

  return (
    <nav className="bottom-nav">
      {/* Home */}
      <button
        type="button"
        className="nav-item active"
        onClick={() => handleComingSoon("Home")}
      >
        <Home size={18} />
        <span>Home</span>
      </button>

      {/* Tasks */}
      <button
        type="button"
        className="nav-item"
        onClick={() => handleComingSoon("Tasks")}
      >
        <ClipboardList size={18} />
        <span>Tasks</span>
      </button>

      {/* Create Post (Center Button) */}
      <button
        type="button"
        className="nav-item center-item"
        onClick={onCreateClick}
      >
        <PlusCircle size={22} />
        <span>Post</span>
      </button>

      {/* Users */}
      <button
        type="button"
        className="nav-item"
        onClick={() => handleComingSoon("Users")}
      >
        <Users size={18} />
        <span>Users</span>
      </button>

      {/* Leaderboard */}
      <button
        type="button"
        className="nav-item"
        onClick={() => handleComingSoon("Leaderboard")}
      >
        <Trophy size={18} />
        <span>Rank</span>
      </button>
    </nav>
  );
};

export default BottomNav;