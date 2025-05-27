// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Enterprises from "./pages/Enterprises";
import LoginPage from "./Components/Auth/LoginPage";
import Employees from "./pages/Employees";
import ProductManagement from "./pages/ProductManagement";
import AdminLayout from "./Components/layout/AdminLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="enterprises" element={<Enterprises />} />
          <Route path="employees" element={<Employees />} />
          <Route path="products" element={<ProductManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
