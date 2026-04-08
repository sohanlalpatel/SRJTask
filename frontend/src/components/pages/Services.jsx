import { Monitor, Megaphone, Palette, Gamepad2, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Game Development",
    desc: "Casino games, Aviator, Teen Patti, Andhar Bahar, Roulette, Unity & mobile game development solutions.",
    icon: <Gamepad2 size={28} />,
  },
  {
    title: "Web & App Development",
    desc: "Custom websites, B2B/B2C platforms, eCommerce solutions, and mobile app development for Android & iOS.",
    icon: <Monitor size={28} />,
  },
  {
    title: "Software & ERP Solutions",
    desc: "Inventory management, ERP systems, billing software and scalable enterprise solutions.",
    icon: <Server size={28} />,
  },
  {
    title: "UI/UX & Graphic Design",
    desc: "Modern UI/UX design, logo designing, branding and creative digital experiences.",
    icon: <Palette size={28} />,
  },
  {
    title: "Digital Marketing",
    desc: "SEO, social media marketing, ads campaigns and growth strategies to boost your business.",
    icon: <Megaphone size={28} />,
  },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative py-20 bg-gradient-to-br from-[#0F172A] via-[#1e1b4b] to-[#0F172A] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#38BDF8_1px,_transparent_1px)] [background-size:22px_22px]" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <p className="text-[#38BDF8] text-sm mb-2">
                — What We're Offering
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] leading-tight">
                Dealing in all Professional <br /> IT Services
              </h2>
            </div>

            <p className="text-gray-300 text-sm md:text-base">
              We offer full-cycle software development services that meet varied
              business requirements—from IT strategy consulting to the
              end-to-end development of scalable solutions.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => navigate("/services")} // 🔥 REDIRECT
                className="cursor-pointer relative bg-[#111827] border border-gray-800 p-6 pt-12 rounded-xl text-center 
              hover:-translate-y-2 hover:border-[#7C3AED] transition duration-300"
              >
                {/* Icon Circle */}
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full 
              bg-[#0F172A] border border-[#2563EB] flex items-center justify-center 
              text-[#38BDF8] 
              group-hover:bg-[#2563EB] group-hover:text-white transition"
                >
                  {service.icon}
                </div>

                <h3 className="text-[#F8FAFC] font-semibold text-lg mt-4">
                  {service.title}
                </h3>

                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
