import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

const API = "http://localhost:5000/api/blogs";

export default function Blogs() {
  const [blogs, setBlogs]         = useState([]);
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/getAllBlogs`).then((res) => {
      setBlogs(res.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── unique categories extracted from actual blog data ──
  const categories = [
    "All",
    ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))),
  ];

  // ── FIXED FILTER: both search + category work together ──
  const filtered = blogs.filter((b) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      b.title.toLowerCase().includes(q) ||
      (b.shortDesc  || "").toLowerCase().includes(q) ||
      (b.excerpt    || "").toLowerCase().includes(q) ||
      (b.category   || "").toLowerCase().includes(q);

    const matchCat =
      activeTab === "All" ||
      (b.category || "").toLowerCase() === activeTab.toLowerCase();

    return matchSearch && matchCat;
  });

  // featured only on default view (no search / no tab filter)
  const showFeatured = !search.trim() && activeTab === "All";
  const featured     = showFeatured ? filtered[0]    : null;
  const gridBlogs    = showFeatured ? filtered.slice(1) : filtered;

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen"
        style={{ background: "#0F172A",  }}
      >
        {/* ══ HERO BANNER ═══════════════════════════════════════ */}
        <div
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0F172A 0%, #1e1b4b 55%, #0F172A 100%)",
          }}
        >
          {/* dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff07 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          {/* glow orbs */}
          <div
            className="absolute -top-10 left-1/3 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #2563EB1a 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, #7C3AED1a 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 pt-34 sm:px-6 py-20 text-center">
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{
                background: "#2563EB20",
                color: "#38BDF8",
                border: "1px solid #2563EB40",
              }}
            >
              ✦ SRJ Blog
            </span>

            <h1
              className="font-extrabold text-white leading-tight mb-4"
              style={{
                fontSize: "clamp(32px, 6vw, 58px)",
                letterSpacing: "-1.5px",
              }}
            >
              Insights &{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #2563EB, #38BDF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ideas
              </span>
            </h1>

            <p
              className="text-base md:text-lg max-w-md mx-auto mb-10"
              style={{ color: "#94a3b8", lineHeight: 1.7 }}
            >
              Tech tutorials, case studies and deep-dives from the SRJ team.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title, category..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm outline-none transition-all"
                style={{
                  background: "#ffffff0d",
                  backdropFilter: "blur(10px)",
                  border: "1px solid #ffffff1a",
                  color: "#f1f5f9",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xl leading-none transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ══ CATEGORY TAB BAR ══════════════════════════════════ */}
        <div
          className="sticky top-0 z-20"
          style={{
            background: "#F8FAFC",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 8px #00000008",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
              {categories.map((cat) => {
                const active = activeTab === cat;
                const count =
                  cat === "All"
                    ? blogs.length
                    : blogs.filter(
                        (b) =>
                          (b.category || "").toLowerCase() ===
                          cat.toLowerCase(),
                      ).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: active ? "#2563EB" : "transparent",
                      color: active ? "#fff" : "#64748b",
                      boxShadow: active ? "0 4px 14px #2563EB33" : "none",
                      transform: active ? "translateY(-1px)" : "none",
                    }}
                  >
                    {cat}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                      style={{
                        background: active ? "#ffffff25" : "#e2e8f0",
                        color: active ? "#fff" : "#94a3b8",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══ MAIN CONTENT ══════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div
                className="w-10 h-10 border-4 rounded-full"
                style={{
                  borderColor: "#2563EB20",
                  borderTopColor: "#2563EB",
                  animation: "spin 0.75s linear infinite",
                }}
              />
              <p className="text-sm" style={{ color: "#94a3b8" }}>
                Loading articles...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1"
                style={{ background: "#EFF6FF" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="text-lg font-bold" style={{ color: "#0F172A" }}>
                No articles found
              </p>
              <p className="text-sm" style={{ color: "#94a3b8" }}>
                {search
                  ? `No results for "${search}"`
                  : `No posts in "${activeTab}" yet`}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveTab("All");
                }}
                className="mt-3 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#2563EB", color: "#fff" }}
              >
                Clear filters
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {/* ── Featured Article ────────────────────────── */}
              {featured && (
                <Link
                  to={`/blogs/${featured.slug}`}
                  className="group block no-underline mb-12 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                  style={{ background: "#fff", border: "1px solid #e2e8f0" }}
                >
                  <div className="grid md:grid-cols-5 gap-0">
                    {/* Image - 3 cols */}

                    {/* Text - 2 cols */}
                    <div className="md:col-span-2 p-7 md:p-8 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span
                          className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                          style={{ background: "#EFF6FF", color: "#2563EB" }}
                        >
                          Featured
                        </span>
                        {featured.category && (
                          <span
                            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                            style={{ background: "#F5F3FF", color: "#7C3AED" }}
                          >
                            {featured.category}
                          </span>
                        )}
                      </div>

                      <h2
                        className="font-extrabold leading-tight mb-3 transition-colors duration-200 group-hover:text-blue-600"
                        style={{
                          fontSize: "clamp(18px, 2.5vw, 26px)",
                          color: "#0F172A",
                          lineHeight: 1.25,
                        }}
                      >
                        {featured.title}
                      </h2>

                      {(featured.excerpt || featured.shortDesc) && (
                        <p
                          className="text-sm leading-relaxed mb-6"
                          style={{
                            color: "#64748b",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {featured.excerpt || featured.shortDesc}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-auto">
                        <Avatar name={featured.author || "S"} />
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "#0F172A" }}
                          >
                            {featured.author || "SRJ Team"}
                          </p>
                          <p className="text-xs" style={{ color: "#94a3b8" }}>
                            {featured.readTime || "5 min read"}
                            {featured.createdAt &&
                              " · " +
                                new Date(featured.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3 overflow-hidden" style={{ minHeight: "280px", background: "#f1f5f9" }}>
                      {featured.image ? (
                        <img src={`http://localhost:5000${featured.image}`} alt={featured.title}
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ minHeight: "280x" }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "280px" }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {/* ── Count row ───────────────────────────────── */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>
                  Showing{" "}
                  <span style={{ color: "#0F172A", fontWeight: 600 }}>
                    {filtered.length}
                  </span>{" "}
                  article{filtered.length !== 1 ? "s" : ""}
                  {activeTab !== "All" && (
                    <>
                      {" "}
                      in{" "}
                      <span style={{ color: "#7C3AED", fontWeight: 600 }}>
                        "{activeTab}"
                      </span>
                    </>
                  )}
                  {search && (
                    <>
                      {" "}
                      matching{" "}
                      <span style={{ color: "#2563EB", fontWeight: 600 }}>
                        "{search}"
                      </span>
                    </>
                  )}
                </p>
                {(search || activeTab !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveTab("All");
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: "#EFF6FF", color: "#2563EB" }}
                  >
                    Clear ×
                  </button>
                )}
              </div>

              {/* ── Grid ────────────────────────────────────── */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridBlogs.map((blog, i) => (
                  <BlogCard key={blog._id} blog={blog} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .no-underline { text-decoration: none !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input::placeholder { color: #64748b !important; }
        input:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 3px #2563EB15 !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-in { animation: fadeUp 0.35s ease both; }
      `}</style>
    </>
  );
}

// ─── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ blog, index }) {
  return (
    <Link
      to={`/blogs/${blog.slug}`}
      className="card-in group block no-underline rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      style={{
        background: "#0F172A",
        border: "1px solid #e2e8f0",
        animationDelay: `${index * 55}ms`,
      }}
    >
      {/* Image */}
      <div
        className="overflow-hidden"
        style={{ aspectRatio: "16/9", background: "#f1f5f9" }}
      >
        {blog.image ? (
          <img
            src={`http://localhost:5000${blog.image}`}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Category */}
        {blog.category && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg mb-3"
            style={{ background: "#F5F3FF", color: "#7C3AED" }}
          >
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h2
          className="font-bold leading-snug mb-2 transition-colors duration-200 group-hover:text-blue-600"
          style={{ fontSize: "15px", color: "#fff", lineHeight: 1.4 }}
        >
          {blog.title}
        </h2>

        {/* Excerpt */}
        {(blog.excerpt || blog.shortDesc) && (
          <p
            className="text-sm leading-relaxed mb-4"
            style={{
              color: "#64748b",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {blog.excerpt || blog.shortDesc}
          </p>
        )}

        <div
          style={{ height: "1px", background: "#f1f5f9", marginBottom: "14px" }}
        />

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={blog.author || "S"} size={28} fontSize={10} />
            <span className="text-xs font-medium" style={{ color: "#475569" }}>
              {blog.author || "SRJ Team"}
            </span>
          </div>
          <div
            className="flex items-center gap-3 text-xs"
            style={{ color: "#94a3b8" }}
          >
            <span className="flex items-center gap-1">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {blog.readTime || "5 min"}
            </span>
            {blog.views > 0 && (
              <span className="flex items-center gap-1">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {blog.views}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent bar on hover */}
      <div
        className="h-0.5 transition-all duration-300 group-hover:opacity-100 opacity-0"
        style={{ background: "linear-gradient(90deg, #2563EB, #38BDF8)" }}
      />
    </Link>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 34, fontSize = 12 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "#EFF6FF", border: "1.5px solid #BFDBFE",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 700, color: "#2563EB",
    }}>
      {String(name)[0].toUpperCase()}
    </div>
  );
}
