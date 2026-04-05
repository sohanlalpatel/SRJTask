import React, { useEffect, useState } from "react";
import axios from "axios";

const CAT_API = "http://localhost:5000/api/categories";
const PLAN_API = "http://localhost:5000/api/plans";
const ADDON_API = "http://localhost:5000/api/addons";

export default function PricingManager() {
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [addons, setAddons] = useState([]);

  const [activeTab, setActiveTab] = useState("category");

  const [form, setForm] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // ================= FETCH =================
  const fetchAll = async () => {
    const cat = await axios.get(`${CAT_API}/getCategories`);
    const plan = await axios.get(`${PLAN_API}/getPlans`);
    const add = await axios.get(`${ADDON_API}/getAddOns`);

    setCategories(cat.data);
    setPlans(plan.data);
    setAddons(add.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (activeTab === "category") {
        editId
          ? await axios.put(`${CAT_API}/updateCategory/${editId}`, form)
          : await axios.post(`${CAT_API}/createCategory`, form);
      }

      if (activeTab === "plan") {
        editId
          ? await axios.put(`${PLAN_API}/updatePlan/${editId}`, form)
          : await axios.post(`${PLAN_API}/createPlan`, form);
      }

      if (activeTab === "addon") {
        editId
          ? await axios.put(`${ADDON_API}/updateAddOn/${editId}`, form)
          : await axios.post(`${ADDON_API}/createAddOn`, form);
      }

      fetchAll();
      setIsOpen(false);
      setForm({});
      setEditId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Delete item?")) return;

    if (activeTab === "category")
      await axios.delete(`${CAT_API}/deleteCategory/${id}`);

    if (activeTab === "plan")
      await axios.delete(`${PLAN_API}/deletePlan/${id}`);

    if (activeTab === "addon")
      await axios.delete(`${ADDON_API}/deleteAddOn/${id}`);

    fetchAll();
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setForm({
      ...item,
      features: item.features?.join(", "),
      technologies: item.technologies?.join(", "),
      category: item.category?._id || item.category,
    });

    setEditId(item._id);
    setIsOpen(true);
  };

  const inputStyle ="w-full p-2 bg-[#0F172A] text-white border border-[#1e293b] rounded";

  // ================= UI =================
  return (
    <div className="p-6 bg-[#0F172A] min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#38BDF8]">Pricing Manager</h2>

        <button
          onClick={() => {
            setIsOpen(true);
            setForm({});
            setEditId(null);
          }}
          className="bg-[#2563EB] px-4 py-2 rounded hover:bg-[#7C3AED]"
        >
          + Add
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {["category", "plan", "addon"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-[#2563EB]"
                : "bg-[#020617] border border-[#1e293b]"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "category" &&
          categories.map((c) => (
            <Card item={c} onEdit={handleEdit} onDelete={handleDelete} />
          ))}

        {activeTab === "plan" &&
          categories.map((cat) => {
            const filteredPlans = plans.filter(
              (p) => p.category === cat._id || p.category?._id === cat._id,
            );

            if (filteredPlans.length === 0) return null;

            return (
              <div key={cat._id} className="col-span-full">
                <h3 className="text-xl font-bold text-[#38BDF8] mb-3">
                  {cat.name}
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlans.map((p) => (
                    <Card
                      key={p._id}
                      item={p}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        {activeTab === "addon" &&
          addons.map((a) => (
            <Card item={a} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-[#020617] p-6 ml-20 rounded-xl w-full max-w-lg border border-[#1e293b]">
            <h3 className="text-xl mb-4">
              {editId ? "Edit" : "Create"} {activeTab}
            </h3>

            {/* CATEGORY FORM */}
            {activeTab === "category" && (
              <input
                name="name"
                placeholder="Category Name"
                value={form.name || ""}
                onChange={handleChange}
                className="w-full p-2 bg-[#0F172A] border border-[#1e293b] rounded"
              />
            )}

            {/* PLAN FORM */}
            {activeTab === "plan" && (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-3 ">
                <input
                  name="name"
                  placeholder="Plan Name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#0F172A] border border-[#1e293b] rounded"
                />

                <input
                  name="basePrice"
                  placeholder="Base Price"
                  value={form.basePrice || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                {/* CATEGORY */}
                <select
                  name="category"
                  value={form.category || ""}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* NEW FIELDS 🔥 */}
                <input
                  name="duration"
                  placeholder="Duration (monthly / one-time)"
                  value={form.duration || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  name="pages"
                  placeholder="Pages (e.g. 5 pages)"
                  value={form.pages || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  name="deliveryTime"
                  placeholder="Delivery Time (5 days)"
                  value={form.deliveryTime || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  name="revisions"
                  placeholder="Revisions (2 revisions)"
                  value={form.revisions || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  name="support"
                  placeholder="Support (1 month support)"
                  value={form.support || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                {/* 🔥 ARRAY INPUTS */}
                <input
                  name="features"
                  placeholder="Features (comma separated)"
                  value={form.features || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  name="technologies"
                  placeholder="Technologies (React, Node)"
                  value={form.technologies || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                {/* BOOLEAN */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isPopular || false}
                    onChange={(e) =>
                      setForm({ ...form, isPopular: e.target.checked })
                    }
                  />
                  <span>Mark as Popular</span>
                </label>

                <input
                  name="ctaText"
                  placeholder="CTA Button Text"
                  value={form.ctaText || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  name="order"
                  placeholder="Order (1,2,3)"
                  value={form.order || ""}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {/* ADDON FORM */}
            {activeTab === "addon" && (
              <div className="space-y-2">
                <input
                  name="name"
                  placeholder="Add-on Name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="input p-2 "
                />
                <br />
                <input
                  name="basePrice"
                  placeholder="Price"
                  value={form.basePrice || ""}
                  onChange={handleChange}
                  className="input p-2"
                />
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-[#2563EB] px-4 py-2 rounded hover:bg-[#7C3AED]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= CARD COMPONENT =================
function Card({ item, onEdit, onDelete }) {
  return (
    <div className="bg-[#020617] p-5 rounded-xl border border-[#1e293b] relative">
      {/* Popular Badge */}
      {item.isPopular && (
        <span className="absolute top-2 right-2 bg-purple-600 text-xs px-2 py-1 rounded">
          Popular
        </span>
      )}

      <h3 className="text-lg font-bold text-[#38BDF8]">{item.name}</h3>
      {item.basePrice && <p>₹ {item.basePrice}</p>}

      <p className="text-sm text-gray-400">{item.pages}</p>
      <p className="text-sm text-gray-400">{item.deliveryTime}</p>

      {/* FEATURES */}
      <ul className="mt-3 text-sm space-y-1">
        {item.features?.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      {/* CTA */}
      {/* <button className="mt-4 w-full bg-blue-600 py-2 rounded hover:bg-blue-700">
        {item.ctaText || "Get Started"}
      </button> */}

      <div className="flex justify-between mt-4">
        <button onClick={() => onEdit(item)} className="text-[#38BDF8]">
          Edit
        </button>

        <button onClick={() => onDelete(item._id)} className="text-red-400">
          Delete
        </button>
      </div>
    </div>
  );
}