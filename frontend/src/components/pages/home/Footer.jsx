import { MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { MessageCircle, Briefcase } from "lucide-react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
const quickLinks = [
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Pricing", path: "/pricing" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/service-policy" },
  { name: "Cookies Policy", path: "/cookies" },
];


  return (
    <footer className="relative bg-[#020617] text-gray-300 pt-14 pb-8 overflow-hidden">
      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] bg-purple-600 blur-[140px]"></div>
        <div className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] bg-blue-500 blur-[140px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* 🔥 FOOTER ADVERTISEMENT (TOP CTA) */}
        <div className="mb-14">
          <div
            className="relative bg-gradient-to-r from-[#5872ab] via-[#4F46E5] to-[#7C3AED] 
    rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-30 blur-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-2xl"></div>

            {/* LEFT CONTENT */}
            <div className="relative z-10 max-w-xl text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                   Build Your Digital Product with Experts
              </h3>

              <p className="text-white/80 mt-2 text-sm sm:text-base">
                Get high-quality websites, apps, and software solutions tailored
                to your business. Start your project today with SRJ Global
                Technologies.
              </p>
            </div>

            {/* RIGHT CTA */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* PRIMARY CTA */}
              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/918357965638?text=Hello, I want to build a project",
                    "_blank",
                  )
                }
                className="px-6 py-3 rounded-xl bg-white text-[#1E293B] font-semibold hover:scale-105 transition"
              >
                Get Free Quote
              </button>

              {/* SECONDARY CTA */}
              <button
                onClick={() => (window.location.href = "/pricing")}
                className="px-6 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* 🏢 COMPANY */}
          <div className=" ">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} className="w-16 h-16 object-contain" />
              <h2 className="text-2xl font-bold text-white leading-tight">
                SRJ GLOBAL <br />
                <span className="text-[#3B82F6]">TECHNOLOGIES</span>
              </h2>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Innovative digital solutions: we build high-quality websites,
              mobile apps, and e-commerce platforms for growing brands.
            </p>

            {/* 🌐 SOCIAL */}
            <div className="flex gap-1 mt-7">
              {[
                FaInstagram,
                FaPinterest,
                FaYoutube,
                FaFacebookF,
                FaXTwitter,
                FaLinkedinIn,
              ].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-full 
                  bg-white/5 border border-white/10 
                  hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-[#7C3AED]
                  hover:text-white transition duration-300 cursor-pointer hover:scale-110"
                >
                  <Icon size={15} />
                </div>
              ))}
            </div>
          </div>

          {/* 🔗 QUICK LINKS */}
          <div className="lg:pl-14">
            <h3 className="text-white font-semibold mb-5 text-lg">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {quickLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="hover:text-[#38BDF8] transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 GET IN TOUCH */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">
              Get In Touch
            </h3>

            <div className="space-y-4 text-sm">
              <p>
                Email:{" "}
                <span className="text-[#38BDF8]">
                  srjglobaltechnology@gmail.com
                </span>
              </p>

              <p>
                Phone: <br />
                <span className="text-[#38BDF8]">+91 96251 90448</span> <br />
                <span className="text-[#38BDF8]">+91 92667 06599</span>
              </p>

              <p className="flex gap-2">
                <MapPin size={16} className="mt-1 text-[#38BDF8]" />
                Urbtech Trade Center Tower,
                <br />
                C-1101 Noida Sector-132,
                <br />
                Uttar Pradesh 201304
              </p>
            </div>
          </div>

          {/* ⚖️ LEGAL */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">Legal</h3>

            <ul className="space-y-3 text-sm">
              {legalLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="hover:text-[#38BDF8] transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ⭐ REVIEW */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">Review Us</h3>

            <p className="text-sm text-gray-400 mb-5">
              Your feedback helps us improve and grow.
            </p>
            <button
              onClick={() =>
                window.open(
                  "https://www.google.com/search?q=SRJ+Global+Softech&ludocid=YOUR_PLACE_ID_HERE#lrd=0x0:0x0,1",
                  "_blank",
                )
              }
              className="bg-transparent border-1 backdrop-blur-2xl hover:bg-[#2563EB] px-5 py-3 rounded-xl text-white font-semibold w-full flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30 transition"
            >
              ⭐ Review us on Google
            </button>
          </div>
        </div>

        {/* 🔻 DIVIDER */}
        <div className="mt-14 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
          © 2026 SRJ Global Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
