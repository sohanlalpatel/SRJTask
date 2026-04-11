import React, { useEffect, useState } from "react";
import axios from "axios";


const API = import.meta.env.VITE_API_BASE_URL;

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API}/api/contact`);
      setContacts(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this query?")) return;

    try {
      await axios.delete(`${API}/api/contact/${id}`);
      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API}/api/contact/${id}`, { status });
      
      fetchContacts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 bg-[#0F172A] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Contact Queries</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-[#1E293B]">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-700 hover:bg-[#1E293B]"
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.phone}</td>

                  <td className="p-3 max-w-[200px] truncate">{item.message}</td>

                  <td className="p-3">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className="bg-[#0F172A] border border-gray-600 p-2 rounded"
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>

                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContact;
