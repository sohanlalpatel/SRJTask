import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import ServiceEnquiryModal from "./ServiceEnquiryModal";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    axios.get(`${API}/api/services/getServiceById/${id}`).then((res) => {
      const svc = res.data.data;
      setService(svc);
      // Fetch similar services by same category
      axios
        .get(`${API}/api/services/getAllServices`)
        .then((r) => {
          const all = r.data.data || [];
          const sim = all
            .filter(
              (s) =>
                s._id !== svc._id && s.category?.name === svc.category?.name,
            )
            .slice(0, 4);
          setSimilar(sim);
        })
        .finally(() => setLoading(false));
    });
  }, [id]);

  const renderIcon = (name) => {
    const Icon = Icons[name] || Icons.Code;
    return <Icon size={18} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#081638] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#38BDF8]/30 border-t-[#38BDF8] animate-spin" />
          <p className="text-gray-400 text-sm">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#081638] flex items-center justify-center text-white">
        Service not found.
      </div>
    );
  }

  const tabs = ["overview", "features", "process", "faqs"];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#081638] text-white">
        {/* ── HERO BANNER ── */}
        <div className="relative h-[380px] md:h-[440px]     overflow-hidden">
          <img
            src={`${API}${service.image}`}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#081638] via-[#081638]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081638]/80 to-transparent" />

          {/* Breadcrumb */}
          {/* <div className="absolute top-24 left-6 md:left-16 flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white transition">
              Services
            </Link>
            <span>/</span>
            <span className="text-[#38BDF8]">{service.name}</span>
          </div> */}

          {/* Hero Content */}
          <div className="absolute bottom-10 left-6 md:left-39  ">
            <span className="inline-block mb-3 px-3 py-1 bg-[#38BDF8]/20 text-[#38BDF8] text-xs rounded-full border border-[#38BDF8]/30">
              {service.category?.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
              {service.name}
            </h1>
            <p className="text-gray-300 text-base md:text-lg line-clamp-2 max-w-lg">
              {service.shortDescription}
            </p>
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT: CONTENT ── */}
          <div className="lg:col-span-2">
            {/* Tab Bar */}
            <div className="flex gap-1 mb-8 bg-[#020617]/60 border border-white/10 rounded-xl p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-max px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      About This Service
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-base mb-8">
                      {service.description ||
                        "We provide premium digital solutions tailored to your business needs. Our team ensures top-quality delivery with modern technology stacks."}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: "Projects Done", value: "200+" },
                        { label: "Happy Clients", value: "150+" },
                        { label: "Support", value: "24/7" },
                        { label: "Delivery", value: "On-Time" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="bg-[#020617]/60 border border-white/10 rounded-xl p-4 text-center"
                        >
                          <p className="text-2xl font-bold text-[#38BDF8]">
                            {s.value}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Technologies Used */}
                    {service.technologies?.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3">
                          Technologies We Use
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-sm rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-bold mb-6">What You Get</h2>
                      {service.features?.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {service.features.map((f, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start gap-3 bg-[#020617]/60 border border-white/10 hover:border-[#38BDF8]/40 transition p-4 rounded-xl"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                ✓
                              </span>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {f}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No features listed.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* FEATURES TAB */}
                {activeTab === "features" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">What You Get</h2>
                    {service.features?.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {service.features.map((f, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 bg-[#020617]/60 border border-white/10 hover:border-[#38BDF8]/40 transition p-4 rounded-xl"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                              ✓
                            </span>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {f}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No features listed.</p>
                    )}
                  </div>
                )}

                {/* PROCESS TAB */}
                {activeTab === "process" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">
                      Our Work Process
                    </h2>
                    <div className="space-y-4">
                      {(
                        service.process || [
                          {
                            step: "Discovery",
                            desc: "We understand your goals, target audience, and requirements through detailed consultation.",
                          },
                          {
                            step: "Planning",
                            desc: "We create a detailed roadmap, wireframes, and project timeline for your approval.",
                          },
                          {
                            step: "Development",
                            desc: "Our expert team builds your solution using best-in-class technology and practices.",
                          },
                          {
                            step: "Testing",
                            desc: "Rigorous QA testing across devices and scenarios before any launch.",
                          },
                          {
                            step: "Launch",
                            desc: "Smooth deployment with post-launch support and monitoring included.",
                          },
                        ]
                      ).map((p, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {i + 1}
                            </div>
                            {i < 4 && (
                              <div className="w-0.5 h-full bg-white/10 mt-2" />
                            )}
                          </div>
                          <div className="pb-6">
                            <h4 className="font-semibold text-base mb-1">
                              {p.step}
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {p.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQS TAB */}
                {activeTab === "faqs" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                      {(
                        service.faqs || [
                          {
                            q: "How long does it take to complete?",
                            a: "Timelines vary by project scope. Typically 2–8 weeks for most engagements.",
                          },
                          {
                            q: "Do you provide ongoing support?",
                            a: "Yes, we offer 24/7 post-launch support and maintenance packages.",
                          },
                          {
                            q: "Can I request custom features?",
                            a: "Absolutely. We specialize in custom solutions tailored to your exact needs.",
                          },
                          {
                            q: "What is your payment structure?",
                            a: "We follow a milestone-based payment model — 50% upfront, 50% on delivery.",
                          },
                        ]
                      ).map((faq, i) => (
                        <FAQItem key={i} q={faq.q} a={faq.a} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: STICKY SIDEBAR ── */}
          <div className="space-y-5">
            {/* Price Card */}
            <div className="bg-[#020617]/80 border border-white/10 rounded-2xl overflow-hidden sticky top-24">
              <div className="p-6 border-b border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                  Starting From
                </p>
                <p className="text-4xl font-bold text-[#38BDF8]">
                  {service.price || "Custom"}
                </p>
                {service.priceNote && (
                  <p className="text-xs text-gray-500 mt-1">
                    {service.priceNote}
                  </p>
                )}
              </div>

              <div className="p-6 space-y-3">
                {/* TOP ROW - 2 BUTTONS SIDE BY SIDE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* GET SERVICE */}
                  <button
                    onClick={() => setShowEnquiry(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition"
                  >
                    Get This Service
                  </button>

                  {/* NEW PRICING BUTTON 🔥 */}
                  <button
                    onClick={() => navigate("/pricing")}
                    className="w-full py-3.5 bg-[#020617] border border-[#38BDF8]/40 rounded-xl text-sm font-semibold text-[#38BDF8] hover:bg-[#38BDF8]/10 transition"
                  >
                    Get Pricing
                  </button>
                </div>

                {/* FULL WIDTH BUTTON */}
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full py-3.5 border border-white/10 rounded-xl text-sm hover:border-[#38BDF8]/50 transition"
                >
                  Talk to an Expert
                </button>
              </div>
              {/* Trust Badges */}
              <div className="px-6 pb-6 space-y-2.5">
                {[
                  { icon: "ShieldCheck", text: "100% Satisfaction Guarantee" },
                  { icon: "Clock", text: "On-Time Delivery Promise" },
                  { icon: "Headphones", text: "Dedicated Project Manager" },
                  { icon: "RefreshCw", text: "Free Revisions Included" },
                ].map((item) => {
                  const Icon = Icons[item.icon] || Icons.Check;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-2.5 text-sm text-gray-400"
                    >
                      <Icon
                        size={15}
                        className="text-[#38BDF8] flex-shrink-0"
                      />
                      {item.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Share */}
            <div className="bg-[#020617]/60 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-3">Share this service</p>

              <div className="flex flex-wrap gap-2">
                {/* TWITTER */}
                <button
                  onClick={() => {
                    const url = window.location.href;
                    const text = "Check out this service!";
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                      "_blank",
                    );
                  }}
                  className="flex-1 py-2 text-xs border border-white/10 rounded-lg hover:border-[#38BDF8]/40 transition text-gray-400 hover:text-white"
                >
                  Twitter
                </button>

                {/* LINKEDIN */}
                <button
                  onClick={() => {
                    const url = window.location.href;
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                      "_blank",
                    );
                  }}
                  className="flex-1 py-2 text-xs border border-white/10 rounded-lg hover:border-[#38BDF8]/40 transition text-gray-400 hover:text-white"
                >
                  Linkedin
                </button>

                {/* FACEBOOK */}
                <button
                  onClick={() => {
                    const url = window.location.href;
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                      "_blank",
                    );
                  }}
                  className="flex-1 py-2 text-xs border border-white/10 rounded-lg hover:border-[#38BDF8]/40 transition text-gray-400 hover:text-white"
                >
                  Facebook
                </button>

                {/* WHATSAPP ✅ */}
                <button
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out this service 👇\n${url}`;
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(text)}`,
                      "_blank",
                    );
                  }}
                  className="flex-1 py-2 text-xs border border-white/10 rounded-lg hover:border-green-400 transition text-gray-400 hover:text-green-400"
                >
                  WhatsApp
                </button>

                {/* INSTAGRAM ⚠️ */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied! Paste it on Instagram.");
                  }}
                  className="flex-1 py-2 text-xs border border-white/10 rounded-lg hover:border-pink-400 transition text-gray-400 hover:text-pink-400"
                >
                  Instagram
                </button>

                {/* COPY LINK */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                  }}
                  className="w-full mt-2 py-2 text-xs border border-[#38BDF8]/30 rounded-lg text-[#38BDF8]"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SIMILAR SERVICES ── */}
        {similar.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-[#38BDF8] uppercase tracking-widest mb-1">
                  Same Category · {service.category?.name}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Similar Services
                </h2>
              </div>
              <Link
                to="/services"
                className="text-sm text-gray-400 hover:text-[#38BDF8] transition border border-white/10 px-4 py-2 rounded-lg"
              >
                View All →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((s) => (
                <motion.div
                  key={s._id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/services/${s._id}`)}
                  className="group cursor-pointer bg-[#020617]/60 border border-white/10 hover:border-[#38BDF8]/40 rounded-2xl overflow-hidden transition duration-300"
                >
                  <div className="relative">
                    <img
                      src={`${API}${s.image}`}
                       alt={s.name}
                      className="w-full h-36 object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60" />
                    <span className="absolute top-2 left-2 text-xs bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20 px-2 py-0.5 rounded-full">
                      {s.category?.name}
                    </span>
                  </div>

                  <div className="p-4">
                    {/* Icon + Price */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[#38BDF8]">{renderIcon(s.icon)}</div>
                      {s.price && (
                        <span className="text-xs bg-[#38BDF8]/10 text-[#38BDF8] px-2 py-0.5 rounded-md">
                          {s.price}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-sm mb-1 group-hover:text-[#38BDF8] transition line-clamp-1">
                      {s.name}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {s.shortDescription}
                    </p>

                    <div className="mt-3 text-xs text-[#38BDF8] opacity-0 group-hover:opacity-100 transition">
                      Explore →
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CTA BANNER */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#2563EB]/20 to-[#7C3AED]/20 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-[500px] h-[200px] bg-[#7C3AED]/20 blur-[80px] rounded-full pointer-events-none" />
            </div>
            <h2 className="relative text-2xl md:text-4xl font-bold mb-3">
              Ready to Get Started?
            </h2>
            <p className="relative text-gray-400 mb-6 max-w-lg mx-auto">
              Tell us about your project and we'll get back to you within 24
              hours with a custom plan.
            </p>
            <button
              onClick={() => setShowEnquiry(true)}
              className="relative px-8 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-xl font-semibold hover:opacity-90 transition"
            >
              Request a Free Quote
            </button>
          </div>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      <AnimatePresence>
        {showEnquiry && (
          <ServiceEnquiryModal
            service={service}
            onClose={() => setShowEnquiry(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

// ── FAQ Accordion Item ──
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-[#020617]/60 border border-white/10 hover:border-[#38BDF8]/30 rounded-xl overflow-hidden transition cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-4">
        <p className="text-sm font-medium">{q}</p>
        <Icons.ChevronDown
          size={16}
          className={`text-gray-400 transition-transform flex-shrink-0 ml-3 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
