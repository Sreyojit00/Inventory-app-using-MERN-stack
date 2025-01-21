import React from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaCartPlus,
  FaCog,
  FaFileAlt,
  FaStoreAlt,
} from "react-icons/fa";

function SideMenu({ isCollapsed, toggleSidebar }) {
  return (
    <div
      className={`h-[calc(100vh-64px)] fixed top-16 left-0 bg-gray-800 text-white transition-all duration-300 z-10 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Toggle Button */}
      <div className="flex justify-end p-4">
        <button
          className="bg-[#1c3556] p-2 rounded-full"
          onClick={toggleSidebar}
        >
          <FaBars className="text-white" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="space-y-4">
        <Link
          to="/"
          className="flex items-center gap-4 p-3 hover:bg-[#1c3556] transition-all duration-300"
        >
          <FaHome className="text-2xl" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link
          to="/inventory"
          className="flex items-center gap-4 p-3 hover:bg-[#1c3556] transition-all duration-300"
        >
          <FaStoreAlt className="text-2xl" />
          {!isCollapsed && <span>Inventory</span>}
        </Link>
        
        
        <Link
          to="/alert"
          className="flex items-center gap-4 p-3 hover:bg-[#1c3556] transition-all duration-300"
        >
          <FaCog className="text-2xl" />
          {!isCollapsed && <span>Alert</span>}
        </Link>
      </nav>
    </div>
  );
}

export default SideMenu;
