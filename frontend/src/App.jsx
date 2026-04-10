import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Components
import Home from "./components/pages/Home";
import FloatingContact from "./components/pages/home/FloatingContact";
import Services from "./components/pages/Service/ServicesPage";
import AboutPage from "./components/pages/About/AboutUsPage";
import AdminLogin from "./components/admin/adminlogin";
import { Dashbaord } from "./components/admin/Dashboard";
import Blogs from "./components/pages/Blogs/BlogPage";
import BlogDetail from "./components/pages/Blogs/BlogDetail";
import PricingFullPage from "./components/pages/Pricing/PricingFullPage";
import Industries from "./components/pages/Industries/Industries";
import ContactUs from "./components/pages/Contact/Contactus";
import ScrollToTop from "./components/pages/home/ScrollTotop";
import PrivacyPolicy from "./components/pages/home/PrivacyPolicy";
import ServiceDetail from "./components/pages/Service/ServiceDetail";
import ServicePolicy from "./components/pages/home/ServicePolicy";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

const AppContent = () => {
  const location = useLocation();

  // 🔥 hide rules
  const shouldHide = location.pathname.startsWith("/srj");

  return (
    <>
      <ScrollToTop />

      {/* ✅ SHOW ONLY NON-ADMIN */}
      {!shouldHide && <FloatingContact />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/pricing" element={<PricingFullPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* ADMIN ROUTES */}
        <Route path="/gs/admin/login" element={<AdminLogin />} />
        <Route path="/srj/panel/dashboard" element={<Dashbaord />} />
        <Route path="/service-policy" element={<ServicePolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
};
