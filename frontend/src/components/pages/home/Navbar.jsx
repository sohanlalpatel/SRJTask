import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../../assets/logo1.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "SERVICE", path: "/services" },
    { name: "ABOUT", path: "/about" },
    { name: "INDUSTRIES", path: "/industries" },
    { name: "BLOG", path: "/blogs" },
    { name: "PRICING", path: "/pricing" },
  ];

  // 🔥 Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-5 "
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-full overflow-hidden transition duration-300 group-hover:scale-110">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>

          <div>
            <h1
              className={`font-bold transition ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              SRJ GLOBAL
            </h1>
            <p className="text-xs text-blue-500 font-semibold">TECHNOLOGIES</p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, i) => (
            <NavLink key={i} to={link.path}>
              {({ isActive }) => (
                <div
                  className={`relative px-3 py-2 transition-all duration-300 cursor-pointer
          ${isActive ? "text-blue-600" : scrolled ? "text-gray-700" : "text-white"}
          hover:-translate-y-1 hover:scale-105 hover:text-blue-600`}
                >
                  {link.name}

                  {/* Active Dot */}
                  {isActive && (
                    <span className="absolute left-1/2 -bottom-2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2"></span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* CTA BUTTON */}
        <div className="hidden md:block">
          <Link to="/contact">
            <button className="relative px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold overflow-hidden group">
              <span className="relative z-10">Contact Us</span>

              {/* Glow Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition duration-300 blur-xl"></span>
            </button>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X size={28} className={scrolled ? "text-black" : "text-white"} />
            ) : (
              <Menu
                size={28}
                className={scrolled ? "text-black" : "text-white"}
              />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-500 ${
          isOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="bg-white backdrop-blur-lg px-6 py-4 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              {link.name}
            </NavLink>
          ))}

          <Link to="/contact">
            <button className="bg-blue-600 text-white py-2 rounded-lg mt-2">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
