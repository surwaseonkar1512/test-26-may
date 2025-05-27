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
import AdminLayout from "./Components/Auth/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      {" "}
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="enterprises" element={<Enterprises />} />
            <Route path="employees" element={<Employees />} />
            <Route path="products" element={<ProductManagement />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
