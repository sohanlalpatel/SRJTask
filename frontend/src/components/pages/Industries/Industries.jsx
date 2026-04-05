import React, { useState } from "react";
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
} from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

export default function Industries() {
  const [active, setActive] = useState(7);
const [tab, setTab] = useState("overview");
const [showAll, setShowAll] = useState(false);
  const industries = [
    {
      id: 1,
      name: "Healthcare & Fitness",
      desc: "Build wellness with tech.",
      icon: <Heart />,
      content:
        "We develop HIPAA-compliant healthcare systems, fitness tracking apps, and telemedicine platforms that improve patient engagement and operational efficiency.",
      services: [
        "Telemedicine App Development",
        "Patient Management Systems",
        "Fitness Tracking Apps",
        "AI Health Analytics",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    },
    {
      id: 2,
      name: "Event & Ticketing",
      desc: "Manage events seamlessly.",
      icon: <Calendar />,
      content:
        "We create event management platforms, ticket booking systems, and real-time check-in solutions for large-scale events and conferences.",
      services: [
        "Event Booking Platforms",
        "QR Check-in Systems",
        "Seat Management",
        "Payment Integration",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
    },
    {
      id: 3,
      name: "Food & Beverage",
      desc: "Digitizing dining experiences.",
      icon: <Utensils />,
      content:
        "From restaurant apps to food delivery platforms, we help businesses streamline orders, manage inventory, and enhance customer experience.",
      services: [
        "Food Delivery Apps",
        "Restaurant POS Systems",
        "Online Ordering Systems",
        "Inventory Management",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    },
    {
      id: 4,
      name: "Ecommerce & Retail",
      desc: "Scalable retail solutions.",
      icon: <ShoppingCart />,
      content:
        "We build high-performance eCommerce platforms with secure payments, analytics dashboards, and seamless customer journeys.",
      services: [
        "Shopify / WooCommerce Stores",
        "Custom E-commerce Platforms",
        "Payment Gateway Integration",
        "Inventory Automation",
      ],
      image: "https://images.unsplash.com/photo-1515169067865-5387ec356754",
    },
    {
      id: 5,
      name: "Digital Marketing",
      desc: "Drive visibility and leads.",
      icon: <Megaphone />,
      content:
        "We provide data-driven marketing solutions including SEO, paid ads, and automation tools to maximize ROI.",
      services: [
        "SEO Optimization",
        "Google & Meta Ads",
        "Email Marketing Automation",
        "Analytics & Tracking",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
    },
    {
      id: 6,
      name: "Social Networking",
      desc: "Connect your audience.",
      icon: <Users />,
      content:
        "We develop scalable social platforms with real-time chat, content sharing, and engagement tools.",
      services: [
        "Social Media Apps",
        "Real-time Chat Systems",
        "Community Platforms",
        "Content Moderation Tools",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
    {
      id: 7,
      name: "Business Startup",
      desc: "Launch your startup fast.",
      icon: <Rocket />,
      content:
        "We help startups build MVPs, validate ideas, and scale products with modern tech stacks and cloud infrastructure.",
      services: [
        "MVP Development",
        "Startup Consultation",
        "Pitch Deck & UI Design",
        "Cloud Deployment",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    },
    {
      id: 8,
      name: "Enterprise Solutions",
      desc: "Robust enterprise systems.",
      icon: <Building2 />,
      content:
        "We deliver enterprise-grade ERP, CRM, and automation systems that streamline operations and improve scalability.",
      services: [
        "ERP Systems",
        "CRM Development",
        "Workflow Automation",
        "Cloud Infrastructure",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    },
    {
      id: 9,
      name: "Education & Learning",
      desc: "Smart learning platforms.",
      icon: <GraduationCap />,
      content:
        "We build e-learning platforms, LMS systems, and virtual classrooms for modern education.",
      services: [
        "LMS Development",
        "Online Course Platforms",
        "Live Class Integration",
        "Student Analytics",
      ],
      benefits: [
        "High scalability & performance",
        "Secure architecture",
        "User-friendly experience",
        "Future-ready tech stack",
      ],
      image: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b",
    },
  ];

  const activeData = industries.find((i) => i.id === active) || industries[0];

  return (
    <>
      <Navbar />
      <div className="bg-[#0B1220] text-white min-h-screen px-6 py-16">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
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
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`p-5 rounded-xl border cursor-pointer transition ${
                  active === item.id
                    ? "border-[#38BDF8] bg-[#020617]"
                    : "border-[#1e293b] bg-[#020617]/60 hover:border-[#38BDF8]"
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="text-[#38BDF8]">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          {/* ================= RIGHT CONTENT ================= */}
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
                    {activeData.services.map((s, i) => (
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

                {/* STATS (ALWAYS SHOW) */}
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
                <img src={activeData.image} className="rounded-xl shadow-xl" />

                <div className="absolute -bottom-5 -left-5 bg-[#020617] border border-[#1e293b] px-4 py-2 rounded-lg text-sm shadow-lg">
                  🚀 Scalable Solutions
                </div>

                <div className="absolute -top-5 -right-5 bg-[#020617] border border-[#1e293b] px-4 py-2 rounded-lg text-sm shadow-lg">
                  ⚡ Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
