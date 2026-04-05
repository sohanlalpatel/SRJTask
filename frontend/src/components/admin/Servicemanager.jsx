import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Icons from "lucide-react";
const API = "http://localhost:5000/api/services";

export default function ServiceManager() {
  const [services, setServices] = useState([]);
 const [form, setForm] = useState({
   name: "",
   slug: "",
   shortDescription: "",
   description: "",
   features: "",
   price: "",
   icon: "",
   order: "",
   serviceImage: null,
   isActive: true,
 });

  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
const [selected, setSelected] = useState(null);

  // ================= FETCH =================
  const fetchServices = async () => {
    const res = await axios.get(`${API}/getAllServices`);
    setServices(res.data.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= SUBMIT =================
const handleSubmit = async () => {
  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("slug", form.slug);
  formData.append("shortDescription", form.shortDescription);
  formData.append("description", form.description);
  formData.append("features", form.features);
  formData.append("price", form.price);
  formData.append("icon", form.icon);
  formData.append("order", form.order);
  formData.append("isActive", form.isActive);

  if (form.serviceImage) {
    formData.append("image", form.serviceImage);
  }

  if (editId) {
    await axios.put(`${API}/updateService/${editId}`, formData);
  } else {
    await axios.post(`${API}/createService`, formData);
  }

  fetchServices();
  resetForm();
};
  // ================= RESET =================
 const resetForm = () => {
   setForm({
     name: "",
     slug: "",
     shortDescription: "",
     description: "",
     features: "",
     price: "",
     icon: "",
     order: "",
     serviceImage: null,
     isActive: true,
   });

   setEditId(null);
   setIsOpen(false);
 };
  // ================= EDIT =================
const handleEdit = (service) => {
  setForm({
    ...service,
    features: service.features?.join(", "),
    order: service.order || "",
  });
  setEditId(service._id);
  setIsOpen(true);
};

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (confirm("Delete this service?")) {
      await axios.delete(`${API}/deleteService/${id}`);
      fetchServices();
    }
  };

  return (
    <div className="p-6 bg-[#000a14] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Service Manager</h2>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#7C3AED]"
        >
          + Add Service
        </button>
      </div>

      {/* TABLE */}
      {/* <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3 font-medium">{s.name}</td>

                <td>
                  {s.image && (
                    <img
                      src={s.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>

                <td>{s.price}</td>
                <td>{s.order}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      s.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-[#020617] rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-44 object-cover group-hover:scale-105 transition"
              />
              <div className="mb-3 text-white">
                {Icons[s.icon] &&
                  React.createElement(Icons[s.icon], { size: 30 })}
              </div>

              {/* Status Badge */}
              {/* <span
                className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full ${
                  s.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {s.isActive ? "Active" : "Inactive"}
              </span> */}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white">{s.name}</h3>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {s.shortDescription}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setSelected(s)}
                  className="bg-[#2563EB] text-white px-3 py-1 rounded hover:bg-[#7C3AED]"
                >
                  View
                </button>

                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-[#2563EB] font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "Edit Service" : "Add Service"}
            </h3>

            <div className="space-y-3">
              <input
                name="name"
                placeholder="Service Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="shortDescription"
                placeholder="Short Description"
                value={form.shortDescription}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                placeholder="Full Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* SLUG */}
              <input
                name="slug"
                placeholder="Slug (auto or manual)"
                value={form.slug}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* PRICE */}
              <input
                name="price"
                placeholder="Price (e.g. Starting ₹9,999)"
                value={form.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* ORDER */}
              <input
                name="order"
                placeholder="Order (1,2,3)"
                value={form.order}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* <input
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              /> */}
              {/* <input
                name="icon"
                placeholder="Icon Name (e.g. Monitor, Code, Globe)"
                value={form.icon || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              /> */}
              <select
                name="icon"
                value={form.icon || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Service Icon</option>

                <option value="Monitor">Website Designing</option>
                <option value="Palette">Graphic Designing</option>
                <option value="PenTool">Logo Designing</option>
                <option value="Layout">Custom Website Design</option>
                <option value="Code">Web Development</option>
                <option value="ShoppingCart">E-Commerce Development</option>
                <option value="Smartphone">App Development</option>
                <option value="Gamepad2">Game Development</option>
                <option value="Globe">WordPress Development</option>
                <option value="Megaphone">Digital Marketing</option>
                <option value="Search">SEO</option>
                <option value="MousePointerClick">PPC Advertising</option>
                <option value="FileText">Content Writing</option>
                <option value="Server">Web Hosting</option>
                <option value="MessageSquare">Bulk SMS</option>
                <option value="MessageCircle">WhatsApp Marketing</option>
                <option value="Globe">Domain Registration</option>
              </select>
              <input
                type="file"
                name="serviceImage"
                onChange={(e) =>
                  setForm({ ...form, serviceImage: e.target.files[0] })
                }
                className="w-full border p-2 rounded"
              />

              <input
                name="features"
                placeholder="Features (comma separated)"
                value={form.features}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* Toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Active Service
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end mt-5 gap-3">
              <button onClick={resetForm} className="px-4 py-2 border rounded">
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-[#2563EB] text-white px-4 py-2 rounded hover:bg-[#7C3AED]"
              >
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl w-full rounded-xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={selected.image}
              className="w-full h-52 object-cover rounded-lg"
            />

            {/* Title */}
            <h2 className="text-2xl font-bold mt-4 text-[#0F172A]">
              {selected.name}
            </h2>

            {/* Status */}
            {/* <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                selected.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {selected.isActive ? "Active" : "Inactive"}
            </span> */}

            {/* Description */}
            <p className="text-gray-600 mt-4">{selected.description}</p>

            {/* Features */}
            <div className="mt-4">
              <h4 className="font-semibold text-[#0F172A] mb-2">Features</h4>
              <ul className="list-disc pl-5 text-gray-600">
                {selected.features?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}