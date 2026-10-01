import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { pageLoaders } from "./pageLoaders";

const Home = lazy(pageLoaders["/"]);
const Templates = lazy(pageLoaders["/templates"]);
const About = lazy(pageLoaders["/about"]);
const NotFound = lazy(() => import("../pages/NotFound"));
const Blog = lazy(pageLoaders["/blog"]);
const BlogDetail = lazy(pageLoaders["/blog/:slug"]);
const Login = lazy(pageLoaders["/login"]);
const Signup = lazy(pageLoaders["/signup"]);
const ForgotPassword = lazy(pageLoaders["/forgotPassword"]);
const Themes = lazy(pageLoaders["/template/:slug"]);
const DemoPage = lazy(pageLoaders["/demo"]);
const Contact = lazy(pageLoaders["/contact"]);
const PrivacyPolicy = lazy(pageLoaders["/privacy-policy"]);
const Cart = lazy(pageLoaders["/cart"]);
const Checkout = lazy(pageLoaders["/check-out"]);
const Profile = lazy(pageLoaders["/profile"]);
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute"));
const AdminRoutes = lazy(() => import("../admin/routes/AdminRoutes"));

export default function AppRoutes() {
  return (
    <Routes>
      {/* Page chunks suspend inside MainLayout so navbar/footer stay mounted */}
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
  );
}
