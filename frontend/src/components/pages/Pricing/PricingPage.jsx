import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../home/Footer";
import Navbar from "../home/Navbar";

const CAT_API  = "http://localhost:5000/api/categories";
const PLAN_API = "http://localhost:5000/api/plans";
const ADDON_API = "http://localhost:5000/api/addons";

// ─── Tiny SVG Icon helper ──────────────────────────────────────────────────────
const Ico = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const P = {
  check:  "M20 6L9 17l-5-5",
  clock:  "M12 22a10 10 0 110-20 10 10 0 010 20zM12 6v6l4 2",
  plus:   "M12 5v14M5 12h14",
  minus:  "M5 12h14",
  zap:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  gift:   "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
  box:    "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
};

// ─── Price Breakdown Row ───────────────────────────────────────────────────────
function Row({ label, value, color }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: "1px solid #1e2540",
    }}>
      <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: color || "#f1f5f9" }}>{value}</span>
    </div>
  );
}

export default function PricingPage() {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [addons, setAddons] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedPlan, setSelectedPlan]     = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [days, setDays]   = useState(7);
  const [loading, setLoading] = useState(true);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const cat  = await axios.get(`${CAT_API}/getCategories`);
      const plan = await axios.get(`${PLAN_API}/getPlans`);
      const add  = await axios.get(`${ADDON_API}/getAddOns`);
      setCategories(cat.data.data);
setPlans(plan.data.data || []);
      setAddons(add.data);
if (cat.data.data && cat.data.data.length > 0) {
  setActiveCategory(cat.data.data[0]._id);
}      setLoading(false);
    };
    fetchData();
  }, []);

  // ── Filter ─────────────────────────────────────────────────────────────────
