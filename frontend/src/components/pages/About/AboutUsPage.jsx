import React from "react";
import {
  ArrowRight,
  Target,
  Zap,
  CheckCircle,
  Star,
  ArrowUpRight,
} from "lucide-react";
import Footer from "../home/Footer";
import Navbar from "../home/Navbar";
import Stats from "../home/Stats";
import { Link, useNavigate } from "react-router-dom";

export default function About() {
  const stats = [
    { number: "500+", label: "Projects Delivered" },
    { number: "50+", label: "Team Members" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" },
  ];
const navigate = useNavigate();
const team = [
  {
    name: "Arjun Malhotra",
    role: "CEO & Founder",
    desc: "Leading vision, strategy, and global expansion.",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Emily Carter",
    role: "Chief Technology Officer",
    desc: "Driving innovation with scalable architecture.",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    name: "Rohan Desai",
    role: "Head of Engineering",
    desc: "Building high-performance systems & APIs.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Sophia Martinez",
    role: "Product Manager",
    desc: "Delivering user-focused digital experiences.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Karan Mehta",
    role: "Senior Backend Developer",
    desc: "Expert in Node.js, databases & microservices.",
    image: "https://randomuser.me/api/portraits/men/73.jpg",
  },
  {
    name: "Neha Kapoor",
    role: "UI/UX Designer",
    desc: "Designing modern, intuitive interfaces.",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    name: "Daniel Lee",
    role: "DevOps Engineer",
    desc: "Cloud, CI/CD, and scalable deployments.",
    image: "https://randomuser.me/api/portraits/men/81.jpg",
  },
  {
    name: "Ananya Sharma",
    role: "Digital Marketing Lead",
    desc: "Growth strategies & performance marketing.",
    image: "https://randomuser.me/api/portraits/women/50.jpg",
  },
];
  const testimonials = [
    {
      name: "John Doe",
      company: "Tech Corp",
      text: "SRJ transformed our business completely.",
    },
    {
      name: "Emma Wilson",
      company: "Global Solutions",
      text: "Outstanding service and support!",
    },
    {
      name: "Michael Brown",
      company: "Innovation Labs",
      text: "Highly recommended IT partner.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-[#0B1220] text-white ">
        {/* ================= HERO ================= */}
        <section className="relative min-h-[90vh] pt-10 md:pt-20  flex items-center bg-[#0B1220] overflow-hidden">
          {/* 🔥 Background glow */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#6366F1]/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0EA5E9]/20 blur-3xl rounded-full"></div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 py-20 relative z-10">
            {/* ================= LEFT CONTENT ================= */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                We Build Smart &
                <span className="block bg-gradient-to-r from-[#38BDF8] to-[#7C3AED] bg-clip-text text-transparent">
                  Scalable Digital Products
                </span>
              </h1>

              <p className="text-gray-400 text-lg mb-6 max-w-lg">
                SRJ Software Company delivers modern web, mobile, and enterprise
                solutions designed for performance, scalability, and growth.
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/pricing")}
                  className="border border-[#1e293b] px-6 py-3 rounded-lg hover:bg-[#020617]"
                >
                  Get Started
                </button>

                {/* <button className="border border-[#1e293b] px-6 py-3 rounded-lg hover:bg-[#020617]">
                  View Projects
                </button> */}
              </div>

              {/* Small stats */}
              {/* <div className="flex gap-8 mt-10 text-sm text-gray-400">
                <div>
                  <p className="text-white font-bold text-lg">500+</p>
                  Projects
                </div>
                <div>
                  <p className="text-white font-bold text-lg">50+</p>
                  Clients
                </div>
                <div>
                  <p className="text-white font-bold text-lg">10+</p>
                  Years
                </div>
              </div> */}
            </div>

            {/* ================= RIGHT GRAPHICS ================= */}
            <div className="relative">
              {/* Main Image */}
              <img
                src="https://images.pexels.com/photos/7988208/pexels-photo-7988208.jpeg"
                className="rounded-2xl shadow-2xl"
              />

              {/* Floating Card 1 */}
              <div className="absolute -top-6 -left-6 bg-[#020617] border border-[#1e293b] p-4 rounded-xl shadow-lg">
                <p className="text-sm text-gray-400">Projects</p>
                <p className="text-xl font-bold text-[#38BDF8]">1200+</p>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -bottom-6 -right-6 bg-[#020617] border border-[#1e293b] p-4 rounded-xl shadow-lg">
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-xl font-bold text-green-400">98%</p>
              </div>

              {/* Floating Icon Card */}
              <div className="absolute top-1/2 -right-10 bg-gradient-to-r from-[#6366F1] to-[#0EA5E9] p-3 rounded-xl shadow-lg">
                ⚡
              </div>
            </div>
          </div>
        </section>

        <Stats />

        {/* <section className="py-16 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-[#020617] p-6 rounded-xl border border-[#1e293b] text-center"
              >
                <h2 className="text-3xl font-bold text-[#38BDF8]">
                  {s.number}
                </h2>
                <p className="text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section> */}

        <section className="py-24 px-6 bg-[#0B1220]">
          <div className="max-w-7xl mx-auto">
            {/* 🔥 TOP HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Selected Work That
                  <span className="block bg-gradient-to-r from-[#38BDF8] to-[#7C3AED] bg-clip-text text-transparent">
                    Drives Results
                  </span>
                </h2>
              </div>

              <p className="text-gray-400 max-w-md">
                We create impactful digital products for startups and
                enterprises, focusing on performance, design, and scalability.
              </p>
            </div>

            {/* 🔥 PROJECT GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "E-Commerce Platform",
                  category: "Web Development",
                  img: "https://images.unsplash.com/photo-1557821552-17105176677c",
                },
                {
                  title: "FinTech Dashboard",
                  category: "UI/UX + React",
                  img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
                },
                {
                  title: "Mobile Banking App",
                  category: "Mobile App",
                  img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
                },
              ].map((project, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/services")}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                >
                  {/* IMAGE */}
                  <img
                    src={project.img}
                    className="w-full h-[300px] object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 p-6">
                    <p className="text-sm text-[#38BDF8] mb-1">
                      {project.category}
                    </p>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                  </div>

                  {/* HOVER ICON */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                    ↗
                  </div>
                </div>
              ))}
            </div>

            {/* 🔥 VIEW MORE BUTTON */}
            <div className="text-center mt-16"></div>
          </div>
        </section>

        {/* ================= WHY ================= */}
        <section className="py-24 px-6 bg-[#020617] relative overflow-hidden">
          {/* 🔥 Background glow */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#6366F1]/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#0EA5E9]/20 blur-3xl rounded-full"></div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
            {/* ================= LEFT ================= */}
            <div>
              <p className="text-[#38BDF8] mb-2">💡 Why Choose Us</p>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                We Deliver Results,
                <span className="block bg-gradient-to-r from-[#38BDF8] to-[#7C3AED] bg-clip-text text-transparent">
                  Not Just Projects
                </span>
              </h2>

              <p className="text-gray-400 mb-8 max-w-lg">
                At SRJ Global, we focus on building scalable, high-performance
                solutions that drive real business growth and long-term success.
              </p>

              <button
                onClick={() => navigate("/pricing")}
                className="bg-gradient-to-r from-[#2563EB] to-[#38BDF8] px-6 py-3 rounded-lg"
              >
                Get Started
              </button>
            </div>

            {/* ================= RIGHT CARDS ================= */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Expert Team",
                  desc: "Highly skilled developers & designers",
                  icon: "👨‍💻",
                },
                {
                  title: "Fast Delivery",
                  desc: "Quick turnaround without compromise",
                  icon: "⚡",
                },
                {
                  title: "Secure Systems",
                  desc: "Enterprise-grade security standards",
                  icon: "🔒",
                },
                {
                  title: "Scalable Solutions",
                  desc: "Built to grow with your business",
                  icon: "📈",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:scale-105 hover:border-[#38BDF8] transition"
                >
                  {/* ICON */}
                  <div className="text-3xl mb-4">{item.icon}</div>

                  {/* TITLE */}
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>

                  {/* DESC */}
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TEAM ================= */}
        <section className="py-24 px-6 bg-[#020617] text-white">
          {/* HEADER */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our Experts
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A team of passionate developers, designers, and strategists
              dedicated to building world-class digital solutions.
            </p>
          </div>

          {/* TEAM GRID */}
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {team.map((m, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-b from-[#0B1220] to-[#020617] border border-[#1e293b] rounded-2xl p-6 text-center hover:scale-105 transition duration-300 overflow-hidden"
              >
                {/* GLOW EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#38BDF8]/10 to-[#7C3AED]/10 opacity-0 group-hover:opacity-100 transition"></div>

                {/* IMAGE */}
                <div className="relative z-10">
                  <img
                    src={m.image}
                    className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-[#0B1220] shadow-lg"
                  />

                  {/* NAME */}
                  <h3 className="text-lg font-semibold">{m.name}</h3>

                  {/* ROLE */}
                  <p className="text-sm text-[#38BDF8] mb-2">{m.role}</p>

                  {/* EXTRA INFO */}
                  <p className="text-xs text-gray-400 mb-4">{m.desc}</p>

                  {/* SOCIAL ICONS */}
                  <div className="flex justify-center gap-3 mt-3">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0F172A] hover:bg-[#38BDF8] transition cursor-pointer">
                      🔗
                    </span>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0F172A] hover:bg-[#38BDF8] transition cursor-pointer">
                      💼
                    </span>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0F172A] hover:bg-[#38BDF8] transition cursor-pointer">
                      ✉️
                    </span>
                  </div>
                </div>

                {/* HOVER LINE */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#38BDF8] group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </section>
        {/* ================= TESTIMONIAL ================= */}

        {/* ================= CTA ================= */}
        <section className="py-20 text-center bg-gradient-to-r from-[#081b44] to-[#0b3c51]">
          <h2 className="text-4xl font-bold mb-4">
            Let’s Build Something Great
          </h2>

          <button
            onClick={() => navigate("/services")}
            className="bg-white text-black px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
          >
            Start Now <ArrowUpRight size={16} />
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
}
