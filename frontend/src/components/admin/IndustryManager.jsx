import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/industries";

export default function IndustryManager() {
  const [industries, setIndustries] = useState([]);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // ================= FETCH =================
  const fetchIndustries = async () => {
    const res = await axios.get(`${API}/getIndustries`);
    setIndustries(res.data.data || []);
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= HANDLE FILE =================
  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (!form.name) return alert("Name required");

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (file) {
        formData.append("industryImage", file); // 🔥 field name
      }

      if (editId) {
        await axios.put(`${API}/updateIndustry/${editId}`, formData);
      } else {
        await axios.post(`${API}/createIndustry`, formData);
      }

      setForm({});
      setFile(null);
      setEditId(null);
      fetchIndustries();
    } catch (err) {
      console.log(err.response?.data);
      alert("Error");
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setForm({
      ...item,
      services: item.services?.join(", "),
      benefits: item.benefits?.join(", "),
    });
    setEditId(item._id);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    await axios.delete(`${API}/deleteIndustry/${id}`);
    fetchIndustries();
  };

  return (
    <div className="p-6 text-white bg-[#0B1220] min-h-screen">
      <h1 className="text-2xl mb-6 font-bold text-[#38BDF8]">
        Industry Manager
      </h1>

      {/* ================= FORM ================= */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          name="name"
          placeholder="Name"
          value={form.name || ""}
          onChange={handleChange}
          className="p-2 bg-[#020617] border border-gray-700"
        />

        <input
          name="desc"
          placeholder="Short Description"
          value={form.desc || ""}
          onChange={handleChange}
          className="p-2 bg-[#020617] border border-gray-700"
        />

        <textarea
          name="content"
          placeholder="Content"
          value={form.content || ""}
          onChange={handleChange}
          className="p-2 bg-[#020617] border border-gray-700 col-span-2"
        />

        <input
          name="services"
          placeholder="Services (comma separated)"
          value={form.services || ""}
          onChange={handleChange}
          className="p-2 bg-[#020617] border border-gray-700"
        />

        <input
          name="benefits"
          placeholder="Benefits (comma separated)"
          value={form.benefits || ""}
          onChange={handleChange}
          className="p-2 bg-[#020617] border border-gray-700"
        />

        <input
          type="number"
          name="order"
          placeholder="Order"
          value={form.order || ""}
          onChange={handleChange}
          className="p-2 bg-[#020617] border border-gray-700"
        />

        <input
          type="file"
          onChange={handleFile}
          className="p-2 bg-[#020617] border border-gray-700"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-[#38BDF8] text-black px-6 py-2 rounded mb-8"
      >
        {editId ? "Update Industry" : "Create Industry"}
      </button>

      {/* ================= LIST ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {industries.map((item) => (
          <div
            key={item._id}
            className="bg-[#020617] border border-gray-700 p-4 rounded-lg"
          >
            {item.image && (
              <img
                src={ item.image}
                className="h-40 w-full object-cover mb-3 rounded"
              />
            )}

            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}