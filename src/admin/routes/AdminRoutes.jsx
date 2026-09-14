import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../context/AdminAuthContext";
import AdminLayout from "../layouts/AdminLayout";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AddTemplate = lazy(() => import("../pages/Templates/AddTemplate"));
const ManageTemplates = lazy(() => import("../pages/Templates/ManageTemplates"));
const ManagePricing = lazy(() => import("../pages/Pricing/ManagePricing"));
const ManageUsers = lazy(() => import("../pages/Users/ManageUsers"));
const ManageContent = lazy(() => import("../pages/ManageContent"));
const Setting = lazy(() => import("../pages/Setting"));
const ManageChats = lazy(() => import("../pages/Chats/ManageChats"));
const ManageReviews = lazy(() => import("../pages/Reviews/ManageReviews"));
const ManageContact = lazy(() => import("../pages/contact/ManageContact"));
const ManageBlogs = lazy(() => import("../pages/Blogs/ManageBlogs"));
const ManageNewsletter = lazy(() => import("../pages/Newsletter/ManageNewsletter"));

function AdminPageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-[var(--admin-accent)]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="fontStyle9 text-[var(--admin-muted)]">Loading...</p>
      </div>
    </div>
  );
}

/* Protected Route — context-based */
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAdminAuth();
  if (loading) return null;
  return isLoggedIn ? children : <Navigate to="/batman/login" replace />;
}

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<AdminPageLoader />}>
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
            <Route path="manage-blogs" element={<ManageBlogs />} />
            <Route path="manage-newsletter" element={<ManageNewsletter />} />
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}