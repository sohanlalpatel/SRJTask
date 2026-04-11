import { useEffect, useState } from "react";
import BlogEditor from "./BlogEditor";
 
// const API = "http://localhost:5000/api/blogs";

const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/blogs`;




export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
     category: "",
    tags: "",
    isPublished: true,
  });

  const [image, setImage] = useState(null);
const [content, setContent] = useState("");

  // ✅ Fetch
 const fetchBlogs = async () => {
   try {
     const res = await fetch(`${API}/admin/all`);
     const data = await res.json();
     setBlogs(data.data || []);
   } catch (err) {
     console.error(err);
     alert("Failed to load blogs");
   }
 };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
Object.keys(form).forEach((k) => fd.append(k, form[k]));

// ✅ ONLY ONE content
fd.append("content", content || "");
   
    if (image) fd.append("blogImage", image);
 
    const url = editingId
      ? `${API}/updateBlog/${editingId}`
      : `${API}/createBlog`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: fd });
    const data = await res.json();

    if (data.success) {
      fetchBlogs();
      setOpen(false);
      resetForm();
    }
  };

  // ✅ Edit
  const handleEdit = (blog) => {
    setEditingId(blog._id);
setForm({
  title: blog.title,
  excerpt: blog.excerpt,
  category: blog.category,
  tags: blog.tags?.join(", "),
  isPublished: blog.isPublished,
});

// ✅ Editor state alag set karo
setContent(blog.content || "");
    setOpen(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete blog?")) return;
    await fetch(`${API}/deleteBlog/${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  // ✅ Reset
  const resetForm = () => {
    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      isPublished: true,
    });
    setEditingId(null);
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#38BDF8]">Blog Manager</h1>
        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="bg-[#7C3AED] px-4 py-2 rounded-lg"
        >
          + New Blog
        </button>
      </div>

      {/* MODAL FORM */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-[#020617] p-6 rounded-xl w-full max-w-2xl grid gap-4"
          >
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Blog" : "Create Blog"}
            </h2>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="p-2 rounded bg-[#0F172A]"
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-2 rounded bg-[#0F172A]"
            >
              <option value="">Select Category</option>
              <option>Web Development</option>
              <option>App Development</option>
              <option>Digital Marketing</option>
              <option>SEO</option>
              <option>Design</option>
              <option>Business</option>
            </select>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="p-2 rounded bg-[#0F172A]"
            />

            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Short Description"
              className="p-2 rounded bg-[#0F172A]"
              required
            />

            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={5}
              className="p-2 rounded bg-[#0F172A]"
              required
            />

            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

            <label className="flex gap-2">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
              />
              Publish
            </label>

            <div className="flex gap-3">
              <button type="submit" className="bg-[#2563EB] px-4 py-2 rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BLOG CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-[#020617] rounded-xl overflow-hidden shadow-lg"
          >
           <img src={`${BASE}${blog.image}`}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="font-bold text-lg">{blog.title}</h2>
              <p className="text-sm text-gray-400">{blog.excerpt}</p>

              <div className="flex justify-between mt-4">
                <span className="text-xs">
                  {blog.isPublished ? "Published" : "Draft"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="bg-[#38BDF8] px-2 py-1 rounded text-black"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-500 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
