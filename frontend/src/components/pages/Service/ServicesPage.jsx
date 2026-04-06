import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/services";

export default function Services() {
  const [services, setServices] = useState([]);
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  // ✅ Fetch
  useEffect(() => {
    axios.get(`${API}/getAllServices`).then((res) => {
      setServices(res.data.data || []);
    });
  }, []);

  // ✅ Icon
  const renderIcon = (name) => {
    const Icon = Icons[name] || Icons.Code;
    return <Icon size={20} />;
  };

  // ✅ Filter
  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Categories (auto)
 const categories = [
   "All",
   ...new Set(services.map((s) => s.category?.name || "General")),
 ];

  const finalData =
    category === "All"
      ? filtered
      : filtered.filter((s) => s.category?.name === category);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[#081638] text-white px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* HERO HEADER */}
          <div className="relative text-center mb-14 pt-8 md:pt-18  ">
            {/* Background Glow */}
            <div className="absolute inset-0 flex justify-center">
              <div className="w-[400px] h-[200px] bg-[#2563EB]/20 blur-3xl rounded-full"></div>
            </div>

            <h1 className="relative text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#38BDF8] via-white to-[#7C3AED] bg-clip-text text-transparent   animate-fadeIn">
              Explore Our Services
            </h1>

            <p className="relative text-gray-400 mt-4 max-w-xl mx-auto text-lg animate-fadeIn">
              Powerful digital solutions designed to scale your business with
              cutting-edge technology
            </p>
          </div>

          {/* SEARCH + FILTER BAR */}
          <div className="bg-[#020617]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 mb-12 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* SEARCH INPUT */}
              <div className="w-full md:w-[350px] relative">
                <input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#020617] border border-white/10 focus:border-[#38BDF8] outline-none text-sm"
                />

                {/* ICON */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  🔍
                </span>
              </div>

              {/* CATEGORY PILLS */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${
              category === cat
                ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md"
                : "bg-[#020617] border border-white/10 text-gray-400 hover:text-white hover:border-[#38BDF8]"
            }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalData.map((s, i) => (
              <motion.div
                key={s._id}
                whileHover={{ y: -8 }}
                className="relative group rounded-2xl overflow-hidden bg-[#020617]/60 backdrop-blur-xl border border-white/10 hover:border-[#38BDF8]/50 transition duration-300"
                onClick={() => setActive(s)}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#2563EB]/20 to-[#7C3AED]/20 blur-xl"></div>

                {/* Image */}
                <img src={s.image} className="w-full h-44 object-cover" />

                <div className="p-5 relative z-10">
                  {/* ICON + PRICE */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[#38BDF8]">{renderIcon(s.icon)}</div>

                    {s.price && (
                      <span className="text-xs bg-[#38BDF8]/10 text-[#38BDF8] px-2 py-1 rounded">
                        {s.price}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-semibold group-hover:text-[#38BDF8]">
                    {s.name}
                  </h3>

                  {/* SHORT DESC */}
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                    {s.shortDescription}
                  </p>

                  {/* FEATURES PREVIEW */}
                  <div className="mt-3 space-y-1">
                    {s.features?.slice(0, 2).map((f, i) => (
                      <div key={i} className="text-xs text-gray-500 flex gap-2">
                        ✔ {f}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-[#38BDF8] opacity-0 group-hover:opacity-100 transition">
                    View Details →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* MODAL */}
          {/* {active && (
            <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#020617] max-w-2xl w-full p-6 rounded-xl border border-[#1e293b]"
              >
                <button
                  onClick={() => setActive(null)}
                  className="float-right text-gray-400"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4">{active.name}</h2>

                {active.image && (
                  <img
                    src={`http://localhost:5000${active.image}`}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}

                <p className="text-gray-300 mb-4">{active.description}</p>

                {/* FEATURES 
                <ul className="space-y-2">
                  {active.features?.map((f, i) => (
                    <li key={i} className="text-gray-400">
                      ✔ {f}
                    </li>
                  ))}
                </ul>

                {/* PRICE 
                {active.price && (
                  <div className="mt-4 text-xl text-[#38BDF8]">
                    ₹ {Number(active.price).toLocaleString("en-IN")}
                  </div>
                )}

                <button className="mt-6 w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 rounded">
                  Get Started
                </button>
              </motion.div>
            </div>
          )} */}

          {active && (
            <div className="fixed inset-0 z-50 flex">
              {/* LEFT OVERLAY */}
              <div
                className=" bg-black/70 backdrop-blur-sm"
                onClick={() => setActive(null)}
              ></div>

              {/* RIGHT PANEL (50% SCREEN) */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.4 }}
                className="w-full md:w-full h-full bg-[#020617] border-l border-white/10 p-8 overflow-y-auto"
              >
                {/* CLOSE */}
                <button
                  onClick={() => setActive(null)}
                  className="text-gray-400 mb-6 hover:text-white"
                >
                  ✕ Close
                </button>

                {/* IMAGE */}
                <div className="relative mb-6">
                  <img
                    src={active.image}
                    className="w-full h-56 object-cover rounded-xl"
                  />

                  {/* CATEGORY BADGE */}
                  <span className="absolute top-3 left-3 bg-[#38BDF8]/20 text-[#38BDF8] px-3 py-1 text-xs rounded-full">
                    {active.category?.name}{" "}
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="text-3xl font-bold mb-2">{active.name}</h2>
                {active.price && (
                  <div className="mb-6 bg-[#020617] border border-white/10 p-4 rounded-xl">
                    <h4 className="text-sm text-gray-400 mb-1">
                      Starting Price
                    </h4>
                    <p className="text-2xl font-bold text-[#38BDF8]">
                      {active.price}
                    </p>
                  </div>
                )}
                {/* SHORT DESC */}
                <p className="text-gray-400 mb-6">{active.shortDescription}</p>

                {/* DESCRIPTION */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {active.description}
                  </p>
                </div>

                {/* FEATURES */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">What You Get</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {active.features?.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-[#020617] border border-white/10 p-3 rounded-lg"
                      >
                        <span className="text-green-400">✔</span>
                        <span className="text-gray-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TRUST SECTION */}
                <div className="mb-6 grid grid-cols-3 text-center gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-[#38BDF8]">100+</h4>
                    <p className="text-gray-400 text-xs">Projects</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-[#38BDF8]">24/7</h4>
                    <p className="text-gray-400 text-xs">Support</p>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-[#38BDF8]">Fast</h4>
                    <p className="text-gray-400 text-xs">Delivery</p>
                  </div>
                </div>

                {/* CTA BUTTONS */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/pricing")}
                    className="w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    Start Project
                  </button>

                  <button
                    onClick={() => navigate("/contact")}
                    className="w-full border border-white/10 py-3 rounded-xl hover:border-[#38BDF8] transition"
                  >
                    Talk to Expert
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
