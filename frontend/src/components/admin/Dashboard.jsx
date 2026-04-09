import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Newspaper,
  Briefcase,
  MessageCircle,
  Building2,
  ListOrdered,
} from "lucide-react";
import ServiceManager from "./Servicemanager";
import logo from "../../assets/dd.png"
import BlogManager from "./BlogManager";
import PricingManager from "./PricingManager";
import { FaMoneyBill } from "react-icons/fa";
import AdminContact from "./Contacttable";
import Industries from "../pages/Industries/Industries";
import IndustryManager from "./IndustryManager";
import AdminEnquiries from "./Adminenquiries";
import { FaServicestack } from "react-icons/fa6";
import AdminOrders from "./Adminorders";
 
export function Dashbaord() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({ Dashboard: false });
  // const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeView, setActiveView] = useState("Dashboard");
 
  
  useEffect(() => {
    const adminUser = sessionStorage.getItem("admin");

    if (!adminUser) {
      navigate("/srj/panel/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    navigate("/");
  };

  useEffect(() => {
    const redirectHome = () => {
      sessionStorage.clear();
      navigate("/", { replace: true });
    };

    // On first load, push dummy state to catch back button
    window.history.pushState(null, "", window.location.href);

    // Run ONLY when user presses Browser BACK button
    const handleBackButton = () => {
      redirectHome();
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  // ✅ Reload ke baad last active tab restore karna
  useEffect(() => {
    const savedView = sessionStorage.getItem("activeView");
    if (savedView) {
      setActiveView(savedView); // agar kuch save hai to wahi open hoga
    } else {
      setActiveView("Dashboard"); // first time ya sessionStorage empty ho
    }
  }, []);

  // ✅ Jab bhi activeView change ho, usko sessionStorage me save karna
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("activeView", activeView);
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // cleanup on unmount or state change
  }, [activeView]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(true);
      }
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#0F172A]">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 bg-opacity-50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col bg-[#0F172A] border-[#1E293B] border-r  shadow-lg transition-all duration-300 lg:relative lg:translate-x-0 ${
          collapsed ? "w-16" : "w-64"
        } ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer   text-white"
            >
              <img src={logo} alt="" />{" "}
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F8FAFC]">
                 Gaming & Software Solutions
                </span>
                <span className="text-xs text-gray-400">Admin Management</span>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3">
            {!collapsed && (
              <div className="mb-2 px-4 py-2 text-xs font-semibold uppercase text-gray-500">
                Navigation
              </div>
            )}
            <nav className="space-y-1  ">
              {[
                { label: "Service Enquiry", icon: FaServicestack },
                { label: "Service Orders", icon: ListOrdered },
                { label: "Blogs Manager", icon: Newspaper },
                { label: "Services", icon: Briefcase },
                { label: "Pricing", icon: FaMoneyBill },
                { label: "Industry", icon: Building2 },
                { label: "Contact form query", icon: MessageCircle },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveView(label);
                    closeMobileMenu();
                  }}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer 
      ${
        activeView === label
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      collapsed ? "mx-auto" : "mr-3"
                    } flex-shrink-0`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate text-left">{label}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sidebar User Footer
        <div className="relative border-t border-gray-200 p-4">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex w-full items-center gap-3 rounded-lg py-2 text-left text-sm hover:bg-gray-50 transition-colors"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Dr. Sarah Johnson"
                className="h-full w-full object-cover"
              />
            </div>
            {!collapsed && (
              <>
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="font-medium text-gray-900 truncate">Dr. Sarah Johnson</span>
                  <span className="text-xs text-gray-500 truncate">Administrator</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </>
            )}
          </button>

          {userDropdownOpen && !collapsed && (
            <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <a
                href="/logout"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </a>
            </div>
          )}
        </div> */}

        {/* Desktop Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              collapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </aside>

      {/* Main Content with Navbar */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300  min-w-0`}
      >
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-#2563EB px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="md:text-lg font-semibold text-white truncate">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="hover:cursor-pointer flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1  sm:p- bg-gray-50 overflow-y-auto">
          {activeView === "Service Enquiry" && <AdminEnquiries />}
          {activeView === "Service Orders" && < AdminOrders />}
          {activeView === "Blogs Manager" && <BlogManager />}
          {activeView === "Services" && <ServiceManager />}
          {activeView === "Pricing" && <PricingManager />}
          {activeView === "Industry" && <IndustryManager />}
          {activeView === "Contact form query" && <AdminContact />}
        </main>
      </div>
    </div>
  );
}
