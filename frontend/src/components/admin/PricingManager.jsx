import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  Tag,
  Layers,
  Puzzle,
  Star,
  Clock,
  FileText,
  RefreshCw,
  Headphones,
  Code2,
  ChevronDown,
} from "lucide-react";

const BASE = import.meta.env.VITE_API_BASE_URL;

const CAT_API = `${BASE}/api/categories`;
const PLAN_API = `${BASE}/api/plans`;
const ADDON_API = `${BASE}/api/addons`;
const SERV_API = `${BASE}/api/services`;
const BASE_URL = BASE;



// const CAT_API = "http://localhost:5000/api/categories";
// const PLAN_API = "http://localhost:5000/api/plans";
// const ADDON_API = "http://localhost:5000/api/addons";
// const SERV_API = "http://localhost:5000/api/services";
// const BASE_URL = "http://localhost:5000";

const TABS = [
  { key: "category", label: "Categories", icon: <Tag size={14} /> },
  { key: "plan", label: "Plans", icon: <Layers size={14} /> },
  { key: "addon", label: "Add-ons", icon: <Puzzle size={14} /> },
];

const emptyForms = {
  category: { name: "" },
  plan: {
    name: "",
    basePrice: "",
    service: "",
    pages: "",
    deliveryTime: "",
    revisions: "",
    support: "",
    features: "",
    technologies: "",
    ctaText: "",
    order: "",
    isPopular: false,
  },
  addon: { name: "", basePrice: "" },
};

