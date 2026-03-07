import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import AdminLogin from "../pages/AdminLogin";
import AddTemplate from "../pages/Templates/AddTemplate";
import ManageTemplates from "../pages/Templates/ManageTemplates";
import ManagePricing from "../pages/Pricing/ManagePricing";
import ManageUsers from "../pages/Users/ManageUsers";
import ManageContent from "../pages/ManageContent";

/* Protected Route */
function ProtectedRoute({ children }) {
  const isAuthenticated = !!sessionStorage.getItem("admin");
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function AdminRoutes() {
  return (
    <Routes>

      <Route path="login" element={<AdminLogin />} />
      <Route path="/" element={ <ProtectedRoute> <AdminLayout /> </ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="add-template" element={<AddTemplate />} />
        <Route path="manage-templates" element={<ManageTemplates />} />
        <Route path="manage-pricing" element={<ManagePricing />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="manage-content" element={<ManageContent />} />
      </Route>

    </Routes>
  );
}   