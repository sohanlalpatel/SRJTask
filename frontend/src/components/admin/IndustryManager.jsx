import { useEffect, useState } from "react";
import axios from "axios";
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
  X,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  ImageOff,
  AlertTriangle,
} from "lucide-react";

const API = "http://localhost:5000/api/industries";
const BASE_URL = "http://localhost:5000";

const iconOptions = [
  "Heart",
  "Calendar",
  "Utensils",
  "ShoppingCart",
  "Megaphone",
  "Users",
  "Rocket",
  "Building2",
  "GraduationCap",
];

const iconMap = {
  Heart: <Heart size={18} />,
  Calendar: <Calendar size={18} />,
  Utensils: <Utensils size={18} />,
  ShoppingCart: <ShoppingCart size={18} />,
  Megaphone: <Megaphone size={18} />,
  Users: <Users size={18} />,
  Rocket: <Rocket size={18} />,
  Building2: <Building2 size={18} />,
  GraduationCap: <GraduationCap size={18} />,
};

const emptyForm = {
  name: "",
  desc: "",
  content: "",
  services: "",
  benefits: "",
  order: "",
  icon: "Rocket",
};

export default function IndustryManager() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  // ─── helpers ────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const imgSrc = (path) =>
    !path ? null : path.startsWith("/uploads") ? `${BASE_URL}${path}` : path;

  // ─── fetch ───────────────────────────────────────────────
  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/getIndustries`);
      setIndustries(res.data.data || []);
    } catch {
      showToast("Failed to load industries", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  // ─── form handlers ───────────────────────────────────────
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const openCreate = () => {
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || "",
      desc: item.desc || "",
      content: item.content || "",
      services: item.services?.join(", ") || "",
      benefits: item.benefits?.join(", ") || "",
      order: item.order ?? "",
      icon: item.icon || "Rocket",
    });
    setFile(null);
    setPreview(imgSrc(item.image));
    setEditId(item._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
  };

  // ─── submit ──────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name.trim()) return showToast("Name is required", "error");
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.keys(form).forEach((k) => form[k] !== "" && fd.append(k, form[k]));
      if (file) fd.append("industryImage", file);
      if (editId) await axios.put(`${API}/updateIndustry/${editId}`, fd);
      else await axios.post(`${API}/createIndustry`, fd);
      showToast(editId ? "Industry updated!" : "Industry created!");
      closeForm();
      fetchIndustries();
    } catch (err) {
      showToast(err.response?.data?.error || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── delete ──────────────────────────────────────────────
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/deleteIndustry/${deleteId}`);
      showToast("Industry deleted");
      setDeleteId(null);
      fetchIndustries();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // ─── render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-4 py-8 md:px-8">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[999] px-5 py-3 rounded-lg text-sm font-medium shadow-lg transition-all ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#38BDF8]">
            Industry Manager
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {industries.length} industries configured
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#38BDF8] text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-300 transition"
        >
          <Plus size={16} /> Add Industry
        </button>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#38BDF8]">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : industries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-3">
          <ImageOff size={40} />
          <p>No industries yet. Click "Add Industry" to create one.</p>
        </div>
      ) : (
        /* ── Grid ── */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {industries.map((item) => (
            <div
              key={item._id}
              className="bg-[#020617] border border-[#1e293b] rounded-2xl overflow-hidden flex flex-col hover:border-[#38BDF8]/50 transition group"
            >
              {/* image */}
              <div className="h-40 bg-[#0f1f35] relative overflow-hidden">
                {imgSrc(item.image) ? (
                  <img
                    src={imgSrc(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageOff size={32} />
                  </div>
                )}
                {/* order badge */}
                <span className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-1 rounded-full">
                  #{item.order ?? 0}
                </span>
                {/* icon badge */}
                <span className="absolute top-2 right-2 bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] p-1.5 rounded-lg">
                  {iconMap[item.icon] || <Rocket size={18} />}
                </span>
              </div>

              {/* body */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-base mb-1 text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">
                  {item.desc || "No description"}
                </p>

                {/* service pills */}
                {item.services?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.services.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-[#0f1f35] border border-[#1e293b] text-sky-300 px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {item.services.length > 3 && (
                      <span className="text-[11px] text-gray-500">
                        +{item.services.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setViewItem(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-[#1e293b] hover:border-[#38BDF8] text-gray-300 hover:text-[#38BDF8] text-xs py-2 rounded-lg transition"
                  >
                    <Eye size={13} /> View
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs py-2 rounded-lg transition"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs py-2 rounded-lg transition"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════
          FORM MODAL
      ════════════════════════════════════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className="bg-[#0B1220] border border-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] sticky top-0 bg-[#0B1220] z-10">
              <h2 className="text-lg font-bold text-[#38BDF8]">
                {editId ? "Edit Industry" : "Add New Industry"}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* image preview */}
              {preview && (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#1e293b]">
                  <img src={preview} className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* row 1 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Healthcare"
                    className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-lg px-3 py-2.5 text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Short Description
                  </label>
                  <input
                    name="desc"
                    value={form.desc}
                    onChange={handleChange}
                    placeholder="One-liner tagline"
                    className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-lg px-3 py-2.5 text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* content */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Full Content
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Detailed description..."
                  className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-lg px-3 py-2.5 text-sm outline-none transition resize-none"
                />
              </div>

              {/* services & benefits */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Services{" "}
                    <span className="text-gray-600">(comma separated)</span>
                  </label>
                  <textarea
                    name="services"
                    value={form.services}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Service A, Service B, ..."
                    className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-lg px-3 py-2.5 text-sm outline-none transition resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Benefits{" "}
                    <span className="text-gray-600">(comma separated)</span>
                  </label>
                  <textarea
                    name="benefits"
                    value={form.benefits}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Benefit A, Benefit B, ..."
                    className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-lg px-3 py-2.5 text-sm outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* icon + order */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Icon
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, icon: ic }))}
                        className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs transition ${
                          form.icon === ic
                            ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]"
                            : "border-[#1e293b] text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        {iconMap[ic]}
                        <span className="text-[10px]">{ic}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={form.order}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-[#020617] border border-[#1e293b] focus:border-[#38BDF8] rounded-lg px-3 py-2.5 text-sm outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Upload Image
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border border-dashed border-[#1e293b] hover:border-[#38BDF8] rounded-lg px-3 py-3 text-sm text-gray-400 hover:text-[#38BDF8] transition">
                      <Plus size={16} />
                      {file ? file.name : "Choose image..."}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* footer btns */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeForm}
                  className="flex-1 border border-[#1e293b] hover:border-gray-500 text-gray-400 py-2.5 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-[#38BDF8] hover:bg-sky-300 text-black font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  {editId ? "Update Industry" : "Create Industry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          VIEW MODAL
      ════════════════════════════════════════ */}
      {viewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setViewItem(null)}
        >
          <div className="bg-[#0B1220] border border-[#1e293b] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] sticky top-0 bg-[#0B1220] z-10">
              <div className="flex items-center gap-3">
                <span className="text-[#38BDF8]">
                  {iconMap[viewItem.icon] || <Rocket size={18} />}
                </span>
                <h2 className="text-lg font-bold text-white">
                  {viewItem.name}
                </h2>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* image */}
              {imgSrc(viewItem.image) && (
                <img
                  src={imgSrc(viewItem.image)}
                  alt={viewItem.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
              )}

              {/* meta row */}
              <div className="flex gap-3">
                <span className="text-xs bg-[#0f1f35] border border-[#1e293b] text-gray-300 px-3 py-1 rounded-full">
                  Order: #{viewItem.order ?? 0}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${
                    viewItem.isActive
                      ? "bg-emerald-900/40 border-emerald-700 text-emerald-400"
                      : "bg-red-900/40 border-red-800 text-red-400"
                  }`}
                >
                  {viewItem.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* desc */}
              {viewItem.desc && (
                <p className="text-sm text-[#38BDF8] font-medium">
                  {viewItem.desc}
                </p>
              )}

              {/* content */}
              {viewItem.content && (
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    About
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {viewItem.content}
                  </p>
                </div>
              )}

              {/* services */}
              {viewItem.services?.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewItem.services.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs bg-sky-900/30 border border-sky-800/50 text-sky-300 px-3 py-1 rounded-full"
                      >
                        ✔ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* benefits */}
              {viewItem.benefits?.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Benefits
                  </h4>
                  <div className="space-y-2">
                    {viewItem.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <span className="text-yellow-400">⭐</span> {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* footer actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setViewItem(null);
                    openEdit(viewItem);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 py-2.5 rounded-xl text-sm transition"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setViewItem(null);
                    setDeleteId(viewItem._id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          DELETE CONFIRM MODAL
      ════════════════════════════════════════ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-red-800/50 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Delete Industry?</h3>
            <p className="text-sm text-gray-400 mb-6">
              This action cannot be undone. The industry will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-[#1e293b] hover:border-gray-500 text-gray-400 py-2.5 rounded-xl text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold transition"
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
