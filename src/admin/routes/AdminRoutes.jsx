import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../context/AdminAuthContext";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import AdminLogin from "../pages/AdminLogin";
import AddTemplate from "../pages/Templates/AddTemplate";
import ManageTemplates from "../pages/Templates/ManageTemplates";
import ManagePricing from "../pages/Pricing/ManagePricing";
import ManageUsers from "../pages/Users/ManageUsers";
import ManageContent from "../pages/ManageContent";
import Setting from "../pages/Setting";
import ManageChats from "../pages/Chats/ManageChats";
import ManageReviews from "../pages/Reviews/ManageReviews";
import ManageContact from "../pages/contact/ManageContact";

/* Protected Route — context-based */
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAdminAuth();
  if (loading) return null;
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="add-template" element={<AddTemplate />} />
          <Route path="manage-templates" element={<ManageTemplates />} />
          <Route path="manage-pricing" element={<ManagePricing />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="manage-content" element={<ManageContent />} />
          <Route path="setting" element={<Setting />} />
          <Route path="manage-chats" element={<ManageChats />} />
          <Route path="manage-reviews" element={<ManageReviews />} />
          <Route path="manage-contact" element={<ManageContact />} />  
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}