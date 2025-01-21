import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideMenu from "./SideMenu";
import Header from "./Header";
import HomeUser from "../pages/Homeuser"; // Assuming you have the HomeUser.js component

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userRole, setUserRole] = useState(null); // Holds the current user's role
  const location = useLocation(); // Get the current route location

  // Assuming you get the user role from context, localStorage, or an API call
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Replace with your actual method
    setUserRole(user?.role); // Set the user role from the storage or API response
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Conditionally render components based on the route
  const renderHomePage = () => {
    if (location.pathname === "/") {
      // Show HomeUser for general users
      if (userRole === "general") {
        return <HomeUser />;
      }
      // Default Home component for others
      return <Outlet />;
    }
    return <Outlet />; // Render other components
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        {userRole === "admin" && (
          <SideMenu isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        )}

        {/* Main Content */}
        <div
          className={`flex-1 p-6 transition-all duration-300 overflow-auto ${
            userRole === "admin" ? (isCollapsed ? "ml-20" : "ml-64") : ""
          } bg-white`}
        >
          {renderHomePage()} {/* Render home page conditionally */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
