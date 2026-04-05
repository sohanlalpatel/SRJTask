import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
//  import Services from "./pages/Services";
// import Projects from "./pages/Projects";
// import Contact from "./pages/Contact";

// Components
 import Home from "./components/pages/Home";
import Navbar from "./components/pages/home/Navbar";
import FloatingContact from "./components/pages/home/FloatingContact";
import Services from "./components/pages/Service/ServicesPage";
import AboutPage from "./components/pages/About/AboutUsPage";
import Footer from "./components/pages/home/Footer";
import AdminLogin from "./components/admin/adminlogin";
import { Dashbaord } from "./components/admin/Dashboard";
import Blogs from "./components/pages/Blogs/BlogPage";
import BlogDetail from "./components/pages/Blogs/BlogDetail";
import PricingPage from "./components/pages/Pricing/PricingPage";
import PricingFullPage from "./components/pages/Pricing/PricingFullPage";
import Industries from "./components/pages/Industries/Industries";
import ContactUs from "./components/pages/Contact/Contactus";
import ScrollToTop from "./components/pages/home/ScrollTotop";
import PrivacyPolicy from "./components/pages/home/PrivacyPolicy";
 // import CustomCursor from "./components/pages/CustomCursor";
// import Footer from "./components/Footer";
 
const App = () => {
  return (
    <Router>
      {/* Global Navbar */}
      <ScrollToTop />
      <FloatingContact />
      {/* <CustomCursor /> */}
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/pricing" element={<PricingFullPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/srj/admin/login" element={<AdminLogin />} />
        <Route path="/srj/panel/dashboard" element={<Dashbaord />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>

      {/* Global Footer */}
    </Router>
  );
};

export default App;
