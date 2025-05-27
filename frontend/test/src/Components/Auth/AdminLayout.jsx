import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { hasAccess } from "../../../utils/permissionUtils";
import {
  FiUsers,
  FiBriefcase,
  FiSettings,
  FiBox,
  FiHome,
  FiUserCheck,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

function AdminLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const navigate = useNavigate();
  const location = useLocation();

  const accessibleRoutes = [
    { key: "Users", path: "users", label: "Users", icon: <FiUsers /> },
    { key: "Roles", path: "roles", label: "Roles", icon: <FiSettings /> },
    {
      key: "Enterprises",
      path: "enterprises",
      label: "Enterprises",
      icon: <FiBriefcase />,
    },
    {
      key: "Employees",
      path: "employees",
      label: "Employees",
      icon: <FiUserCheck />,
    },
    { key: "Products", path: "products", label: "Products", icon: <FiBox /> },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (location.pathname === "/admin" || location.pathname === "/admin/") {
        for (let route of accessibleRoutes) {
          if (hasAccess(route.key)) {
            navigate(route.path, { replace: true });
            break;
          }
        }
      }
    } else {
      navigate("/");
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col justify-between p-4 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <h1 className="text-xl font-bold mb-6">
            Welcome, {user?.name || "Admin"}
          </h1>

          <nav className="space-y-3">
            {accessibleRoutes.map(
              (route) =>
                hasAccess(route.key) && (
                  <Link
                    key={route.key}
                    to={route.path}
                    onClick={() => setSidebarOpen(false)} // close sidebar on click (mobile)
                    className="flex items-center gap-2 hover:text-green-400 transition"
                  >
                    {route.icon} {route.label}
                  </Link>
                )
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-6 text-white transition"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto w-full md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
