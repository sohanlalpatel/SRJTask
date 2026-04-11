import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as Icons from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const COLORS = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  dark: "#0F172A",
  light: "#F8FAFC",
  accent: "#38BDF8",
};

const iconOptions = [
  { value: "Monitor", label: "Website Designing" },
  { value: "Palette", label: "Graphic Designing" },
  { value: "PenTool", label: "Logo Designing" },
  { value: "Layout", label: "Custom Website Design" },
  { value: "Code", label: "Web Development" },
  { value: "ShoppingCart", label: "E-Commerce" },
  { value: "Smartphone", label: "App Development" },
  { value: "Gamepad2", label: "Game Development" },
  { value: "Globe", label: "WordPress" },
  { value: "Megaphone", label: "Digital Marketing" },
  { value: "Search", label: "SEO" },
  { value: "MousePointerClick", label: "PPC" },
  { value: "FileText", label: "Content Writing" },
  { value: "Server", label: "Hosting" },
];

const EMPTY_FORM = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  features: "",
  category: "",
  price: "",
  icon: "",
  order: "",
  serviceImage: null,
  isActive: true,
};

function ServiceIcon({ name, size = 20, color = COLORS.accent }) {
  const Icon = Icons[name];
  return Icon ? <Icon size={size} color={color} /> : null;
}

