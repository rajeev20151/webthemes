import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const Home = lazy(() => import("../pages/Home"));
const Templates = lazy(() => import("../pages/Templates"));
const About = lazy(() => import("../pages/About"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Blog = lazy(() => import("../pages/Blog"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Themes = lazy(() => import("../pages/Themes"));
const DemoPage = lazy(() => import("../pages/DemoPage"));
const Contact = lazy(() => import("../pages/Contact"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/CheckOut"));
const Profile = lazy(() => import("../pages/Profile"));
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute"));
const AdminRoutes = lazy(() => import("../admin/routes/AdminRoutes"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color5)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[var(--color6)]/20 border-t-[var(--color6)] rounded-full animate-spin" />
        <p className="fontStyle9 text-[var(--color4)]">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="templates" element={<Templates />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="template/:slug" element={<Themes />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="demo" element={<DemoPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="check-out" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
        <Route path="/batman/*" element={<AdminRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
