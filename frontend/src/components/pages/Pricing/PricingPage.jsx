import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Clock, Plus, Minus, Zap, Shield, Gift,
  X, User, Mail, Phone, Building2, MessageSquare,
  Send, ChevronRight, ChevronLeft, Loader2, Sparkles,
  AlertCircle, ArrowRight, Tag, DollarSign
} from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CAT_API = `${BASE_URL}/api/categories`;
const PLAN_API = `${BASE_URL}/api/plans`;
const ADDON_API = `${BASE_URL}/api/addons`;
const ORDER_API = `${BASE_URL}/api/orders/submitOrder`;

// ─── tiny icon paths ──────────────────────────────────────────────────────────
const P = {
  check:  "M20 6L9 17l-5-5",
  clock:  "M12 22a10 10 0 110-20 10 10 0 010 20zM12 6v6l4 2",
  plus:   "M12 5v14M5 12h14",
  minus:  "M5 12h14",
  zap:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  gift:   "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
};
const Ico = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

// ─── helpers ──────────────────────────────────────────────────────────────────
const Row = ({ label, value, color }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "9px 0", borderBottom: "1px solid #1e2540",
  }}>
    <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 700, color: color || "#f1f5f9" }}>{value}</span>
  </div>
);

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
function StepDots({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step - 1 ? 22 : 7,
          height: 7,
          borderRadius: 99,
          background: i === step - 1 ? "#7c3aed" : i < step - 1 ? "#10b981" : "#1e2540",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
function Field({ label, name, type = "text", value, onChange, placeholder, required, icon: Icon, error }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: "0.05em" }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <div style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "#4a5568",
          }}>
            <Icon size={14} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            paddingLeft: Icon ? 36 : 14,
            paddingRight: 14,
            paddingTop: 11,
            paddingBottom: 11,
            background: "#0d1020",
            border: `1px solid ${error ? "#ef4444" : "#1e2540"}`,
            borderRadius: 12,
            color: "#f1f5f9",
            fontSize: 14,
            fontFamily: "'Outfit',sans-serif",
            outline: "none",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = "#7c3aed"}
          onBlur={e => e.target.style.borderColor = error ? "#ef4444" : "#1e2540"}
        />
      </div>
      {error && <span style={{ fontSize: 11, color: "#ef4444" }}>{error}</span>}
    </div>
  );
}

