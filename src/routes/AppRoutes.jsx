import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Templates from "../pages/Templates";
import PricingPage from "../pages/PricingPage";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import Themes from "../pages/Themes";
import DemoPage from "../pages/DemoPage";
import Contact from "../pages/Contact";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Cart from "../pages/Cart";
import Checkout from "../pages/CheckOut";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminRoutes from "../admin/routes/AdminRoutes";


export default function AppRoutes() {
  return (
    <Routes>
      {/* FRONTEND ROUTES */}
      <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />  
      <Route path="about" element={<About />} />
      <Route path="templates" element={<Templates />} />
      {/* <Route path="pricingpage" element={<PricingPage />} /> */}
      {/* <Route path="blog" element={<Blog />} /> */}
      {/* <Route path="blogdetail" element={<BlogDetail />} /> */}
      <Route path="template/:id" element={<Themes />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />   
      <Route path="demo" element={<DemoPage />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />

      {/* PROTECTED: login required */}
      <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="check-out" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
       
      </Route>
       
      {/* ADMIN ROUTES */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}