export default function PricingManager() {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [addons, setAddons] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("category");
  const [selectedService, setSelectedService] = useState("");
  const [form, setForm] = useState(emptyForms.category);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const imgSrc = (path) =>
    !path ? null : path.startsWith("/uploads") ? `${BASE_URL}${path}` : path;

  // ── fetch ──────────────────────────────────────
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [cat, plan, add, serv] = await Promise.all([
        axios.get(`${CAT_API}/getCategories`),
        axios.get(`${PLAN_API}/getPlans`),
        axios.get(`${ADDON_API}/getAddOns`),
        axios.get(`${SERV_API}/getAllServices`),
      ]);
      setCategories(cat.data.data || []);
      setPlans(plan.data.data || []);
      setAddons(add.data || []);
      setServices(serv.data.data || []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── form helpers ───────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const openCreate = () => {
    setForm(emptyForms[activeTab]);
    setEditId(null);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      ...item,
      features: item.features?.join(", ") || "",
      technologies: item.technologies?.join(", ") || "",
      service: item.service?._id || item.service || "",
    });
    setEditId(item._id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditId(null);
    setForm(emptyForms[activeTab]);
  };

  // ── submit ─────────────────────────────────────
  const handleSubmit = async () => {
    if (
      activeTab === "plan" &&
      (!form.name || form.basePrice === "" || !form.service)
    ) {
      return showToast("Name, price and service are required", "error");
    }
    if (activeTab === "category" && !form.name.trim()) {
      return showToast("Category name is required", "error");
    }
    if (activeTab === "addon" && (!form.name.trim() || form.basePrice === "")) {
      return showToast("Name and price are required", "error");
    }

    try {
      setSubmitting(true);
      const payload =
        activeTab === "plan"
          ? { ...form, basePrice: Number(form.basePrice || 0) }
          : form;

      if (activeTab === "category") {
        editId
          ? await axios.put(`${CAT_API}/updateCategory/${editId}`, payload)
          : await axios.post(`${CAT_API}/createCategory`, payload);
      }
      if (activeTab === "plan") {
        editId
          ? await axios.put(`${PLAN_API}/updatePlan/${editId}`, payload)
          : await axios.post(`${PLAN_API}/createPlan`, payload);
      }
      if (activeTab === "addon") {
        editId
          ? await axios.put(`${ADDON_API}/updateAddOn/${editId}`, payload)
          : await axios.post(`${ADDON_API}/createAddOn`, payload);
      }

      showToast(editId ? "Updated successfully!" : "Created successfully!");
      closeModal();
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.error || "Server error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete ─────────────────────────────────────
  const confirmDelete = async () => {
    try {
      if (activeTab === "category")
        await axios.delete(`${CAT_API}/deleteCategory/${deleteTarget}`);
      if (activeTab === "plan")
        await axios.delete(`${PLAN_API}/deletePlan/${deleteTarget}`);
      if (activeTab === "addon")
        await axios.delete(`${ADDON_API}/deleteAddOn/${deleteTarget}`);
      showToast("Deleted successfully");
      setDeleteTarget(null);
      fetchAll();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filteredPlans = selectedService
    ? plans.filter((p) => p.service?._id === selectedService)
    : plans;

  const currentList =
    activeTab === "category"
      ? categories
      : activeTab === "plan"
        ? filteredPlans
        : addons;

  // ── label helper ───────────────────────────────
  const tabLabel = TABS.find((t) => t.key === activeTab)?.label || "";

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-4 py-8 md:px-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[999] px-5 py-3 rounded-xl text-sm font-semibold shadow-xl transition-all ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          } text-white`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#38BDF8]">Pricing Manager</h1>
          <p className="text-xs text-gray-500 mt-1">
            {categories.length} categories · {plans.length} plans ·{" "}
            {addons.length} add-ons
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {activeTab === "plan" && (
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="appearance-none bg-[#020617] border border-[#1e293b] text-sm text-gray-300 pl-3 pr-8 py-2.5 rounded-xl focus:border-[#38BDF8] outline-none cursor-pointer"
              >
                <option value="">All Services</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-3 text-gray-400 pointer-events-none"
              />
            </div>
          )}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#38BDF8] hover:bg-sky-300 text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Plus size={15} /> Add {tabLabel.replace(/s$/, "")}
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-8 border-b border-[#1e293b] pb-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setActiveTab(t.key);
              setSelectedService("");
            }}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-t-xl border border-b-0 transition ${
              activeTab === t.key
                ? "bg-[#38BDF8] text-black font-semibold border-[#38BDF8]"
                : "bg-[#020617] text-gray-400 border-[#1e293b] hover:border-[#38BDF8]/50 hover:text-white"
            }`}
          >
            {t.icon} {t.label}
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ml-1 ${
                activeTab === t.key
                  ? "bg-black/20 text-black"
                  : "bg-[#1e293b] text-gray-400"
              }`}
            >
              {t.key === "category"
                ? categories.length
                : t.key === "plan"
                  ? plans.length
                  : addons.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#38BDF8]">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-56 text-gray-600 gap-3">
          <Layers size={36} />
          <p className="text-sm">No {tabLabel.toLowerCase()} yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentList.map((item) => (
            <PricingCard
              key={item._id}
              item={item}
              tab={activeTab}
              imgSrc={imgSrc}
              onEdit={openEdit}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      )}

      {/* ════════════════════════════════
          FORM MODAL
      ════════════════════════════════ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-[#0B1220] border border-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh]">
            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
              <div className="flex items-center gap-2 text-[#38BDF8]">
                {TABS.find((t) => t.key === activeTab)?.icon}
                <h2 className="text-base font-bold">
                  {editId ? "Edit" : "New"} {tabLabel.replace(/s$/, "")}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {/* ── CATEGORY FORM ── */}
              {activeTab === "category" && (
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Category Name *
                  </label>
                  <input
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    placeholder="e.g. Web Development"
                    className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                  />
                </div>
              )}

              {/* ── PLAN FORM ── */}
              {activeTab === "plan" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 mb-1 block">
                        Plan Name *
                      </label>
                      <input
                        name="name"
                        value={form.name || ""}
                        onChange={handleChange}
                        placeholder="e.g. Starter Plan"
                        className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Base Price (₹) *
                      </label>
                      <input
                        name="basePrice"
                        type="number"
                        value={form.basePrice || ""}
                        onChange={handleChange}
                        placeholder="4999"
                        className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Display Order
                      </label>
                      <input
                        name="order"
                        type="number"
                        value={form.order || ""}
                        onChange={handleChange}
                        placeholder="1"
                        className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Service *
                    </label>
                    <div className="relative">
                      <select
                        name="service"
                        value={form.service || ""}
                        onChange={handleChange}
                        className="w-full appearance-none bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 pr-8 py-2.5 text-sm outline-none transition text-white cursor-pointer"
                      >
                        <option value="">— Select Service —</option>
                        {services.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}{" "}
                            {s.category?.name ? `(${s.category.name})` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* delivery details row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <FileText size={12} /> Pages
                      </label>
                      <input
                        name="pages"
                        value={form.pages || ""}
                        onChange={handleChange}
                        placeholder="5 pages"
                        className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <Clock size={12} /> Delivery Time
                      </label>
                      <input
                        name="deliveryTime"
                        value={form.deliveryTime || ""}
                        onChange={handleChange}
                        placeholder="7 days"
                        className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <RefreshCw size={12} /> Revisions
                      </label>
                      <input
                        name="revisions"
                        value={form.revisions || ""}
                        onChange={handleChange}
                        placeholder="3 revisions"
                        className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <Headphones size={12} /> Support
                      </label>
                      <input
                        name="support"
                        value={form.support || ""}
                        onChange={handleChange}
                        placeholder="1 month"
                        className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Features{" "}
                      <span className="text-gray-600">(comma separated)</span>
                    </label>
                    <textarea
                      name="features"
                      value={form.features || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Responsive design, SEO ready, CMS..."
                      className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Code2 size={12} /> Technologies{" "}
                      <span className="text-gray-600 font-normal ml-1">
                        (comma separated)
                      </span>
                    </label>
                    <input
                      name="technologies"
                      value={form.technologies || ""}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      CTA Button Text
                    </label>
                    <input
                      name="ctaText"
                      value={form.ctaText || ""}
                      onChange={handleChange}
                      placeholder="Get Started"
                      className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer select-none bg-[#020617] border border-[#1e293b] rounded-xl px-4 py-3">
                    <div
                      onClick={() =>
                        setForm((p) => ({ ...p, isPopular: !p.isPopular }))
                      }
                      className={`w-10 h-5 rounded-full transition relative ${
                        form.isPopular ? "bg-[#38BDF8]" : "bg-[#1e293b]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          form.isPopular ? "left-5" : "left-0.5"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mark as Popular</p>
                      <p className="text-xs text-gray-500">
                        Shows a "Popular" badge on this plan
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* ── ADDON FORM ── */}
              {activeTab === "addon" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Add-on Name *
                    </label>
                    <input
                      name="name"
                      value={form.name || ""}
                      onChange={handleChange}
                      placeholder="e.g. Extra Page"
                      className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Price (₹) *
                    </label>
                    <input
                      name="basePrice"
                      type="number"
                      value={form.basePrice || ""}
                      onChange={handleChange}
                      placeholder="999"
                      className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm outline-none transition text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#1e293b]">
              <button
                onClick={closeModal}
                className="flex-1 border border-[#1e293b] hover:border-gray-500 text-gray-400 py-2.5 rounded-xl text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-[#38BDF8] hover:bg-sky-300 text-black font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          DELETE CONFIRM MODAL
      ════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-red-800/40 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={26} className="text-red-400" />
            </div>
            <h3 className="text-base font-bold mb-2">Delete this item?</h3>
            <p className="text-sm text-gray-400 mb-6">
              This action cannot be undone. The item will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-[#1e293b] hover:border-gray-500 text-gray-400 py-2.5 rounded-xl text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// PRICING CARD
// ════════════════════════════════════════
function PricingCard({ item, tab, imgSrc, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const features = item.features || [];
  const techs = item.technologies || [];
  const visible = expanded ? features : features.slice(0, 3);

  return (
    <div
      className={`bg-[#020617] border rounded-2xl overflow-hidden flex flex-col transition group hover:border-[#38BDF8]/40 ${
        item.isPopular ? "border-purple-600/60" : "border-[#1e293b]"
      }`}
    >
      {/* popular banner */}
      {item.isPopular && (
        <div className="bg-purple-700/30 border-b border-purple-700/40 px-4 py-1.5 flex items-center gap-1.5">
          <Star size={12} className="text-purple-400 fill-purple-400" />
          <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}

      {/* service image */}
      {imgSrc(item.service?.image) && (
        <div className="h-36 overflow-hidden">
          <img
            src={imgSrc(item.service.image)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* title + price */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-bold text-sm text-white line-clamp-1 flex-1">
            {item.name}
          </h3>
          {item.basePrice !== undefined && (
            <span className="text-[#38BDF8] font-bold text-sm whitespace-nowrap">
              ₹{Number(item.basePrice).toLocaleString()}
            </span>
          )}
        </div>

        {/* service tag */}
        {item.service?.name && (
          <span className="inline-block text-[11px] bg-sky-900/30 border border-sky-800/50 text-sky-300 px-2 py-0.5 rounded-full mb-3 w-fit">
            {item.service.name}
          </span>
        )}

        {/* category name (for category tab) */}
        {tab === "category" && (
          <p className="text-xs text-gray-500 mb-2">Category</p>
        )}

        {/* delivery meta */}
        {(item.pages ||
          item.deliveryTime ||
          item.revisions ||
          item.support) && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
            {item.pages && (
              <MetaRow icon={<FileText size={11} />} label={item.pages} />
            )}
            {item.deliveryTime && (
              <MetaRow icon={<Clock size={11} />} label={item.deliveryTime} />
            )}
            {item.revisions && (
              <MetaRow icon={<RefreshCw size={11} />} label={item.revisions} />
            )}
            {item.support && (
              <MetaRow icon={<Headphones size={11} />} label={item.support} />
            )}
          </div>
        )}

        {/* features */}
        {features.length > 0 && (
          <div className="mb-3 flex-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
              Features
            </p>
            <ul className="space-y-1">
              {visible.map((f, i) => (
                <li
                  key={i}
                  className="text-xs text-gray-300 flex items-start gap-1.5"
                >
                  <span className="text-emerald-400 mt-0.5">✔</span> {f}
                </li>
              ))}
            </ul>
            {features.length > 3 && (
              <button
                onClick={() => setExpanded((p) => !p)}
                className="text-[11px] text-[#38BDF8] mt-1 hover:underline"
              >
                {expanded ? "Show less" : `+${features.length - 3} more`}
              </button>
            )}
          </div>
        )}

        {/* tech pills */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {techs.map((t, i) => (
              <span
                key={i}
                className="text-[10px] bg-[#0f1f35] border border-[#1e293b] text-blue-300 px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* cta text */}
        {item.ctaText && (
          <p className="text-[11px] text-gray-500 mb-3 italic">
            CTA: "{item.ctaText}"
          </p>
        )}

        {/* actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-[#1e293b]">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs py-2 rounded-lg transition"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs py-2 rounded-lg transition"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon, label }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-gray-400">
      <span className="text-gray-500">{icon}</span> {label}
    </div>
  );
}