// ─── ORDER MODAL ──────────────────────────────────────────────────────────────
function OrderModal({ selectedPlan, selectedAddons, days, getTotal, urgency, activeCategory, onClose }) {
  const [step, setStep] = useState(1); // 1=review 2=details 3=success
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    budget: "", message: "",
  });
  const [errors, setErrors] = useState({});

  const u = urgency();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) return setErrors(e);

    setLoading(true);
    setApiError("");
    try {
      const payload = {
        // User
        userName: form.name,
        userEmail: form.email,
        userPhone: form.phone,
        userCompany: form.company,
        message: form.message,

        // Plan
        planId: selectedPlan._id,
        planName: selectedPlan.name,
        planBasePrice: selectedPlan.basePrice,

        // Service (from plan)
        serviceId: selectedPlan.service?._id || null,
        serviceName:
          selectedPlan.service?.name || activeCategory?.name || "General",
        serviceCategory: activeCategory?.name || "",

        // Addons
        addons: selectedAddons.map((a) => ({
          addonId: a._id,
          addonName: a.name,
          price: a.price ?? a.basePrice,
        })),

        // Timeline
        deliveryDays: days,
        timelinePricing: u.text,

        // Totals
        totalAmount: getTotal(),

        // Meta
        source: "Pricing Page",
        submittedAt: new Date().toISOString(),
        status: "new",
      };

      await axios.post(ORDER_API, payload);
      setStep(3);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp fallback
const openWhatsApp = () => {
  const phone = "918357965638";

  const serviceName =
    selectedPlan.service?.name || activeCategory?.name || "General Service";

  const addonText = selectedAddons.length
    ? `\n🔌 Add-ons:\n${selectedAddons.map((a) => `   • ${a.name}`).join("\n")}`
    : "";

  const msg = encodeURIComponent(
    `Hello SRJ Software Team\n\n` +
      ` *New Order Inquiry*\n\n` +
      ` *Plan:* ${selectedPlan.name}\n` +
      `*Service:* ${serviceName}\n` +
      `*Base Price:* ₹${selectedPlan.basePrice?.toLocaleString()}\n` +
      addonText +
      `\n\n` +
      `*Delivery:* ${days} days\n` +
      `*Total Estimate:* ₹${getTotal().toLocaleString()}\n\n` +
      `*Customer Details*\n` +
      `Name: ${form.name || "—"}\n` +
      `Email: ${form.email || "—"}\n` +
      `Phone: ${form.phone || "—"}\n` +
      `Company: ${form.company || "—"}\n\n` +
      `*Message:*\n${form.message || "No additional requirements"}\n\n` +
      `Please confirm availability & next steps.`,
  );

  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}; 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        padding: "0",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        style={{
          width: "100%",
          maxWidth: 720,
          maxHeight: "92vh",
          background: "linear-gradient(160deg,#0d1020,#13172b)",
          border: "1px solid #2d3562",
          borderRadius: "26px 26px 0 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid #1e2540",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9" }}>
                {step === 1 ? "Order Summary" : step === 2 ? "Your Details" : "Order Confirmed!"}
              </p>
              <p style={{ fontSize: 11, color: "#4a5568", marginTop: 1 }}>
                {step < 3 ? `Step ${step} of 2` : "We'll contact you soon"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {step < 3 && <StepDots step={step} total={2} />}
            <button onClick={onClose} style={{
              width: 34, height: 34, borderRadius: 9,
              background: "#1e2540", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b",
            }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px" }}>
          <AnimatePresence mode="wait">

            {/* ══ STEP 1: REVIEW ══ */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

                {/* Plan Card */}
                <div style={{
                  background: "#070b14", border: "1.5px solid #7c3aed",
                  borderRadius: 18, padding: "20px", marginBottom: 16,
                  display: "flex", gap: 16, alignItems: "center",
                }}>
                  {selectedPlan.service?.image && (
                    <img src={selectedPlan.service.image} alt=""
                      style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, background: "linear-gradient(90deg,#7c3aed,#4f46e5)",
                        color: "#fff", padding: "3px 10px", borderRadius: 99, letterSpacing: "0.08em",
                      }}>SELECTED PLAN</span>
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9" }}>{selectedPlan.name}</p>
                    {selectedPlan.service?.name && (
                      <p style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>{selectedPlan.service.name}</p>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 24, fontWeight: 900, color: "#a78bfa" }}>
                      ₹{selectedPlan.basePrice?.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 11, color: "#4a5568" }}>base price</p>
                  </div>
                </div>

                {/* Addons */}
                {selectedAddons.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: "#4a5568", marginBottom: 8, letterSpacing: "0.1em", fontWeight: 700 }}>
                      ADD-ONS SELECTED
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {selectedAddons.map(a => (
                        <div key={a._id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          background: "#06403622", border: "1px solid #10b98130",
                          borderRadius: 12, padding: "10px 14px",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0,
                            }} />
                            <span style={{ fontSize: 13, color: "#94a3b8" }}>{a.name}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>
                            +₹{(a.price ?? a.basePrice)?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div style={{
                  background: "#13172b", border: "1px solid #1e2540",
                  borderRadius: 14, padding: "14px 18px", marginBottom: 20,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Clock size={14} color="#38bdf8" />
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>Delivery Timeline</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{days} days</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: u.color,
                      background: u.color + "18", padding: "3px 10px", borderRadius: 99,
                      border: `1px solid ${u.color}40`,
                    }}>{u.text}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div style={{
                  background: "#070b14", border: "1px solid #1e2540",
                  borderRadius: 16, padding: "18px 20px", marginBottom: 24,
                }}>
                  <p style={{
                    fontSize: 10, fontWeight: 800, color: "#4a5568",
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4,
                  }}>Price Breakdown</p>
                  <Row label="Base Plan" value={`₹${selectedPlan.basePrice?.toLocaleString()}`} />
                  {selectedAddons.map(a => (
                    <Row key={a._id} label={a.name} value={`+₹${(a.price ?? a.basePrice)?.toLocaleString()}`} />
                  ))}
                  {days < 5 && <Row label="Urgent surcharge (+25%)"
                    value={`+₹${Math.round((selectedPlan.basePrice || 0) * 0.25).toLocaleString()}`} color="#ef4444" />}
                  {days > 10 && <Row label="Extended discount (−10%)"
                    value={`−₹${Math.round((selectedPlan.basePrice || 0) * 0.1).toLocaleString()}`} color="#10b981" />}
                  <div style={{ height: 1, background: "#2d3562", margin: "8px 0" }} />
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6,
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>Total Estimate</span>
                    <span style={{
                      fontSize: 26, fontWeight: 900,
                      background: "linear-gradient(130deg,#a78bfa,#60a5fa)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>₹{getTotal().toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 2: USER DETAILS ══ */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

                {/* Mini summary pill */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "#7c3aed18", border: "1px solid #7c3aed30",
                  borderRadius: 12, padding: "10px 16px", marginBottom: 24,
                }}>
                  <Sparkles size={14} color="#a78bfa" />
                  <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>
                    {selectedPlan.name}
                  </span>
                  <span style={{ fontSize: 12, color: "#4a5568", marginLeft: "auto" }}>
                    ₹{getTotal().toLocaleString()} total
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <Field label="Full Name" name="name" value={form.name} onChange={handleChange}
                    placeholder="Rahul Sharma" required icon={User} error={errors.name} />
                  <Field label="Email Address" name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="rahul@company.com" required icon={Mail} error={errors.email} />
                  <Field label="Phone Number" name="phone" type="tel" value={form.phone}
                    onChange={handleChange} placeholder="+91 98765 43210" required icon={Phone} error={errors.phone} />
                  <Field label="Company / Organization" name="company" value={form.company}
                    onChange={handleChange} placeholder="Acme Pvt. Ltd. (optional)" icon={Building2} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, letterSpacing: "0.05em" }}>
                    Additional Requirements
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe any specific requirements, references, or questions..."
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      background: "#0d1020",
                      border: "1px solid #1e2540",
                      borderRadius: 12,
                      color: "#f1f5f9",
                      fontSize: 14,
                      fontFamily: "'Outfit',sans-serif",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "#7c3aed"}
                    onBlur={e => e.target.style.borderColor = "#1e2540"}
                  />
                </div>

                {apiError && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#ef444418", border: "1px solid #ef444440",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                  }}>
                    <AlertCircle size={14} color="#ef4444" />
                    <span style={{ fontSize: 13, color: "#ef4444" }}>{apiError}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* ══ STEP 3: SUCCESS ══ */}
            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ textAlign: "center", paddingTop: 20 }}>

                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                  style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "#10b98118", border: "2px solid #10b98140",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                  }}>
                  <CheckCircle size={36} color="#10b981" />
                </motion.div>

                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", marginBottom: 8 }}>
                  Order Details Sent!
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
                  Thank you <strong style={{ color: "#f1f5f9" }}>{form.name}</strong>!
                  Your order for <strong style={{ color: "#a78bfa" }}>{selectedPlan.name}</strong> has been received.
                  Our team will contact you at <strong style={{ color: "#38bdf8" }}>{form.email}</strong> within 24 hours.
                </p>

                {/* Order Card */}
                <div style={{
                  background: "#070b14", border: "1px solid #1e2540",
                  borderRadius: 16, padding: "18px 20px", marginBottom: 24, textAlign: "left",
                }}>
                  <p style={{
                    fontSize: 10, fontWeight: 800, color: "#4a5568",
                    letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
                  }}>Order Summary</p>
                  {[
                    { label: "Plan",     val: selectedPlan.name },
                    { label: "Service",  val: selectedPlan.service?.name || "—" },
                    { label: "Addons",   val: selectedAddons.length ? selectedAddons.map(a => a.name).join(", ") : "None" },
                    { label: "Delivery", val: `${days} days` },
                    { label: "Total",    val: `₹${getTotal().toLocaleString()}`, color: "#a78bfa" },
                  ].map(r => <Row key={r.label} label={r.label} value={r.val} color={r.color} />)}
                </div>

                <button
                  onClick={openWhatsApp}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 14,
                    background: "linear-gradient(135deg,#25d366,#128c7e)",
                    color: "#fff", fontWeight: 800, fontSize: 14,
                    border: "none", cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif", marginBottom: 10,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  💬 Follow up on WhatsApp
                </button>
                <button onClick={onClose} style={{
                  width: "100%", padding: "12px", borderRadius: 14,
                  background: "transparent", color: "#64748b", fontWeight: 600, fontSize: 14,
                  border: "1px solid #1e2540", cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                }}>
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER BUTTONS ── */}
        {step < 3 && (
          <div style={{
            padding: "16px 28px 24px",
            borderTop: "1px solid #1e2540",
            display: "flex",
            gap: 12,
            flexShrink: 0,
          }}>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "12px 20px", borderRadius: 12,
                  background: "#0d1020", border: "1px solid #1e2540",
                  color: "#94a3b8", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                }}>
                <ChevronLeft size={15} /> Back
              </button>
            )}
            <button
              onClick={() => step === 1 ? setStep(2) : handleSubmit()}
              disabled={loading}
              style={{
                flex: 1, padding: "13px", borderRadius: 12,
                background: loading ? "#2d3562" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                color: "#fff", fontWeight: 800, fontSize: 15,
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Outfit',sans-serif", boxShadow: loading ? "none" : "0 8px 24px #7c3aed33",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
              }}>
              {loading
                ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Submitting...</>
                : step === 1
                  ? <><ArrowRight size={15} /> Continue to Details</>
                  : <><Send size={15} /> Confirm Order</>
              }
            </button>
            {/* {step === 1 && (
              <button
                onClick={openWhatsApp}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "12px 16px", borderRadius: 12,
                  background: "#25d36618", border: "1px solid #25d36630",
                  color: "#25d366", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                  whiteSpace: "nowrap",
                }}>
                💬 WhatsApp
              </button>
            )} */}
          </div>
        )}
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </motion.div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PRICING PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function PricingPage() {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans]           = useState([]);
  const [addons, setAddons]         = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedPlan, setSelectedPlan]     = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [days, setDays]     = useState(7);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ── Fetch ──
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [cat, plan, add] = await Promise.all([
        axios.get(`${CAT_API}/getCategories`),
        axios.get(`${PLAN_API}/getPlans`),
        axios.get(`${ADDON_API}/getAddOns`),
      ]);
      setCategories(cat.data.data || []);
      setPlans(plan.data.data || []);
      setAddons(add.data || []);
      if (cat.data.data?.length > 0) setActiveCategory(cat.data.data[0]._id);
      setLoading(false);
    })();
  }, []);

  const filteredPlans = plans.filter(p => p.service?.category?._id === activeCategory);

  const getTotal = useCallback(() => {
    let total = selectedPlan?.basePrice || 0;
    selectedAddons.forEach(a => { total += (a.price ?? a.basePrice) || 0; });
    if (days < 5)  total += total * 0.25;
    if (days > 10) total -= total * 0.1;
    return Math.round(total);
  }, [selectedPlan, selectedAddons, days]);

  const urgency = useCallback(() => {
    if (days < 5)  return { text: "+25% urgent surcharge",  color: "#ef4444" };
    if (days > 10) return { text: "−10% extended discount",  color: "#10b981" };
    return { text: "Standard rate applies", color: "#64748b" };
  }, [days]);

  const toggleAddon = (addon) => {
    const exists = selectedAddons.find(a => a._id === addon._id);
    setSelectedAddons(exists
      ? selectedAddons.filter(a => a._id !== addon._id)
      : [...selectedAddons, addon]
    );
  };
  const addonOn = (id) => !!selectedAddons.find(a => a._id === id);
  const u = urgency();

  const activeCategoryObj = categories.find(c => c._id === activeCategory);

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

  return (
    <>
       

      <div className="pt-25" style={{
        background: "linear-gradient(160deg,#070b14 0%,#0d1020 55%,#060914 100%)",
        minHeight: "100vh",
        fontFamily: "'Outfit',sans-serif",
        color: "#f1f5f9",
        position: "relative",
        overflowX: "hidden",
      }}>
        {/* BG decorations */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle,#ffffff07 1px,transparent 1px)",
          backgroundSize: "30px 30px" }} />
        <div style={{ position: "fixed", top: "-15%", left: "15%", width: 700, height: 700,
          background: "radial-gradient(circle,#7c3aed0d,transparent 70%)",
          filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "-10%", right: "5%", width: 600, height: 600,
          background: "radial-gradient(circle,#0ea5e90d,transparent 70%)",
          filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "64px 24px 120px" }}>

          {/* ══ HERO ══ */}
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <h1 style={{ fontSize: "clamp(28px,5vw,54px)", fontWeight: 900, lineHeight: 1.12, marginBottom: 18 }}>
              <span style={{ color: "#f1f5f9" }}>Gaming & Software Company</span><br />
              <span style={{
                background: "linear-gradient(130deg,#a78bfa 30%,#60a5fa 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Pricing Chart</span>
            </h1>
            <p style={{ color: "#4a5568", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              Choose your plan, add extras &amp; get an instant estimate — no hidden fees, ever.
            </p>
          </div>

          {/* ══ CATEGORY TABS ══ */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6,
            padding: 6, marginBottom: 56, background: "#0d1020",
            border: "1px solid #1e2540", borderRadius: 18,
            maxWidth: 680, marginLeft: "auto", marginRight: "auto",
          }}>
            {categories.map(c => {
              const active = activeCategory === c._id;
              return (
                <button key={c._id} onClick={() => { setActiveCategory(c._id); setSelectedPlan(null); }}
                  style={{
                    flex: "1 1 auto", padding: "11px 22px", borderRadius: 13,
                    fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none",
                    fontFamily: "'Outfit',sans-serif", transition: "all 0.25s",
                    background: active ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "transparent",
                    color: active ? "#fff" : "#4a5568",
                    boxShadow: active ? "0 4px 24px #7c3aed44" : "none",
                  }}>
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* ══ PLAN CARDS ══ */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
            gap: 20, marginBottom: 48,
          }}>
            {filteredPlans.map((plan, idx) => {
              const sel = selectedPlan?._id === plan._id;
              const popular = idx === 1;
              return (
                <motion.div key={plan._id}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedPlan(sel ? null : plan)}
                  style={{
                    background: sel ? "linear-gradient(150deg,#1a1040,#13172b)" : "#0d1020",
                    border: sel ? "2px solid #7c3aed" : "1px solid #1e2540",
                    borderRadius: 22, padding: "30px 24px", cursor: "pointer",
                    position: "relative", transition: "all 0.3s",
                    boxShadow: sel ? "0 24px 60px #7c3aed2a" : "0 4px 20px #00000040",
                  }}>
                  {popular && (
                    <div style={{
                      position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(90deg,#f59e0b,#ef4444)", color: "#fff",
                      fontSize: 10, fontWeight: 900, letterSpacing: "0.12em",
                      padding: "5px 16px", borderRadius: 99, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>⭐ Most Popular</div>
                  )}
                  {sel && (
                    <div style={{
                      position: "absolute", top: 18, right: 18,
                      width: 26, height: 26, borderRadius: "50%",
                      background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Ico d={P.check} size={13} color="#fff" />
                    </div>
                  )}
                  <div style={{
                    width: "100%", height: 140, borderRadius: 16, overflow: "hidden",
                    marginBottom: 18, border: sel ? "1px solid #7c3aed55" : "1px solid #1e2540",
                  }}>
                    <img
                      src={`${BASE_URL}${plan.service?.image}` || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"}
                      alt={plan.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                      onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 6 }}>{plan.name}</h2>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 22 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>₹</span>
                    <span style={{ fontSize: 38, fontWeight: 900, lineHeight: 1, color: sel ? "#a78bfa" : "#f1f5f9" }}>
                      {plan.basePrice?.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ borderTop: "1px solid #1e2540", paddingTop: 18 }}>
                    <div style={{ maxHeight: 140, overflowY: "auto", paddingRight: 6, scrollbarWidth: "thin" }}>
                      <div style={{ marginBottom: 14 }}>
                        {plan.pages && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#38bdf8", fontWeight: 600, marginBottom: 6 }}>📄 {plan.pages}</div>}
                        {plan.deliveryTime && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", marginBottom: 4 }}>⏱ {plan.deliveryTime}</div>}
                      </div>
                      {plan.features?.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 11, fontSize: 13, color: "#94a3b8" }}>
                          <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: "#10b98118", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Ico d={P.check} size={10} color="#10b981" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ══ DELIVERY TIMELINE ══ */}
          <div style={{ background: "#0d1020", border: "1px solid #1e2540", borderRadius: 22, padding: "28px 32px", marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#0ea5e920", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico d={P.clock} size={20} color="#38bdf8" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 17, color: "#f1f5f9" }}>Delivery Timeline</p>
                <p style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>Dynamically adjusts your total price</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28 }}>
              <div style={{ flex: "1 1 260px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#4a5568" }}>1 day</span>
                  <span style={{ fontSize: 12, color: "#4a5568" }}>30 days</span>
                </div>
                <input type="range" min={1} max={30} value={days} onChange={e => setDays(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#7c3aed", height: 4, cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {[1, 5, 10, 15, 20, 25, 30].map(m => (
                    <span key={m} style={{ fontSize: 10, color: days === m ? "#a78bfa" : "#2d3562" }}>{m}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <button onClick={() => setDays(Math.max(1, days - 1))} style={{ width: 38, height: 38, borderRadius: 11, border: "1px solid #2d3562", background: "#13172b", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
                  <Ico d={P.minus} size={14} />
                </button>
                <div style={{ textAlign: "center", minWidth: 64 }}>
                  <p style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9", lineHeight: 1 }}>{days}</p>
                  <p style={{ fontSize: 11, color: "#4a5568", marginTop: 2 }}>days</p>
                </div>
                <button onClick={() => setDays(Math.min(30, days + 1))} style={{ width: 38, height: 38, borderRadius: 11, border: "1px solid #2d3562", background: "#13172b", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
                  <Ico d={P.plus} size={14} />
                </button>
              </div>
              <div style={{ padding: "10px 18px", borderRadius: 12, flexShrink: 0, background: u.color + "18", border: `1px solid ${u.color}40` }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: u.color }}>{u.text}</span>
              </div>
            </div>
          </div>

          {/* ══ ADD-ONS ══ */}
          <div style={{ marginBottom: 52 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f59e0b18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ico d={P.gift} size={20} color="#fbbf24" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 20, color: "#f1f5f9" }}>Add-On Services</p>
                <p style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>Mix &amp; match to supercharge your package</p>
              </div>
              {selectedAddons.length > 0 && (
                <div style={{ marginLeft: "auto", background: "#7c3aed18", border: "1px solid #7c3aed40", borderRadius: 99, padding: "5px 16px" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>{selectedAddons.length} selected</span>
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 12 }}>
              {addons.map(a => {
                const on = addonOn(a._id);
                return (
                  <div key={a._id} onClick={() => toggleAddon(a)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 20px", borderRadius: 16, cursor: "pointer",
                    background: on ? "#06403622" : "#0d1020",
                    border: on ? "1.5px solid #10b981" : "1px solid #1e2540",
                    boxShadow: on ? "0 4px 24px #10b98118" : "none",
                    transition: "all 0.25s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: on ? "#10b98118" : "#1e2540", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s" }}>
                        <Ico d={on ? P.check : P.plus} size={15} color={on ? "#10b981" : "#4a5568"} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: on ? "#f1f5f9" : "#94a3b8" }}>{a.name}</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: on ? "#10b981" : "#4a5568", flexShrink: 0, marginLeft: 12 }}>
                      ₹{(a.basePrice ?? a.price)?.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══ PRICE SUMMARY ══ */}
          <div style={{
            background: "linear-gradient(150deg,#0d1020,#13172b)", border: "1px solid #2d3562",
            borderRadius: 26, padding: "44px 40px", marginBottom: 52,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "radial-gradient(circle,#7c3aed28,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, background: "radial-gradient(circle,#0ea5e918,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center", position: "relative" }}>
              <div style={{ flex: "1 1 260px" }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a5568", marginBottom: 18 }}>Price Breakdown</p>
                <Row label="Base Plan" value={selectedPlan ? `₹${selectedPlan.basePrice?.toLocaleString()}` : "— Select a plan"} />
                {selectedAddons.map(a => <Row key={a._id} label={a.name} value={`+₹${(a.price ?? a.basePrice)?.toLocaleString()}`} />)}
                {days < 5 && <Row label="Urgent surcharge (+25%)" value={`+₹${Math.round((selectedPlan?.basePrice || 0) * 0.25).toLocaleString()}`} color="#ef4444" />}
                {days > 10 && <Row label="Extended discount (−10%)" value={`−₹${Math.round((selectedPlan?.basePrice || 0) * 0.1).toLocaleString()}`} color="#10b981" />}
                <div style={{ height: 1, background: "#2d3562", margin: "6px 0" }} />
                <Row label="Estimated Total" value={`₹${getTotal().toLocaleString()}`} color="#a78bfa" />
              </div>
              <div style={{ width: 1, alignSelf: "stretch", background: "#2d3562", flexShrink: 0 }} />
              <div style={{ flex: "1 1 220px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#4a5568", marginBottom: 10 }}>Your Estimated Price</p>
                <p style={{
                  fontSize: "clamp(48px,9vw,80px)", fontWeight: 900, lineHeight: 1,
                  background: "linear-gradient(130deg,#a78bfa,#60a5fa)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>₹{getTotal().toLocaleString()}</p>
                <p style={{ fontSize: 12, color: "#2d3562", marginTop: 10, marginBottom: 24 }}>
                  *Varies with custom requirements
                </p>

                {/* ── CTA BUTTON ── */}
                {!selectedPlan ? (
                  <div style={{
                    padding: "14px 24px", borderRadius: 14, background: "#13172b",
                    border: "1px dashed #2d3562", color: "#4a5568", fontSize: 14, fontWeight: 600,
                  }}>
                    ← Select a plan to proceed
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(true)}
                    style={{
                      padding: "14px 36px", borderRadius: 14,
                      background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                      color: "#fff", fontWeight: 800, fontSize: 15,
                      border: "none", cursor: "pointer",
                      boxShadow: "0 8px 32px #7c3aed44",
                      fontFamily: "'Outfit',sans-serif",
                      display: "flex", alignItems: "center", gap: 10, margin: "0 auto",
                    }}>
                    <Sparkles size={16} />
                    Proceed to Order →
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* ══ BOTTOM 2-COL ══ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {/* Dynamic Pricing Policy */}
            <div style={{ background: "#0d1020", border: "1px solid #1e2540", borderRadius: 22, padding: "30px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, background: "radial-gradient(circle,#38bdf818,transparent 70%)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#38bdf818", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico d={P.zap} size={20} color="#38bdf8" />
                </div>
                <p style={{ fontWeight: 800, fontSize: 17, color: "#38bdf8" }}>Dynamic Pricing Policy</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Urgent Timeline (< 5 days)",  val: "+20–30%",    color: "#ef4444" },
                  { label: "Weekend / Holiday Delivery",  val: "+15%",       color: "#f59e0b" },
                  { label: "Bulk Orders (3+ Services)",   val: "10–20% OFF", color: "#10b981" },
                  { label: "Custom / Enterprise",         val: "Custom Quote",color: "#60a5fa" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#13172b", padding: "13px 18px", borderRadius: 13, border: "1px solid #1e2540" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: row.color, flexShrink: 0, marginLeft: 12 }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div style={{ background: "linear-gradient(150deg,#13172b,#0d1020)", border: "1px solid #2d3562", borderRadius: 22, padding: "30px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, background: "radial-gradient(circle,#7c3aed18,transparent 70%)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#7c3aed18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico d={P.shield} size={20} color="#a78bfa" />
                </div>
                <p style={{ fontWeight: 800, fontSize: 17, color: "#f1f5f9" }}>Why Choose SRJ Software?</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                {[
                  { icon: "💡", text: "Moderate pricing + enterprise-grade quality" },
                  { icon: "📦", text: "All-in-one IT & marketing solutions" },
                  { icon: "🧩", text: "Custom solutions for startups & MSMEs" },
                  { icon: "⏱", text: "On-time delivery with performance focus" },
                  { icon: "🔄", text: "Long-term support & upgrade-ready systems" },
                ].map(item => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 13, background: "#ffffff05", border: "1px solid #1e2540" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FLOATING ORDER BAR (visible when plan selected) ══ */}
      <AnimatePresence>
        {selectedPlan && !showModal && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", damping: 22 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
              padding: "16px 24px",
              background: "linear-gradient(to right, #0d1020ee, #13172bee)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid #2d3562",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
              flexWrap: "wrap",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 14, color: "#94a3b8" }}>
                <strong style={{ color: "#f1f5f9" }}>{selectedPlan.name}</strong>
                {selectedAddons.length > 0 && ` + ${selectedAddons.length} add-on${selectedAddons.length > 1 ? "s" : ""}`}
              </span>
              <span style={{
                fontSize: 20, fontWeight: 900,
                background: "linear-gradient(130deg,#a78bfa,#60a5fa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>₹{getTotal().toLocaleString()}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              style={{
                padding: "11px 28px", borderRadius: 12,
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                color: "#fff", fontWeight: 800, fontSize: 14, border: "none",
                cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                boxShadow: "0 4px 24px #7c3aed44",
                display: "flex", alignItems: "center", gap: 8,
              }}>
              <Sparkles size={15} /> Proceed to Order
            </motion.button>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ORDER MODAL ══ */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <OrderModal
            selectedPlan={selectedPlan}
            selectedAddons={selectedAddons}
            days={days}
            getTotal={getTotal}
            urgency={urgency}
            activeCategory={activeCategoryObj}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>

      
    </>
  );
}