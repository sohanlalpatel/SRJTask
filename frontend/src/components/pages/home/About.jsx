import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="bg-[#0F172A] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE - IMAGE + GRAPHICS */}
        <div className="relative">
          {/* Main Image */}
          <img
            src="https://images.pexels.com/photos/4872017/pexels-photo-4872017.jpeg"
            alt="team"
            className="rounded-xl shadow-xl"
          />

          {/* Floating Card 1 */}
          <div className="absolute top-[-20px] left-[-20px] bg-[#2563EB] p-4 rounded-xl shadow-lg">
            <p className="text-sm font-semibold">10+ Years Experience</p>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute bottom-[-20px] right-[-20px] bg-[#7C3AED] p-4 rounded-xl shadow-lg">
            <p className="text-sm font-semibold">Trusted IT Partner</p>
          </div>

          {/* Gradient Glow */}
          <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] blur-3xl opacity-20"></div>
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div>
          <p className="text-[#38BDF8] uppercase tracking-widest mb-3">
            About Our Company
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Empowering Businesses with Modern IT Solutions
          </h2>

          <p className="text-gray-400 mb-6">
            At SRJ Global Technologies, we specialize in delivering high-quality
            digital solutions including website development, mobile apps,
            software systems, and IT consulting services. Our mission is to help
            businesses grow faster with scalable and innovative technology.
          </p>

          <p className="text-gray-400 mb-6">
            We work closely with startups, enterprises, and growing brands to
            build performance-driven, secure, and user-friendly solutions that
            drive real business results.
          </p>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#2563EB] rounded-full"></span>
              <p>Custom Web Development</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#7C3AED] rounded-full"></span>
              <p>Mobile App Solutions</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#38BDF8] rounded-full"></span>
              <p>UI/UX Design</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#2563EB] rounded-full"></span>
              <p>SEO & Digital Growth</p>
            </div>
          </div>

          {/* BUTTON */}

          <Link to={"/about"}>
            <button className="mt-8 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-6 py-3 rounded-lg hover:opacity-90 transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
