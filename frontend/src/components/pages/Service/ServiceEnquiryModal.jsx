import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

const ENQUIRY_API = `${import.meta.env.VITE_API_BASE_URL}/api/enquiries/submit`;
export default function ServiceEnquiryModal({ service, onClose }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const budgets = [
    "Under ₹10,000",
    "₹10,000 – ₹50,000",
    "₹50,000 – ₹1,00,000",
    "₹1,00,000 – ₹5,00,000",
    "₹5,00,000+",
    "Not Sure",
  ];

  const timelines = [
    "ASAP",
    "Within 1 Month",
    "1–3 Months",
    "3–6 Months",
    "Flexible",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      return "Valid email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.budget) return "Please select a budget range.";
    if (!form.timeline) return "Please select a timeline.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    try {
      const payload = {
        // User Details
        userName: form.name,
        userEmail: form.email,
        userPhone: form.phone,
        userCompany: form.company,

        // Service Details
        serviceId: service._id,
        serviceName: service.name,
        serviceCategory: service.category?.name,
        servicePrice: service.price,

        // Enquiry Details
        budget: form.budget,
        timeline: form.timeline,
        message: form.message,

        // Meta
        submittedAt: new Date().toISOString(),
        source: "Service Detail Page",
      };

      await axios.post(ENQUIRY_API, payload);
      setStep(2);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto bg-[#020617] border border-white/10 sm:rounded-2xl rounded-t-2xl"
      >
        {/* ── STEP 2: SUCCESS ── */}
        {step === 2 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
            >
              <Icons.CheckCircle size={40} className="text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Enquiry Submitted!</h2>
            <p className="text-gray-400 mb-2 max-w-sm">
              Thank you{" "}
              <span className="text-white font-medium">{form.name}</span>! We've
              received your request for{" "}
              <span className="text-[#38BDF8] font-medium">{service.name}</span>
              .
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Our team will reach out to you at{" "}
              <span className="text-white">{form.email}</span> within 24 hours.
            </p>

            {/* Summary Card */}
            <div className="w-full bg-[#0f1e3d] border border-white/10 rounded-xl p-4 text-left mb-8 space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                Enquiry Summary
              </p>
              {[
                { label: "Service", val: service.name },
                { label: "Category", val: service.category?.name },
                { label: "Budget", val: form.budget },
                { label: "Timeline", val: form.timeline },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="text-white font-medium">{row.val}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-xl font-semibold hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* ── HEADER ── */}
            <div className="sticky top-0 z-10 bg-[#020617] border-b border-white/10 px-6 py-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Get This Service
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                  <span className="text-[#38BDF8]">{service.name}</span>
                  {service.price && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span>Starting {service.price}</span>
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 transition mt-1"
              >
                <Icons.X size={20} />
              </button>
            </div>

            {/* ── FORM BODY ── */}
            <div className="p-6 space-y-6">
              {/* Service Snapshot */}
              <div className="flex gap-4 bg-[#0f1e3d] border border-white/10 rounded-xl p-4">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${service.image}`}
                  alt={service.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-sm">{service.name}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {service.shortDescription}
                  </p>
                  {service.features?.length > 0 && (
                    <p className="text-xs text-[#38BDF8] mt-1">
                      ✓ {service.features.slice(0, 2).join("  ·  ✓ ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Section: Personal Info */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                  Your Details
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <InputField
                    label="Full Name *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    icon="User"
                  />
                  <InputField
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="rahul@company.com"
                    icon="Mail"
                  />
                  <InputField
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    icon="Phone"
                  />
                  <InputField
                    label="Company / Organization"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme Pvt. Ltd. (optional)"
                    icon="Building2"
                  />
                </div>
              </div>

              {/* Section: Project Info */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                  Project Details
                </p>

                {/* Budget Pills */}
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-2">Budget Range *</p>
                  <div className="flex flex-wrap gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm({ ...form, budget: b })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          form.budget === b
                            ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] border-transparent text-white"
                            : "border-white/10 text-gray-400 hover:border-[#38BDF8]/40 hover:text-white"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Pills */}
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-2">
                    Project Timeline *
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {timelines.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, timeline: t })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          form.timeline === t
                            ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] border-transparent text-white"
                            : "border-white/10 text-gray-400 hover:border-[#38BDF8]/40 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5">
                    Tell Us More About Your Project
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your requirements, goals, or anything specific you'd like us to know..."
                    className="w-full bg-[#0f1e3d] border border-white/10 focus:border-[#38BDF8]/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none resize-none transition"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <Icons.AlertCircle size={14} />
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icons.Send size={15} />
                    Submit Enquiry
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                By submitting, you agree to our{" "}
                <span className="text-[#38BDF8] cursor-pointer hover:underline">
                  Privacy Policy
                </span>
                . We never share your data.
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Reusable Input ──
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}) {
  const Icon = Icons[icon] || Icons.Edit;
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Icon size={14} />
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-[#0f1e3d] border border-white/10 focus:border-[#38BDF8]/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition"
        />
      </div>
    </div>
  );
}