const filteredPlans = plans.filter(
  (p) => p.service?.category?._id === activeCategory,
);
  // ── Total ──────────────────────────────────────────────────────────────────
  const getTotal = () => {
    let total = selectedPlan?.basePrice || 0;
    selectedAddons.forEach((a) => { total += a.price; });
    if (days < 5)  total += total * 0.25;
    if (days > 10) total -= total * 0.1;
    return Math.round(total);
  };

  const urgency = () => {
    if (days < 5)  return { text: "+25% urgent surcharge", color: "#ef4444" };
    if (days > 10) return { text: "−10% extended discount", color: "#10b981" };
    return { text: "Standard rate applies", color: "#64748b" };
  };

  // ── Toggle Addon ───────────────────────────────────────────────────────────
  const toggleAddon = (addon) => {
    const exists = selectedAddons.find((a) => a._id === addon._id);
    setSelectedAddons(exists
      ? selectedAddons.filter((a) => a._id !== addon._id)
      : [...selectedAddons, addon]
    );
  };
  const addonOn = (id) => !!selectedAddons.find((a) => a._id === id);

  const u = urgency();

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#070b14", flexDirection: "column", gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, border: "3px solid #7c3aed33",
        borderTop: "3px solid #7c3aed", borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
      }} />
      <span style={{ color: "#4a5568", fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>
        Loading pricing…
      </span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <div
        className="pt-25"
        style={{
          background:
            "linear-gradient(160deg,#070b14 0%,#0d1020 55%,#060914 100%)",
          minHeight: "100vh",
          fontFamily: "'Outfit',sans-serif",
          color: "#f1f5f9",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* ── Background decorations ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage:
              "radial-gradient(circle,#ffffff07 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "-15%",
            left: "15%",
            width: 700,
            height: 700,
            background: "radial-gradient(circle,#7c3aed0d,transparent 70%)",
            filter: "blur(100px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-10%",
            right: "5%",
            width: 600,
            height: 600,
            background: "radial-gradient(circle,#0ea5e90d,transparent 70%)",
            filter: "blur(100px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "64px 24px 96px",
          }}
        >
          {/* ══ HERO HEADER ═════════════════════════════════════════════════ */}
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <h1
              style={{
                fontSize: "clamp(28px,5vw,54px)",
                fontWeight: 900,
                lineHeight: 1.12,
                marginBottom: 18,
              }}
            >
              <span style={{ color: "#f1f5f9" }}>SRJ Software Company</span>
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(130deg,#a78bfa 30%,#60a5fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Pricing Chart
              </span>
            </h1>
            <p
              style={{
                color: "#4a5568",
                fontSize: 16,
                maxWidth: 500,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Choose your plan, add extras &amp; get an instant estimate — no
              hidden fees, ever.
            </p>
          </div>

          {/* ══ CATEGORY TABS ═══════════════════════════════════════════════ */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 6,
              padding: 6,
              marginBottom: 56,
              background: "#0d1020",
              border: "1px solid #1e2540",
              borderRadius: 18,
              maxWidth: 680,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {categories.map((c) => {
              const active = activeCategory === c._id;
              return (
                <button
                  key={c._id}
                  onClick={() => {
                    setActiveCategory(c._id);
                    setSelectedPlan(null);
                  }}
                  style={{
                    flex: "1 1 auto",
                    padding: "11px 22px",
                    borderRadius: 13,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "'Outfit',sans-serif",
                    transition: "all 0.25s",
                    background: active
                      ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                      : "transparent",
                    color: active ? "#fff" : "#4a5568",
                    boxShadow: active ? "0 4px 24px #7c3aed44" : "none",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* ══ PLAN CARDS ══════════════════════════════════════════════════ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
              gap: 20,
              marginBottom: 48,
            }}
          >
            {filteredPlans.map((plan, idx) => {
              const sel = selectedPlan?._id === plan._id;
              const popular = idx === 1;
              return (
                <div
                  key={plan._id}
                  onClick={() => setSelectedPlan(plan)}
                  style={{
                    background: sel
                      ? "linear-gradient(150deg,#1a1040,#13172b)"
                      : "#0d1020",
                    border: sel ? "2px solid #7c3aed" : "1px solid #1e2540",
                    borderRadius: 22,
                    padding: "30px 24px",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.3s",
                    transform: sel ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: sel
                      ? "0 24px 60px #7c3aed2a"
                      : "0 4px 20px #00000040",
                  }}
                >
                  {popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: -13,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(90deg,#f59e0b,#ef4444)",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: "0.12em",
                        padding: "5px 16px",
                        borderRadius: 99,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⭐ Most Popular
                    </div>
                  )}

                  {sel && (
                    <div
                      style={{
                        position: "absolute",
                        top: 18,
                        right: 18,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#7c3aed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ico d={P.check} size={13} color="#fff" />
                    </div>
                  )}

                  {/* Icon */}
                  {/* <div style={{
                    width: 46, height: 46, borderRadius: 13, marginBottom: 18,
                    background: sel ? "#7c3aed30" : "#1e2540",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s",
                  }}>
                    <Ico d={P.box} size={22} color={sel ? "#a78bfa" : "#4a5568"} />
                  </div> */}

                  {/* Image */}
                  <div
                    style={{
                      width: "100%",
                      height: 140,
                      borderRadius: 16,
                      overflow: "hidden",
                      marginBottom: 18,
                      border: sel ? "1px solid #7c3aed55" : "1px solid #1e2540",
                    }}
                  >
                    <img
                      src={
                        plan.service?.image ||
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={plan.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>

                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#f1f5f9",
                      marginBottom: 6,
                    }}
                  >
                    {plan.name}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 3,
                      marginBottom: 22,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#64748b",
                      }}
                    >
                      ₹
                    </span>
                    <span
                      style={{
                        fontSize: 38,
                        fontWeight: 900,
                        lineHeight: 1,
                        color: sel ? "#a78bfa" : "#f1f5f9",
                      }}
                    >
                      {plan.basePrice?.toLocaleString()}
                    </span>
                  </div>

                  <div
                    style={{ borderTop: "1px solid #1e2540", paddingTop: 18 }}
                  >
                    {/* 🔥 Scrollable Area */}
                    <div
                      style={{
                        maxHeight: 140, // 👈 control height
                        overflowY: "auto",
                        paddingRight: 6,

                        // smooth scrollbar
                        scrollbarWidth: "thin",
                      }}
                    >
                      {/* 🔥 Highlight Info */}
                      <div style={{ marginBottom: 14 }}>
                        {plan.pages && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 13,
                              color: "#38bdf8",
                              fontWeight: 600,
                              marginBottom: 6,
                            }}
                          >
                            📄 {plan.pages}
                          </div>
                        )}

                        {plan.deliveryTime && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 12,
                              color: "#64748b",
                              marginBottom: 4,
                            }}
                          >
                            ⏱ {plan.deliveryTime}
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {plan.features?.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 9,
                            marginBottom: 11,
                            fontSize: 13,
                            color: "#94a3b8",
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              flexShrink: 0,
                              marginTop: 1,
                              background: "#10b98118",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ico d={P.check} size={10} color="#10b981" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ══ DELIVERY TIMELINE ═══════════════════════════════════════════ */}
          <div
            style={{
              background: "#0d1020",
              border: "1px solid #1e2540",
              borderRadius: 22,
              padding: "28px 32px",
              marginBottom: 44,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#0ea5e920",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico d={P.clock} size={20} color="#38bdf8" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 17, color: "#f1f5f9" }}>
                  Delivery Timeline
                </p>
                <p style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>
                  Dynamically adjusts your total price
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 28,
              }}
            >
              {/* Slider */}
              <div style={{ flex: "1 1 260px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#4a5568" }}>1 day</span>
                  <span style={{ fontSize: 12, color: "#4a5568" }}>
                    30 days
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: "#7c3aed",
                    height: 4,
                    cursor: "pointer",
                  }}
                />
                {/* Markers */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  {[1, 5, 10, 15, 20, 25, 30].map((m) => (
                    <span
                      key={m}
                      style={{
                        fontSize: 10,
                        color: days === m ? "#a78bfa" : "#2d3562",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stepper */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    border: "1px solid #2d3562",
                    background: "#13172b",
                    color: "#94a3b8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  <Ico d={P.minus} size={14} />
                </button>
                <div style={{ textAlign: "center", minWidth: 64 }}>
                  <p
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: "#f1f5f9",
                      lineHeight: 1,
                    }}
                  >
                    {days}
                  </p>
                  <p style={{ fontSize: 11, color: "#4a5568", marginTop: 2 }}>
                    days
                  </p>
                </div>
                <button
                  onClick={() => setDays(Math.min(30, days + 1))}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    border: "1px solid #2d3562",
                    background: "#13172b",
                    color: "#94a3b8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  <Ico d={P.plus} size={14} />
                </button>
              </div>

              {/* Tag */}
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  flexShrink: 0,
                  background: u.color + "18",
                  border: `1px solid ${u.color}40`,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: u.color }}>
                  {u.text}
                </span>
              </div>
            </div>
          </div>

          {/* ══ ADD-ONS ══════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: 52 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 26,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#f59e0b18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ico d={P.gift} size={20} color="#fbbf24" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 20, color: "#f1f5f9" }}>
                  Add-On Services
                </p>
                <p style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>
                  Mix & match to supercharge your package
                </p>
              </div>
              {selectedAddons.length > 0 && (
                <div
                  style={{
                    marginLeft: "auto",
                    background: "#7c3aed18",
                    border: "1px solid #7c3aed40",
                    borderRadius: 99,
                    padding: "5px 16px",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}
                  >
                    {selectedAddons.length} selected
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
                gap: 12,
              }}
            >
              {addons.map((a) => {
                const on = addonOn(a._id);
                return (
                  <div
                    key={a._id}
                    onClick={() => toggleAddon(a)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderRadius: 16,
                      cursor: "pointer",
                      background: on ? "#06403622" : "#0d1020",
                      border: on ? "1.5px solid #10b981" : "1px solid #1e2540",
                      boxShadow: on ? "0 4px 24px #10b98118" : "none",
                      transition: "all 0.25s",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          flexShrink: 0,
                          background: on ? "#10b98118" : "#1e2540",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.25s",
                        }}
                      >
                        <Ico
                          d={on ? P.check : P.plus}
                          size={15}
                          color={on ? "#10b981" : "#4a5568"}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: on ? "#f1f5f9" : "#94a3b8",
                        }}
                      >
                        {a.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: on ? "#10b981" : "#4a5568",
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      ₹{a.basePrice?.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══ PRICE SUMMARY ═══════════════════════════════════════════════ */}
          <div
            style={{
              background: "linear-gradient(150deg,#0d1020,#13172b)",
              border: "1px solid #2d3562",
              borderRadius: 26,
              padding: "44px 40px",
              marginBottom: 52,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 300,
                height: 300,
                background: "radial-gradient(circle,#7c3aed28,transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 240,
                height: 240,
                background: "radial-gradient(circle,#0ea5e918,transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 40,
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Breakdown col */}
              <div style={{ flex: "1 1 260px" }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#4a5568",
                    marginBottom: 18,
                  }}
                >
                  Price Breakdown
                </p>

                <Row
                  label="Base Plan"
                  value={
                    selectedPlan
                      ? `₹${selectedPlan.basePrice?.toLocaleString()}`
                      : "— Select a plan"
                  }
                />
                {selectedAddons.map((a) => (
                  <Row
                    key={a._id}
                    label={a.name}
                    value={`+₹${a.price?.toLocaleString()}`}
                  />
                ))}
                {days < 5 && (
                  <Row
                    label="Urgent surcharge (+25%)"
                    value={`+₹${Math.round((selectedPlan?.basePrice || 0) * 0.25).toLocaleString()}`}
                    color="#ef4444"
                  />
                )}
                {days > 10 && (
                  <Row
                    label="Extended discount (−10%)"
                    value={`−₹${Math.round((selectedPlan?.basePrice || 0) * 0.1).toLocaleString()}`}
                    color="#10b981"
                  />
                )}
                <div
                  style={{ height: 1, background: "#2d3562", margin: "6px 0" }}
                />
                <Row
                  label="Estimated Total"
                  value={`₹${getTotal().toLocaleString()}`}
                  color="#a78bfa"
                />
              </div>

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  background: "#2d3562",
                  flexShrink: 0,
                }}
              />

              {/* Total col */}
              <div style={{ flex: "1 1 220px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#4a5568", marginBottom: 10 }}>
                  Your Estimated Price
                </p>
                <p
                  style={{
                    fontSize: "clamp(48px,9vw,80px)",
                    fontWeight: 900,
                    lineHeight: 1,
                    background: "linear-gradient(130deg,#a78bfa,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹{getTotal().toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#2d3562",
                    marginTop: 10,
                    marginBottom: 24,
                  }}
                >
                  *Varies with custom requirements
                </p>
                <button
                  onClick={() => {
                    const phone = "918357965638"; // country code + number

                    const message = encodeURIComponent(
                      `Hello ,

I am interested in your services.

📌 Service: ${activeCategory?.name || "N/A"}

Please share details and pricing.

Thank you!`,
                    );

                    window.open(
                      `https://wa.me/${phone}?text=${message}`,
                      "_blank",
                    );
                  }}
                  style={{
                    padding: "14px 36px",
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px #7c3aed44",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  Get Custom Quote →
                </button>
              </div>
            </div>
          </div>

          {/* ══ BOTTOM 2-COL ════════════════════════════════════════════════ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 24,
            }}
          >
            {/* Dynamic Pricing Policy */}
            <div
              style={{
                background: "#0d1020",
                border: "1px solid #1e2540",
                borderRadius: 22,
                padding: "30px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 180,
                  height: 180,
                  background:
                    "radial-gradient(circle,#38bdf818,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#38bdf818",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ico d={P.zap} size={20} color="#38bdf8" />
                </div>
                <p style={{ fontWeight: 800, fontSize: 17, color: "#38bdf8" }}>
                  Dynamic Pricing Policy
                </p>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    label: "Urgent Timeline (< 5 days)",
                    val: "+20–30%",
                    color: "#ef4444",
                  },
                  {
                    label: "Weekend / Holiday Delivery",
                    val: "+15%",
                    color: "#f59e0b",
                  },
                  {
                    label: "Bulk Orders (3+ Services)",
                    val: "10–20% OFF",
                    color: "#10b981",
                  },
                  {
                    label: "Custom / Enterprise",
                    val: "Custom Quote",
                    color: "#60a5fa",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#13172b",
                      padding: "13px 18px",
                      borderRadius: 13,
                      border: "1px solid #1e2540",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: row.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>
                        {row.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: row.color,
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div
              style={{
                background: "linear-gradient(150deg,#13172b,#0d1020)",
                border: "1px solid #2d3562",
                borderRadius: 22,
                padding: "30px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: -60,
                  left: -60,
                  width: 220,
                  height: 220,
                  background:
                    "radial-gradient(circle,#7c3aed18,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#7c3aed18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ico d={P.shield} size={20} color="#a78bfa" />
                </div>
                <p style={{ fontWeight: 800, fontSize: 17, color: "#f1f5f9" }}>
                  Why Choose SRJ Software?
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  position: "relative",
                }}
              >
                {[
                  {
                    icon: "💡",
                    text: "Moderate pricing + enterprise-grade quality",
                  },
                  { icon: "📦", text: "All-in-one IT & marketing solutions" },
                  { icon: "🧩", text: "Custom solutions for startups & MSMEs" },
                  {
                    icon: "⏱",
                    text: "On-time delivery with performance focus",
                  },
                  {
                    icon: "🔄",
                    text: "Long-term support & upgrade-ready systems",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 16px",
                      borderRadius: 13,
                      background: "#ffffff05",
                      border: "1px solid #1e2540",
                    }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#94a3b8",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
