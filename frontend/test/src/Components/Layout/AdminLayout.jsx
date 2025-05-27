import React from "react";
import { Link, Outlet } from "react-router-dom";
import { hasAccess } from "../../../utils/permissionUtils"; // Adjust path as needed

function AdminLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
        <nav className="space-y-2">
          {hasAccess("Dashboards") && (
            <Link to="/dashboard" className="block">
              Dashboard
            </Link>
          )}
          {hasAccess("Users") && (
            <Link to="/users" className="block">
              Users
            </Link>
          )}
          {hasAccess("Roles") && (
            <Link to="/roles" className="block">
              Roles
            </Link>
          )}
          {hasAccess("Enterprises") && (
            <Link to="/enterprises" className="block">
              Enterprises
            </Link>
          )}
          {hasAccess("Employees") && (
            <Link to="/employees" className="block">
              Employees
            </Link>
          )}
          {hasAccess("Products") && (
            <Link to="/products" className="block">
              Products
            </Link>
          )}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
