import React, { useEffect, useState } from "react";
import { Users, Briefcase, Award, Headphones } from "lucide-react";

const stats = [
  { number: 850, suffix: "+", label: "Clients Worldwide", icon: <Users /> },
  {
    number: 1252,
    suffix: "+",
    label: "Projects Completed",
    icon: <Briefcase />,
  },
  { number: 10, suffix: "+", label: "Years Experience", icon: <Award /> },
  {
    number: 24,
    suffix: "/7",
    label: "Support Available",
    icon: <Headphones />,
  },
];

const Stats = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((count, i) => {
          const target = stats[i].number;
          if (count < target) {
            return Math.min(count + Math.ceil(target / 60), target);
          }
          return count;
        }),
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* 🔥 Background Image */}
      <div
        className="absolute inset-0 -z-10 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070')",
        }}
      ></div>

      {/* 🔥 Dark Overlay */}
      <div className="absolute inset-0 bg-[#0F172A]/85 -z-10"></div>

      {/* 🔥 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 via-[#7C3AED]/20 to-[#38BDF8]/20 -z-10"></div>

      {/* 🔥 Parallax Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#2563EB] opacity-20 blur-3xl rounded-full animate-float"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#7C3AED] opacity-20 blur-3xl rounded-full animate-float delay-200"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Our Achievements
          </h2>
          <p className="text-gray-300 mt-3 max-w-xl mx-auto">
            Delivering high-quality IT solutions with proven success and trusted
            by clients worldwide.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 text-center 
              shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full 
                bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-md 
                group-hover:scale-110 group-hover:rotate-6 transition"
              >
                {item.icon}
              </div>

              {/* Number */}
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {counts[index]}
                <span className="text-[#38BDF8]">{item.suffix}</span>
              </h2>

              {/* Label */}
              <p className="text-gray-300 mt-2 text-sm md:text-base">
                {item.label}
              </p>

              {/* Gradient Line */}
              <div className="mt-4 h-[2px] w-0 bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#7C3AED] group-hover:w-full transition-all duration-500 mx-auto"></div>

              {/* Glow Border */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#38BDF8]/40 transition"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
