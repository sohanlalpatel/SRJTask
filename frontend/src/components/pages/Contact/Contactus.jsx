import React, { useState } from "react";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

const ContactUs = () => {
  // STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      !formData.message
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/contact/create",
        formData,
      );

      alert(res.data.message);

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-[#0F172A] text-white min-h-screen">
        {/* HERO */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#2563EB] to-[#7C3AED] pt-34 py-16 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact SRJ Global Technology
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let’s talk. We’re here to help you grow your
            business
          </p>
        </div>

        {/* MAIN */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
          {/* FORM */}
          <div className="bg-[#1E293B] p-8 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-[#0F172A] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB]"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full bg-[#0F172A] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB]"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-[#0F172A] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB]"
              />

              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-[#0F172A] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="">Select Service</option>

                {/* GAME DEVELOPMENT */}
                <option value="Casino Game Development">
                  Casino Game Development
                </option>
                <option value="Unity Game Development">
                  Unity Game Development
                </option>
                <option value="Spin & Fun Games">Spin & Fun Games</option>
                <option value="Matka Game">Matka Game</option>
                <option value="Roulette Game">Roulette Game</option>
                <option value="Andar Bahar Game">Andar Bahar Game</option>
                <option value="Aviator Game">Aviator Game</option>
                <option value="Teen Patti Game">Teen Patti Game</option>
                <option value="Color Prediction Game">
                  Color Prediction Game
                </option>
                <option value="Game Clone Development">
                  Game Clone Development
                </option>

                {/* PLATFORM BASED */}
                <option value="Web Game Development">
                  Web Game Development
                </option>
                <option value="App Game Development">
                  App Game Development
                </option>
                <option value="Android Game Development">
                  Android Game Development
                </option>
                <option value="iOS Game Development">
                  iOS Game Development
                </option>
                <option value="Flutter Game Development">
                  Flutter Game Development
                </option>

                {/* SOFTWARE */}
                <option value="ERP Software">ERP Software</option>
                <option value="Inventory Management">
                  Inventory Management
                </option>
                <option value="Billing Software">Billing Software</option>

                {/* WEB SERVICES */}
                <option value="Website Development">Website Development</option>
                <option value="E-commerce Website">E-commerce Website</option>
                <option value="B2B Website">B2B Website</option>
                <option value="B2C Website">B2C Website</option>

                {/* DESIGN */}
                <option value="Logo Design">Logo Design</option>
                <option value="UI/UX Design">UI/UX Design</option>

                {/* HOSTING */}
                <option value="Domain & Hosting">Domain & Hosting</option>
                <option value="Domain Renewal">Domain Renewal</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Your Message"
                className="w-full bg-[#0F172A] border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-[#2563EB]"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563EB] py-3 rounded-lg font-semibold hover:bg-[#1E40AF] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-6">
            <div className="bg-[#1E293B] p-6 rounded-xl shadow border border-gray-700 flex items-center gap-4 hover:border-[#2563EB] transition">
              <FaPhoneAlt className="text-[#38BDF8] text-2xl" />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-gray-400">+91 9876543210</p>
              </div>
            </div>

            <div className="bg-[#1E293B] p-6 rounded-xl shadow border border-gray-700 flex items-center gap-4 hover:border-[#7C3AED] transition">
              <FaEnvelope className="text-[#7C3AED] text-2xl" />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-gray-400">info@srjglobaltechnology.com</p>
              </div>
            </div>

            <div className="bg-[#1E293B] p-6 rounded-xl shadow border border-gray-700 flex items-center gap-4 hover:border-[#38BDF8] transition">
              <FaMapMarkerAlt className="text-[#38BDF8] text-2xl" />
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p className="text-gray-400">New Delhi, India</p>
              </div>
            </div>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 py-3 rounded-xl font-semibold hover:bg-green-600 transition shadow-lg"
            >
              <FaWhatsapp />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* MAP */}
        <div className="w-full h-[400px] grayscale opacity-80">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
          ></iframe>
        </div>

        {/* CTA */}
        <div className="bg-[#020617] text-center py-10 px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-400 mb-5">
            Let’s build something amazing together 💡
          </p>

          <a
            href="https://wa.me/919876543210"
            className="bg-[#38BDF8] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#0EA5E9] transition"
          >
            Contact Now
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
