import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  Clock,
  PhoneCall,
  TrendingUp,
  XCircle,
  Mail,
  Phone,
  Building2,
  Calendar,
  Tag,
  DollarSign,
  MessageSquare,
  User,
  Briefcase,
  BarChart2,
  AlertCircle,
  Edit3,
  Save,
} from "lucide-react";

const API = "http://localhost:5000/api/enquiries";

// ── Status config ──
const STATUS_CONFIG = {
  new: {
    label: "New",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  contacted: {
    label: "Contacted",
    color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  converted: {
    label: "Converted",
    color: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  closed: {
    label: "Closed",
    color: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  },
};

const STATUSES = Object.keys(STATUS_CONFIG);

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // detail drawer
  const [deleteId, setDeleteId] = useState(null); // confirm delete

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // ── Fetch Stats ──
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/stats`);
      if (data.success) setStats(data.data);
    } catch (_) {}
  };

  // ── Fetch Enquiries ──
  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await axios.get(`${API}/all`, { params });
      if (data.success) {
        setEnquiries(data.data);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, []);
  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, startDate, endDate]);

  // ── Update Status ──
  const updateStatus = async (id, status, adminNote = "", assignedTo = "") => {
    try {
      await axios.patch(`${API}/${id}/status`, {
        status,
        adminNote,
        assignedTo,
      });
      fetchEnquiries();
      fetchStats();
      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, status, adminNote, assignedTo }));
      }
    } catch (_) {}
  };

  // ── Delete ──
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteId}`);
      setDeleteId(null);
      if (selected?._id === deleteId) setSelected(null);
      fetchEnquiries();
      fetchStats();
    } catch (_) {}
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#081638] text-white p-4 md:p-8">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Service Enquiries</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and track all incoming service requests
          </p>
        </div>
        <button
          onClick={() => {
            fetchEnquiries();
            fetchStats();
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#020617] border border-white/10 rounded-xl text-sm hover:border-[#38BDF8]/40 transition"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── STAT CARDS ── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: BarChart2,
              color: "text-white",
            },
            {
              label: "New",
              value: stats.newCount,
              icon: AlertCircle,
              color: "text-blue-400",
            },
            {
              label: "Contacted",
              value: stats.contacted,
              icon: PhoneCall,
              color: "text-yellow-400",
            },
            {
              label: "In Progress",
              value: stats.inProgress,
              icon: Clock,
              color: "text-purple-400",
            },
            {
              label: "Converted",
              value: stats.converted,
              icon: CheckCircle,
              color: "text-green-400",
            },
            {
              label: "Last 7 Days",
              value: stats.last7,
              icon: TrendingUp,
              color: "text-[#38BDF8]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#020617]/70 border border-white/10 rounded-xl p-4 flex flex-col gap-2"
            >
              <s.icon size={16} className={s.color} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── FILTERS ── */}
      <div className="bg-[#020617]/70 border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              placeholder="Search name, email, phone, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#081638] border border-white/10 focus:border-[#38BDF8]/50 rounded-xl text-sm outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#081638] border border-white/10 text-sm text-gray-300 rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-[#38BDF8]/40 transition"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#081638] border border-white/10 text-sm text-gray-300 rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-[#38BDF8]/40 transition"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#081638] border border-white/10 text-sm text-gray-300 rounded-xl px-3 py-2.5 outline-none cursor-pointer hover:border-[#38BDF8]/40 transition"
          />

          {/* Clear */}
          {(search || statusFilter !== "all" || startDate || endDate) && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setStartDate("");
                setEndDate("");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-red-500/30 text-red-400 text-sm rounded-xl hover:bg-red-500/10 transition"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Showing <span className="text-white">{enquiries.length}</span> of{" "}
          <span className="text-white">{total}</span> enquiries
        </p>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-[#020617]/70 border border-white/10 rounded-2xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 bg-[#081638]/60">
                {[
                  "#",
                  "User",
                  "Contact",
                  "Service",
                  "Budget",
                  "Timeline",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3.5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-500">
                    <BarChart2 size={32} className="mx-auto mb-2 opacity-30" />
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq, i) => (
                  <motion.tr
                    key={enq._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition group"
                  >
                    {/* # */}
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {(page - 1) * 10 + i + 1}
                    </td>

                    {/* User */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {enq.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white line-clamp-1">
                            {enq.userName}
                          </p>
                          {enq.userCompany && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {enq.userCompany}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-[#38BDF8]">{enq.userEmail}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {enq.userPhone}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-white line-clamp-1">
                        {enq.serviceName || "—"}
                      </p>
                      {enq.serviceCategory && (
                        <p className="text-xs text-gray-500">
                          {enq.serviceCategory}
                        </p>
                      )}
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-3.5 text-xs text-gray-300">
                      {enq.budget || "—"}
                    </td>

                    {/* Timeline */}
                    <td className="px-4 py-3.5 text-xs text-gray-300">
                      {enq.timeline || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <select
                        value={enq.status}
                        onChange={(e) => updateStatus(enq._id, e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium outline-none cursor-pointer bg-transparent transition ${STATUS_CONFIG[enq.status]?.color}`}
                      >
                        {STATUSES.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-[#020617] text-white"
                          >
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-gray-300">
                        {formatDate(enq.submittedAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(enq.submittedAt)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(enq)}
                          className="p-1.5 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8]/20 transition"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(enq._id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-white/10 hover:border-[#38BDF8]/40 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm border transition ${
                  page === i + 1
                    ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] border-transparent text-white"
                    : "border-white/10 text-gray-400 hover:border-[#38BDF8]/40"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-white/10 hover:border-[#38BDF8]/40 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── DETAIL DRAWER ── */}
      <AnimatePresence>
        {selected && (
          <EnquiryDrawer
            enq={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={updateStatus}
            onDelete={() => setDeleteId(selected._id)}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM ── */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#020617] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="font-bold text-lg mb-1">Delete Enquiry?</h3>
              <p className="text-gray-400 text-sm mb-6">
                This action cannot be undone. The enquiry will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm hover:border-white/30 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-500/80 hover:bg-red-500 rounded-xl text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Detail Drawer ──
function EnquiryDrawer({
  enq,
  onClose,
  onStatusUpdate,
  onDelete,
  formatDate,
  formatTime,
}) {
  const [editNote, setEditNote] = useState(enq.adminNote || "");
  const [editAssigned, setEditAssigned] = useState(enq.assignedTo || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onStatusUpdate(enq._id, enq.status, editNote, editAssigned);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Row = ({ icon: Icon, label, value, className = "" }) =>
    value ? (
      <div className="flex items-start gap-3 py-2.5 border-b border-white/5">
        <Icon size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className={`text-sm text-white break-words ${className}`}>
            {value}
          </p>
        </div>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-lg h-full bg-[#020617] border-l border-white/10 overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#020617] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-base">Enquiry Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(enq.submittedAt)} · {formatTime(enq.submittedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Status Badge + Change */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1.5 rounded-full border font-medium ${STATUS_CONFIG[enq.status]?.color}`}
            >
              {STATUS_CONFIG[enq.status]?.label}
            </span>
            <select
              defaultValue={enq.status}
              onChange={(e) =>
                onStatusUpdate(enq._id, e.target.value, editNote, editAssigned)
              }
              className="text-xs bg-[#081638] border border-white/10 rounded-lg px-3 py-1.5 text-gray-300 outline-none cursor-pointer hover:border-[#38BDF8]/40 transition"
            >
              {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                <option key={val} value={val}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Section */}
          <Section title="User Information" icon={User}>
            <Row icon={User} label="Full Name" value={enq.userName} />
            <Row
              icon={Mail}
              label="Email"
              value={enq.userEmail}
              className="text-[#38BDF8]"
            />
            <Row icon={Phone} label="Phone" value={enq.userPhone} />
            <Row icon={Building2} label="Company" value={enq.userCompany} />
          </Section>

          {/* Service Section */}
          <Section title="Service Details" icon={Briefcase}>
            <Row
              icon={Briefcase}
              label="Service Name"
              value={enq.serviceName}
            />
            <Row icon={Tag} label="Category" value={enq.serviceCategory} />
            <Row
              icon={DollarSign}
              label="Service Price"
              value={enq.servicePrice}
            />
            <Row icon={DollarSign} label="Client Budget" value={enq.budget} />
            <Row icon={Clock} label="Timeline" value={enq.timeline} />
          </Section>

          {/* Message */}
          {enq.message && (
            <Section title="Client Message" icon={MessageSquare}>
              <p className="text-sm text-gray-300 leading-relaxed bg-[#081638] rounded-xl p-4 border border-white/5">
                {enq.message}
              </p>
            </Section>
          )}

          {/* Meta */}
          <Section title="Meta Info" icon={Calendar}>
            <Row
              icon={Calendar}
              label="Submitted At"
              value={`${formatDate(enq.submittedAt)}, ${formatTime(enq.submittedAt)}`}
            />
            <Row icon={Tag} label="Source" value={enq.source} />
          </Section>

          {/* Admin Section */}
          <Section title="Admin Notes" icon={Edit3}>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Assigned To
                </label>
                <input
                  value={editAssigned}
                  onChange={(e) => setEditAssigned(e.target.value)}
                  placeholder="Team member name..."
                  className="w-full bg-[#081638] border border-white/10 focus:border-[#38BDF8]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  Internal Note
                </label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  rows={3}
                  placeholder="Add internal notes about this enquiry..."
                  className="w-full bg-[#081638] border border-white/10 focus:border-[#38BDF8]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none resize-none transition"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {saved ? <CheckCircle size={14} /> : <Save size={14} />}
                {saving ? "Saving..." : saved ? "Saved!" : "Save Notes"}
              </button>
            </div>
          </Section>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#020617] border-t border-white/10 p-4 flex gap-3">
          <a
            href={`mailto:${enq.userEmail}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] rounded-xl text-sm hover:bg-[#38BDF8]/20 transition"
          >
            <Mail size={14} /> Email Client
          </a>
          <a
            href={`tel:${enq.userPhone}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] rounded-xl text-sm hover:bg-[#38BDF8]/20 transition"
          >
            <Phone size={14} /> Call Client
          </a>
          <button
            onClick={onDelete}
            className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Section Wrapper ──
function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-[#38BDF8]" />
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
          {title}
        </p>
      </div>
      <div className="bg-[#081638]/60 border border-white/5 rounded-xl px-4 py-1">
        {children}
      </div>
    </div>
  );
}
