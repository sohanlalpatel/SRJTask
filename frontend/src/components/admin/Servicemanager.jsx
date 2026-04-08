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
   category: "",
   price: "",
   icon: "",
   order: "",
   serviceImage: null,
   isActive: true,
 });

  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
const [selected, setSelected] = useState(null);
const [categories, setCategories] = useState([]);
  // ================= FETCH =================
 const fetchServices = async () => {
   try {
     const res = await axios.get(`${API}/getAllServices`);
     setServices(res.data.data || []);
   } catch (error) {
     console.error("Error fetching services:", error);
   }
 };

 const fetchCategories = async () => {
   try {
     const res = await axios.get(
       "http://localhost:5000/api/categories/getCategories",
     );
     setCategories(res.data.data || []);
   } catch (error) {
     console.error("Error fetching categories:", error);
   }
 };

 useEffect(() => {
   fetchServices();
   fetchCategories();
 }, []);



const groupedServices = services.reduce((acc, service) => {
  const categoryName = service.category?.name || "Other";

  if (!acc[categoryName]) {
    acc[categoryName] = [];
  }

  acc[categoryName].push(service);
  return acc;
}, {});

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
   formData.append("category", form.category);
  formData.append("shortDescription", form.shortDescription);
  formData.append("description", form.description);
  formData.append("features", form.features);
  formData.append("price", form.price);
  formData.append("icon", form.icon);
  formData.append("order", form.order);
  formData.append("isActive", form.isActive);

  if (form.serviceImage) {
    formData.append("serviceImage", form.serviceImage);
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
     category: "",
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
    name: service.name || "",
    shortDescription: service.shortDescription || "",
    description: service.description || "",
    features: service.features?.join(", ") || "",
    price: service.price || "",
    icon: service.icon || "",
    order: service.order || "",
    category: service.category?._id || "",
    isActive: service.isActive,
    serviceImage: null,
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
      <div className=" ">
        {Object.entries(groupedServices).map(([categoryName, services]) => (
          <div key={categoryName} className="mb-10 w-full">
            {/* CATEGORY TITLE */}
            <h2 className="text-2xl font-bold text-[#38BDF8] mb-4">
              {categoryName}
            </h2>

            {/* SERVICES GRID */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s._id}
                  className="bg-[#020617] rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-44 object-cover"
                  />

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white">
                      {s.name}
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">
                      {s.shortDescription}
                    </p>

                    {/* ✅ BUTTONS INSIDE CARD */}
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
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-3 sm:px-6">
          {/* MODAL BOX */}
          <div className="bg-white w-full max-w-xl md:max-w-2xl lg:max-w-3xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-lg sm:text-xl font-semibold">
                {editId ? "Edit Service" : "Add Service"}
              </h3>
            </div>

            {/* SCROLLABLE BODY 🔥 */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* INPUTS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  placeholder="Service Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  name="shortDescription"
                  placeholder="Short Description"
                  value={form.shortDescription}
                  onChange={handleChange}
                  className="w-full border p-2 rounded sm:col-span-2"
                />

                <textarea
                  name="description"
                  placeholder="Full Description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border p-2 rounded sm:col-span-2"
                  rows={4}
                />

                <input
                  name="slug"
                  placeholder="Slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />

                <input
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />

                <input
                  name="order"
                  placeholder="Order"
                  value={form.order}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />

                <select
                  name="icon"
                  value={form.icon || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded sm:col-span-2"
                >
                  <option value="">Select Service Icon</option>
                  <option value="Monitor">Website Designing</option>
                  <option value="Palette">Graphic Designing</option>
                  <option value="PenTool">Logo Designing</option>
                  <option value="Layout">Custom Website Design</option>
                  <option value="Code">Web Development</option>
                  <option value="ShoppingCart">E-Commerce</option>
                  <option value="Smartphone">App Development</option>
                  <option value="Gamepad2">Game Development</option>
                  <option value="Globe">WordPress</option>
                  <option value="Megaphone">Digital Marketing</option>
                  <option value="Search">SEO</option>
                  <option value="MousePointerClick">PPC</option>
                  <option value="FileText">Content Writing</option>
                  <option value="Server">Hosting</option>
                </select>

                <input
                  type="file"
                  name="serviceImage"
                  onChange={(e) =>
                    setForm({ ...form, serviceImage: e.target.files[0] })
                  }
                  className="w-full border p-2 rounded sm:col-span-2"
                />

                <input
                  name="features"
                  placeholder="Features (comma separated)"
                  value={form.features}
                  onChange={handleChange}
                  className="w-full border p-2 rounded sm:col-span-2"
                />

                <label className="flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  Active Service
                </label>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 sm:p-5 border-t flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-[#2563EB] text-white px-4 py-2 rounded hover:bg-[#7C3AED] w-full sm:w-auto"
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