function Badge({ active }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        background: active ? "rgba(56,189,248,0.13)" : "rgba(239,68,68,0.1)",
        color: active ? COLORS.accent : "#F87171",
        border: `1px solid ${active ? "rgba(56,189,248,0.3)" : "rgba(239,68,68,0.2)"}`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: active ? COLORS.accent : "#F87171",
          display: "inline-block",
        }}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            color: "#94A3B8",
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          {label.toUpperCase()}
        </label>
      )}
      <input
        {...props}
        style={{
          background: "#0F172A",
          border: "1px solid rgba(56,189,248,0.15)",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#F8FAFC",
          fontSize: 14,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = COLORS.accent;
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(56,189,248,0.15)";
          props.onBlur && props.onBlur(e);
        }}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            color: "#94A3B8",
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          {label.toUpperCase()}
        </label>
      )}
      <select
        {...props}
        style={{
          background: "#0F172A",
          border: "1px solid rgba(56,189,248,0.15)",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#F8FAFC",
          fontSize: 14,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          cursor: "pointer",
          ...props.style,
        }}
      >
        {children}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            color: "#94A3B8",
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          {label.toUpperCase()}
        </label>
      )}
      <textarea
        {...props}
        style={{
          background: "#0F172A",
          border: "1px solid rgba(56,189,248,0.15)",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#F8FAFC",
          fontSize: 14,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          resize: "vertical",
          fontFamily: "inherit",
          ...props.style,
        }}
      />
    </div>
  );
}

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/api/services/getAllServices`);
      setServices(res.data.data || []);
    } catch {
      showToast("Failed to fetch services", "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories/getCategories`);
      setCategories(res.data.data || []);
    } catch {
      showToast("Failed to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.shortDescription?.toLowerCase().includes(q) ||
          s.category?.name?.toLowerCase().includes(q),
      );
    }

    if (filterCategory !== "all") {
      result = result.filter((s) => s.category?._id === filterCategory);
    }

    if (filterStatus !== "all") {
      result = result.filter((s) =>
        filterStatus === "active" ? s.isActive : !s.isActive,
      );
    }

    if (sortBy === "name-asc")
      result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc")
      result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "order")
      result.sort((a, b) => (a.order || 0) - (b.order || 0));
    else if (sortBy === "price-asc")
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (sortBy === "price-desc")
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));

    return result;
  }, [services, searchQuery, filterCategory, filterStatus, sortBy]);

  const groupedFiltered = useMemo(() => {
    if (filterCategory !== "all" || searchQuery || filterStatus !== "all") {
      return { Results: filteredServices };
    }
    return filteredServices.reduce((acc, s) => {
      const cat = s.category?.name || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});
  }, [filteredServices, filterCategory, searchQuery, filterStatus]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim())
      return showToast("Service name is required", "error");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "serviceImage" && v !== null && v !== undefined)
        formData.append(k, v);
    });
    if (form.serviceImage) formData.append("serviceImage", form.serviceImage);
    try {
      if (editId) {
        await axios.put(
          `${API}/api/services/updateService/${editId}`,
          formData,
        );
        showToast("Service updated successfully");
      } else {
        await axios.post(`${API}/api/services/createService`, formData);
        showToast("Service created successfully");
      }
      fetchServices();
      resetForm();
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setIsOpen(false);
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name || "",
      shortDescription: s.shortDescription || "",
      description: s.description || "",
      features: s.features?.join(", ") || "",
      price: s.price || "",
      icon: s.icon || "",
      order: s.order || "",
      category: s.category?._id || "",
      isActive: s.isActive,
      slug: s.slug || "",
      serviceImage: null,
    });
    setEditId(s._id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/services/deleteService/${id}`);
      fetchServices();
      setDeleteConfirmId(null);
      showToast("Service deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const activeCount = services.filter((s) => s.isActive).length;

  return (
    <div style={{ background: "#000a14", minHeight: "100vh", padding: "0" }}>
      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            background:
              toast.type === "success"
                ? "rgba(56,189,248,0.15)"
                : "rgba(239,68,68,0.15)",
            border: `1px solid ${toast.type === "success" ? COLORS.accent : "#F87171"}`,
            color: toast.type === "success" ? COLORS.accent : "#F87171",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            backdropFilter: "blur(8px)",
            maxWidth: 320,
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div
        style={{
          background: "rgba(2,6,23,0.95)",
          borderBottom: "1px solid rgba(56,189,248,0.1)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icons.Layers size={18} color="white" />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#F8FAFC",
              }}
            >
              Service Manager
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "#64748B" }}>
              {services.length} services · {activeCount} active
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setForm(EMPTY_FORM);
            setIsOpen(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Icons.Plus size={16} />
          Add Service
        </button>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* STATS ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Total Services",
              value: services.length,
              icon: "Layers",
              color: COLORS.accent,
            },
            {
              label: "Active",
              value: activeCount,
              icon: "CheckCircle",
              color: "#34D399",
            },
            {
              label: "Inactive",
              value: services.length - activeCount,
              icon: "XCircle",
              color: "#F87171",
            },
            {
              label: "Categories",
              value: categories.length,
              icon: "Tag",
              color: COLORS.secondary,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(2,6,23,0.8)",
                border: "1px solid rgba(56,189,248,0.1)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${stat.color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ServiceIcon name={stat.icon} size={18} color={stat.color} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#F8FAFC",
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#64748B" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FILTER / SEARCH BAR */}
        <div
          style={{
            background: "rgba(2,6,23,0.8)",
            border: "1px solid rgba(56,189,248,0.1)",
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 24,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
          }}
        >
          {/* SEARCH */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#0F172A",
              border: "1px solid rgba(56,189,248,0.15)",
              borderRadius: 8,
              padding: "8px 12px",
              flex: "1 1 200px",
              minWidth: 0,
            }}
          >
            <Icons.Search size={15} color="#64748B" />
            <input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#F8FAFC",
                fontSize: 14,
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <Icons.X size={14} color="#64748B" />
              </button>
            )}
          </div>

          {/* CATEGORY FILTER */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              background: "#0F172A",
              border: "1px solid rgba(56,189,248,0.15)",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#F8FAFC",
              fontSize: 13,
              cursor: "pointer",
              flex: "0 1 160px",
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* STATUS FILTER */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: "#0F172A",
              border: "1px solid rgba(56,189,248,0.15)",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#F8FAFC",
              fontSize: 13,
              cursor: "pointer",
              flex: "0 1 140px",
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "#0F172A",
              border: "1px solid rgba(56,189,248,0.15)",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#F8FAFC",
              fontSize: 13,
              cursor: "pointer",
              flex: "0 1 150px",
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="name-asc">Name A→Z</option>
            <option value="name-desc">Name Z→A</option>
            <option value="order">By Order</option>
            <option value="price-asc">Price Low→High</option>
            <option value="price-desc">Price High→Low</option>
          </select>

          {/* RESET FILTERS */}
          {(searchQuery ||
            filterCategory !== "all" ||
            filterStatus !== "all" ||
            sortBy !== "default") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
                setFilterStatus("all");
                setSortBy("default");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#F87171",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <Icons.X size={13} />
              Clear
            </button>
          )}

          {/* VIEW TOGGLE */}
          <div
            style={{
              display: "flex",
              background: "#0F172A",
              border: "1px solid rgba(56,189,248,0.15)",
              borderRadius: 8,
              overflow: "hidden",
              marginLeft: "auto",
            }}
          >
            {[
              { key: "grid", icon: "LayoutGrid" },
              { key: "list", icon: "List" },
            ].map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    viewMode === key ? `${COLORS.primary}40` : "transparent",
                  color: viewMode === key ? COLORS.accent : "#64748B",
                  transition: "all 0.15s",
                }}
              >
                <ServiceIcon
                  name={icon}
                  size={16}
                  color={viewMode === key ? COLORS.accent : "#64748B"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS COUNT */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 13, color: "#64748B" }}>
            Showing{" "}
            <span style={{ color: COLORS.accent, fontWeight: 600 }}>
              {filteredServices.length}
            </span>{" "}
            of {services.length} services
          </span>
        </div>

        {/* SERVICES DISPLAY */}
        {filteredServices.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#64748B",
            }}
          >
            <Icons.SearchX
              size={40}
              color="#334155"
              style={{ margin: "0 auto 16px" }}
            />
            <p style={{ fontSize: 16, margin: 0 }}>
              No services match your filters.
            </p>
            <p style={{ fontSize: 13, margin: "6px 0 0" }}>
              Try adjusting your search or filters.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          Object.entries(groupedFiltered).map(([categoryName, catServices]) => (
            <div key={categoryName} style={{ marginBottom: 36 }}>
              {categoryName !== "Results" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: COLORS.accent,
                    }}
                  >
                    {categoryName}
                  </h2>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#64748B",
                      background: "rgba(56,189,248,0.08)",
                      padding: "2px 8px",
                      borderRadius: 20,
                      border: "1px solid rgba(56,189,248,0.15)",
                    }}
                  >
                    {catServices.length}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(56,189,248,0.08)",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                {catServices.map((s) => (
                  <ServiceCard
                    key={s._id}
                    service={s}
                    onView={() => setSelected(s)}
                    onEdit={() => handleEdit(s)}
                    onDelete={() => setDeleteConfirmId(s._id)}
                    API={API}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <ListView
            services={filteredServices}
            onView={(s) => setSelected(s)}
            onEdit={(s) => handleEdit(s)}
            onDelete={(id) => setDeleteConfirmId(id)}
            API={API}
          />
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {isOpen && (
        <Modal onClose={resetForm}>
          <div
            style={{
              background: "#020617",
              width: "100%",
              maxWidth: 680,
              borderRadius: 16,
              border: "1px solid rgba(56,189,248,0.15)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(56,189,248,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {editId ? (
                    <Icons.Edit size={14} color="white" />
                  ) : (
                    <Icons.Plus size={14} color="white" />
                  )}
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#F8FAFC",
                  }}
                >
                  {editId ? "Edit Service" : "New Service"}
                </h3>
              </div>
              <button
                onClick={resetForm}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: 6,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icons.X size={16} color="#94A3B8" />
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div style={{ gridColumn: "1" }}>
                  <Input
                    label="Service Name *"
                    name="name"
                    placeholder="e.g. Web Development"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Select
                    label="Category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Input
                    label="Short Description"
                    name="shortDescription"
                    placeholder="Brief summary (shown on cards)"
                    value={form.shortDescription}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Textarea
                    label="Full Description"
                    name="description"
                    placeholder="Detailed description of the service..."
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div>
                  <Input
                    label="Slug"
                    name="slug"
                    placeholder="e.g. web-development"
                    value={form.slug}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Input
                    label="Price"
                    name="price"
                    placeholder="e.g. $99/mo"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Input
                    label="Order"
                    name="order"
                    type="number"
                    placeholder="Display order"
                    value={form.order}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Select
                    label="Icon"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                  >
                    <option value="">Select Icon</option>
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Input
                    label="Features (comma separated)"
                    name="features"
                    placeholder="e.g. Responsive Design, SEO Optimized, Fast Loading"
                    value={form.features}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#94A3B8",
                      fontWeight: 500,
                      letterSpacing: 0.3,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    SERVICE IMAGE
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#0F172A",
                      border: "1px dashed rgba(56,189,248,0.25)",
                      borderRadius: 8,
                      padding: "12px 16px",
                      cursor: "pointer",
                      color: "#64748B",
                      fontSize: 14,
                    }}
                  >
                    <Icons.Upload size={16} color={COLORS.accent} />
                    {form.serviceImage
                      ? form.serviceImage.name
                      : "Click to upload image"}
                    <input
                      type="file"
                      name="serviceImage"
                      onChange={(e) =>
                        setForm({ ...form, serviceImage: e.target.files[0] })
                      }
                      style={{ display: "none" }}
                      accept="image/*"
                    />
                  </label>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 22,
                        borderRadius: 11,
                        background: form.isActive ? COLORS.primary : "#334155",
                        position: "relative",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: form.isActive ? 20 : 2,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "white",
                          transition: "left 0.2s",
                        }}
                      />
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        style={{ display: "none" }}
                      />
                    </div>
                    <span style={{ fontSize: 14, color: "#94A3B8" }}>
                      Active Service
                    </span>
                    <Badge active={form.isActive} />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(56,189,248,0.1)",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                onClick={resetForm}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "10px 24px",
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {editId ? <Icons.Save size={15} /> : <Icons.Plus size={15} />}
                {editId ? "Update Service" : "Create Service"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div
            style={{
              background: "#020617",
              width: "100%",
              maxWidth: 600,
              borderRadius: 16,
              border: "1px solid rgba(56,189,248,0.15)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={
                  selected.image?.startsWith("http")
                    ? selected.image
                    : `${API}${selected.image}`
                }
                
                alt={selected.name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, #020617 0%, transparent 60%)",
                }}
              />
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(2,6,23,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: 6,
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <Icons.X size={16} color="#94A3B8" />
              </button>
              <div style={{ position: "absolute", bottom: 16, left: 20 }}>
                <Badge active={selected.isActive} />
              </div>
            </div>

            <div style={{ padding: "20px 24px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#F8FAFC",
                    }}
                  >
                    {selected.name}
                  </h2>
                  {selected.category?.name && (
                    <span style={{ fontSize: 12, color: COLORS.accent }}>
                      {selected.category.name}
                    </span>
                  )}
                </div>
                {selected.price && (
                  <span
                    style={{
                      background: "rgba(37,99,235,0.15)",
                      border: "1px solid rgba(37,99,235,0.3)",
                      color: "#93C5FD",
                      padding: "4px 12px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {selected.price}
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: "#94A3B8",
                  lineHeight: 1.7,
                  margin: "0 0 16px",
                }}
              >
                {selected.description}
              </p>

              {selected.features?.length > 0 && (
                <div>
                  <h4
                    style={{
                      margin: "0 0 10px",
                      fontSize: 13,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Features
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selected.features.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(56,189,248,0.08)",
                          border: "1px solid rgba(56,189,248,0.15)",
                          color: "#94A3B8",
                          padding: "4px 12px",
                          borderRadius: 6,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Icons.Check size={12} color={COLORS.accent} />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <button
                  onClick={() => {
                    setSelected(null);
                    handleEdit(selected);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(37,99,235,0.15)",
                    border: "1px solid rgba(37,99,235,0.25)",
                    color: "#93C5FD",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Icons.Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(null);
                    setDeleteConfirmId(selected._id);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#F87171",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Icons.Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId && (
        <Modal onClose={() => setDeleteConfirmId(null)}>
          <div
            style={{
              background: "#020617",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 14,
              padding: 28,
              maxWidth: 360,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icons.Trash2 size={22} color="#F87171" />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: 18,
                fontWeight: 700,
                color: "#F8FAFC",
              }}
            >
              Delete Service?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748B" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#DC2626",
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "16px",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
}

function ServiceCard({ service: s, onView, onEdit, onDelete, API }) {
  return (
    <div
      style={{
        background: "#020617",
        border: "1px solid rgba(56,189,248,0.08)",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(56,189,248,0.25)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(56,189,248,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 160 }}>
        <img
          src={s.image?.startsWith("http") ? s.image : `${API}${s.image}`}
          alt={s.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div
          style={{
            display: "none",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0F172A, #1E293B)",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            inset: 0,
          }}
        >
          <Icons.ImageOff size={28} color="#334155" />
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <Badge active={s.isActive} />
        </div>
        {s.icon && (
          <div
            style={{
              position: "absolute",
              bottom: -16,
              left: 16,
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#020617",
              border: "1px solid rgba(56,189,248,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ServiceIcon name={s.icon} size={16} />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "20px 16px 14px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 15,
            fontWeight: 600,
            color: "#F8FAFC",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {s.name}
        </h3>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 12,
            color: "#64748B",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {s.shortDescription}
        </p>

        {s.price && (
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 13,
              color: COLORS.accent,
              fontWeight: 600,
            }}
          >
            {s.price}
          </p>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 6,
            borderTop: "1px solid rgba(255,255,255,0.04)",
            paddingTop: 12,
          }}
        >
          <button
            onClick={onView}
            style={{
              flex: 1,
              padding: "7px 0",
              background: `linear-gradient(135deg, ${COLORS.primary}30, ${COLORS.secondary}30)`,
              border: `1px solid ${COLORS.primary}40`,
              borderRadius: 7,
              color: "#93C5FD",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Icons.Eye size={12} />
            View
          </button>
          <button
            onClick={onEdit}
            style={{
              padding: "7px 12px",
              background: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.15)",
              borderRadius: 7,
              color: COLORS.accent,
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icons.Edit size={12} />
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: "7px 12px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 7,
              color: "#F87171",
              cursor: "pointer",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icons.Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ListView({ services, onView, onEdit, onDelete, API }) {
  return (
    <div
      style={{
        background: "#020617",
        border: "1px solid rgba(56,189,248,0.08)",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr 80px 100px 120px",
          padding: "10px 16px",
          background: "rgba(56,189,248,0.04)",
          borderBottom: "1px solid rgba(56,189,248,0.08)",
          fontSize: 11,
          fontWeight: 600,
          color: "#475569",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          gap: 8,
        }}
      >
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Order</span>
        <span>Status</span>
        <span style={{ textAlign: "right" }}>Actions</span>
      </div>

      {services.map((s, i) => (
        <div
          key={s._id}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 80px 100px 120px",
            padding: "12px 16px",
            borderBottom:
              i < services.length - 1
                ? "1px solid rgba(255,255,255,0.03)"
                : "none",
            alignItems: "center",
            gap: 8,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(56,189,248,0.03)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            {s.image ? (
              <img
                src={s.image?.startsWith("http") ? s.image : `${API}${s.image}`}
                alt=""
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ServiceIcon name={s.icon || "Layers"} size={16} />
              </div>
            )}
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#F8FAFC",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {s.name}
            </span>
          </div>

          <span
            style={{
              fontSize: 13,
              color: "#64748B",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {s.category?.name || "—"}
          </span>
          <span style={{ fontSize: 13, color: COLORS.accent, fontWeight: 500 }}>
            {s.price || "—"}
          </span>
          <span style={{ fontSize: 13, color: "#64748B" }}>
            {s.order ?? "—"}
          </span>
          <span>
            <Badge active={s.isActive} />
          </span>

          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              onClick={() => onView(s)}
              style={{
                padding: "5px 10px",
                background: "rgba(37,99,235,0.12)",
                border: "1px solid rgba(37,99,235,0.2)",
                borderRadius: 6,
                color: "#93C5FD",
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icons.Eye size={12} />
            </button>
            <button
              onClick={() => onEdit(s)}
              style={{
                padding: "5px 10px",
                background: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.15)",
                borderRadius: 6,
                color: COLORS.accent,
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icons.Edit size={12} />
            </button>
            <button
              onClick={() => onDelete(s._id)}
              style={{
                padding: "5px 10px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 6,
                color: "#F87171",
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icons.Trash2 size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
