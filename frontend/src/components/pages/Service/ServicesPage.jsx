import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

const API = "http://localhost:5000/api/services";

export default function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/getAllServices`).then((res) => {
      setServices(res.data.data || []);
    });
  }, []);

  const renderIcon = (name) => {
    const Icon = Icons[name] || Icons.Code;
    return <Icon size={20} />;
  };

  const categories = [
    "All",
    ...new Set(services.map((s) => s.category?.name || "General")),
  ];

  const filtered = services
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => category === "All" || s.category?.name === category);

  const finalData =
    sortBy === "name"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      : filtered;

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[#081638] text-white px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* HERO HEADER */}
          <div className="relative text-center mb-14 pt-8 md:pt-18">
            <div className="absolute inset-0 flex justify-center">
              <div className="w-[400px] h-[200px] bg-[#2563EB]/20 blur-3xl rounded-full pointer-events-none" />
            </div>
            <h1 className="relative text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#38BDF8] via-white to-[#7C3AED] bg-clip-text text-transparent">
              Explore Our Services
            </h1>
            <p className="relative text-gray-400 mt-4 max-w-xl mx-auto text-lg">
              Powerful digital solutions designed to scale your business with
              cutting-edge technology
            </p>
            <div className="relative flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Icons.CheckCircle size={14} className="text-[#38BDF8]" />{" "}
                {services.length}+ Services
              </span>
              <span className="flex items-center gap-1.5">
                <Icons.Star size={14} className="text-[#38BDF8]" /> Top Rated
              </span>
              <span className="flex items-center gap-1.5">
                <Icons.Zap size={14} className="text-[#38BDF8]" /> Fast Delivery
              </span>
            </div>
          </div>

          {/* SEARCH + FILTER BAR */}
          <div className="bg-[#020617]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 mb-12 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="w-full md:w-[350px] relative">
                <input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#020617] border border-white/10 focus:border-[#38BDF8] outline-none text-sm transition"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Icons.Search size={15} />
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-end flex-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      category === cat
                        ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md"
                        : "bg-[#020617] border border-white/10 text-gray-400 hover:text-white hover:border-[#38BDF8]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#020617] border border-white/10 text-gray-400 text-sm rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-[#38BDF8] transition"
              >
                <option value="default">Default</option>
                <option value="name">A–Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {search || category !== "All" ? (
            <p className="text-sm text-gray-400 mb-6">
              Showing{" "}
              <span className="text-white font-medium">{finalData.length}</span>{" "}
              service{finalData.length !== 1 ? "s" : ""}
              {category !== "All" && (
                <>
                  {" "}
                  in <span className="text-[#38BDF8]">{category}</span>
                </>
              )}
              {search && (
                <>
                  {" "}
                  for "<span className="text-white">{search}</span>"
                </>
              )}
            </p>
          ) : null}

          {/* GRID */}
          {finalData.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Icons.SearchX size={40} className="mx-auto mb-3 opacity-40" />
              <p>No services found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalData.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="relative group rounded-2xl overflow-hidden bg-[#020617]/60 border border-white/10 hover:border-[#38BDF8]/50 transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/services/${s._id}`)}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-[#2563EB]/10 to-[#7C3AED]/10 pointer-events-none" />

                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={s.image}
                      className="w-full h-44 object-cover group-hover:scale-105 transition duration-500"
                      alt={s.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 text-xs bg-black/40 backdrop-blur-sm border border-white/20 text-white px-2.5 py-1 rounded-full">
                      {s.category?.name}
                    </span>
                  </div>

                  <div className="p-5 relative z-10">
                    {/* Icon + Price */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center">
                        {renderIcon(s.icon)}
                      </div>
                      {s.price && (
                        <span className="text-xs bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 px-2.5 py-1 rounded-md font-medium">
                          {s.price}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold group-hover:text-[#38BDF8] transition line-clamp-1">
                      {s.name}
                    </h3>

                    {/* Short Desc */}
                    <p className="text-gray-400 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                      {s.shortDescription}
                    </p>

                    {/* Features Preview */}
                    <div className="mt-3 space-y-1">
                      {s.features?.slice(0, 2).map((f, i) => (
                        <div
                          key={i}
                          className="text-xs text-gray-500 flex gap-2"
                        >
                          <span className="text-[#38BDF8] flex-shrink-0">
                            ✔
                          </span>
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-600 group-hover:text-gray-400 transition">
                        Click to explore
                      </span>
                      <span className="text-sm text-[#38BDF8] opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        View Details <Icons.ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
