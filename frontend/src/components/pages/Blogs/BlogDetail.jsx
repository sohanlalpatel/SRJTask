import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Eye, User, Tag } from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";



const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/blogs`;

// const API = "http://localhost:5000/api/blogs";

const imgSrc = (path) =>
  !path
    ? "/placeholder.jpg"
    : path.startsWith("/uploads")
      ? `${BASE}${path}`
      : path;


export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

 useEffect(() => {
   axios
     .get(`${API}/getSingleBlog/${slug}`)
     .then((res) => {
       setBlog(res.data.data);
     })
     .catch((err) => {
       console.error("Blog Detail Error:", err);
       alert("Failed to load blog");
     });
 }, [slug]);

  if (!blog) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <section className="bg-[#0B1220] text-white min-h-screen pb-20">
        {/* HERO IMAGE */}
        <div className="relative w-full h-[400px] md:h-[500px]">
          <img
            src={imgSrc(blog.image)}
            className="w-full h-full object-cover"
            alt="blog"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
            <div className="max-w-6xl mx-auto px-6 pb-10 w-full">
              {/* CATEGORY */}
              <span className="bg-[#38BDF8]/20 text-[#38BDF8] px-3 py-1 rounded-full text-sm">
                {blog.category}
              </span>

              {/* TITLE */}
              <h1 className="text-3xl md:text-5xl font-bold mt-4 leading-tight">
                {blog.title}
              </h1>

              {/* META */}
              <div className="flex flex-wrap gap-6 mt-4 text-gray-300 text-sm items-center">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{blog.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto px-6 mt-12">
          {/* EXCERPT */}
          <p className="text-lg text-gray-400 mb-8 border-l-4 border-[#38BDF8] pl-4 italic">
            {blog.excerpt}
          </p>

          {/* MAIN CONTENT */}
          <div className="mt-6">{formatContent(blog.content)}</div>

          {/* TAGS */}
          <div className="mt-12 flex flex-wrap gap-3">
            {blog.tags?.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-2 bg-[#020617] border border-[#1e293b] px-4 py-1 rounded-full text-sm hover:bg-[#38BDF8]/20 transition"
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* 🔥 FORMAT CONTENT FUNCTION */

const formatContent = (text) => {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();

    if (!trimmed) return <div key={i} className="h-5" />;

    // 🔥 HEADINGS (ALL CAPS)
    if (trimmed.length < 80 && trimmed === trimmed.toUpperCase()) {
      return (
        <h2
          key={i}
          className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-white border-l-4 border-[#38BDF8] pl-4"
        >
          {trimmed}
        </h2>
      );
    }

    // 🔥 FIRST LINE SPECIAL
    if (i === 0) {
      return (
        <h2
          key={i}
          className="text-xl md:text-2xl font-semibold mb-6 text-[#38BDF8]"
        >
          {trimmed}
        </h2>
      );
    }

    // 🔥 PARAGRAPH
    return (
      <p
        key={i}
        className="text-gray-300 leading-8 text-lg tracking-wide first-letter:text-xl first-letter:font-bold first-letter:text-[#38BDF8]"
      >
        {trimmed}
      </p>
    );
  });
};
