import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  Utensils,
  ShoppingCart,
  Megaphone,
  Users,
  Rocket,
  Building2,
  GraduationCap,
  Loader2,
} from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

// ================= ICON MAP =================
const iconMap = {
  Heart: <Heart />,
  Calendar: <Calendar />,
  Utensils: <Utensils />,
  ShoppingCart: <ShoppingCart />,
  Megaphone: <Megaphone />,
  Users: <Users />,
  Rocket: <Rocket />,
  Building2: <Building2 />,
  GraduationCap: <GraduationCap />,
};

const BASE_URL = "http://localhost:5000"; // change to your backend URL

export default function Industries() {
  const [industries, setIndustries] = useState([]);
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("overview");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/industries/getIndustries`);
        const json = await res.json();

        if (json.success) {
          setIndustries(json.data);
          // set first item as active by default
          if (json.data.length > 0) {
            setActive(json.data[0]._id);
          }
        } else {
          setError("Failed to load industries.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  const activeData = industries.find((i) => i._id === active) || null;

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#0B1220] text-white min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-[#38BDF8]">
            <Loader2 className="animate-spin w-10 h-10" />
            <p className="text-gray-400 text-sm">Loading industries...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <>
        <Navbar />
        <div className="bg-[#0B1220] text-white min-h-screen flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#0B1220] text-white min-h-screen pt-46 px-6 py-26">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
            Our Industrial Services
          </h1>
          <p className="text-gray-400">
            Explore our wide range of offerings tailored to modern businesses.
          </p>
        </div>

        {/* ================= MAIN ================= */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* ================= LEFT LIST ================= */}
          <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
            {industries.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  setActive(item._id);
                  setTab("overview");
                }}
                className={`p-5 rounded-xl border cursor-pointer transition ${
                  active === item._id
                    ? "border-[#38BDF8] bg-[#020617]"
                    : "border-[#1e293b] bg-[#020617]/60 hover:border-[#38BDF8]"
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="text-[#38BDF8]">
                    {iconMap[item.icon] || <Rocket />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          {activeData && (
            <div className="md:col-span-2 bg-[#020617] border border-[#1e293b] rounded-2xl p-8 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#0EA5E9]/10 blur-3xl rounded-full"></div>

              {/* HEADER */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full border border-[#38BDF8] flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#38BDF8] rounded-full"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#38BDF8]">
                  {activeData.name}
                </h2>
              </div>

              {/* TABS */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={() => setTab("overview")}
                  className={`px-5 py-2 rounded-full text-sm ${
                    tab === "overview"
                      ? "bg-[#38BDF8] text-black"
                      : "border border-[#38BDF8]"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setTab("services")}
                  className={`px-5 py-2 rounded-full text-sm ${
                    tab === "services"
                      ? "bg-[#38BDF8] text-black"
                      : "border border-[#38BDF8]"
                  }`}
                >
                  Services Provided
                </button>
                <button
                  onClick={() => setTab("benefits")}
                  className={`px-5 py-2 rounded-full text-sm ${
                    tab === "benefits"
                      ? "bg-[#38BDF8] text-black"
                      : "border border-[#38BDF8]"
                  }`}
                >
                  Benefits
                </button>
              </div>

              {/* ================= TAB CONTENT ================= */}
              <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* LEFT SIDE */}
                <div>
                  {/* OVERVIEW */}
                  {tab === "overview" && (
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {activeData.content}
                    </p>
                  )}

                  {/* SERVICES */}
                  {tab === "services" && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {(activeData.services || []).map((s, i) => (
                        <div
                          key={i}
                          className="bg-[#0B1220] border border-[#1e293b] px-3 py-2 rounded-lg text-sm"
                        >
                          ✔ {s}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* BENEFITS */}
                  {tab === "benefits" && (
                    <div className="space-y-3 mb-6">
                      {(activeData.benefits || []).map((b, i) => (
                        <div
                          key={i}
                          className="bg-[#0B1220] border border-[#1e293b] px-4 py-3 rounded-lg text-sm"
                        >
                          ⭐ {b}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-4 text-center mt-6">
                    <div className="bg-[#0B1220] p-4 rounded-xl border border-[#1e293b]">
                      <p className="text-xl font-bold text-[#38BDF8]">120+</p>
                      <p className="text-xs text-gray-400">Projects</p>
                    </div>
                    <div className="bg-[#0B1220] p-4 rounded-xl border border-[#1e293b]">
                      <p className="text-xl font-bold text-green-400">98%</p>
                      <p className="text-xs text-gray-400">Success</p>
                    </div>
                    <div className="bg-[#0B1220] p-4 rounded-xl border border-[#1e293b]">
                      <p className="text-xl font-bold text-yellow-400">5★</p>
                      <p className="text-xs text-gray-400">Rating</p>
                    </div>
                  </div>

                  {/* BACK BUTTON */}
                  <button
                    onClick={() => {
                      setShowAll(true);
                      setTab("overview");
                    }}
                    className="mt-6 border border-[#38BDF8] px-6 py-2 rounded-full hover:bg-[#38BDF8] hover:text-black transition"
                  >
                    ← Back to All Industrial Services
                  </button>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative">
                  <img
                    src={
                      activeData.image?.startsWith("/uploads")
                        ? `${BASE_URL}${activeData.image}`
                        : activeData.image
                    }
                    alt={activeData.name}
                    className="rounded-xl shadow-xl"
                  />
                  <div className="absolute -bottom-5 -left-5 bg-[#020617] border border-[#1e293b] px-4 py-2 rounded-lg text-sm shadow-lg">
                    🚀 Scalable Solutions
                  </div>
                  <div className="absolute -top-5 -right-5 bg-[#020617] border border-[#1e293b] px-4 py-2 rounded-lg text-sm shadow-lg">
                    ⚡ Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
