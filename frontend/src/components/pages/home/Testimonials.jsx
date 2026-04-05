import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "CEO, TechNova",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "SRJ Global is a professional IT company that always delivers high-quality solutions. Their team is highly skilled and reliable.",
  },
  {
    name: "Ananya Verma",
    role: "Senior Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Amazing UI/UX and development support. They understand requirements and deliver beyond expectations.",
  },
  {
    name: "Amit Patel",
    role: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "Highly professional team with strong technical expertise. Best choice for startups and enterprises.",
  },
  {
    name: "Neha Singh",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Great experience working with SRJ Global. Their communication and delivery speed is excellent.",
  },
  {
    name: "Rukma Singh",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Great experience working with SRJ Global. Their communication and delivery speed is excellent.",
  },
  {
    name: "Kamal Singh",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/men/88.jpg",
    text: "Great experience working with SRJ Global. Their communication and delivery speed is excellent.",
  },
  {
    name: "Nehal rai",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    text: "Great experience working with SRJ Global. Their communication and delivery speed is excellent.",
  },
  {
    name: "Sohil Verma",
    role: "Product Manager",
    image: "https://randomuser.me/api/portraits/men/83.jpg",
    text: "Great experience working with SRJ Global. Their communication and delivery speed is excellent.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const visibleCards = 2;

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev + visibleCards >= testimonials.length ? 0 : prev + visibleCards,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 bg-[#000000] overflow-hidden">
      {" "}
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#38BDF8] opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#7C3AED] opacity-20 blur-3xl rounded-full"></div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-[#7C3AED] text-sm mb-2">— Client Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            What They’re Talking?
          </h2>
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700"
            style={{
              transform: `translateX(-${(current * 100) / visibleCards}%)`,
            }}
          >
            {testimonials.map((item, index) => (
              <div key={index} className="w-full md:w-1/2 px-4 flex-shrink-0">
                <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 pt-16 border border-white/10 overflow-hidden transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  {/* Gradient Glow Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#2563EB]/20 via-[#38BDF8]/20 to-[#7C3AED]/20 opacity-0 group-hover:opacity-100 blur-xl transition"></div>

                  {/* Top Header */}
                  <div className="relative -top-12 left-6 flex items-center z-10">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="p-[3px] rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-[#0F172A]"
                        />
                      </div>
                    </div>

                    {/* Name Box */}
                    <div className="ml-4 bg-[#0F172A] rounded-r-full shadow-lg pl-6 pr-10 py-3 relative border border-white/10">
                      <h3 className="text-sm font-semibold text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#38BDF8]">{item.role}</p>

                      {/* Gradient Strip */}
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-full"></div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="absolute top-6 right-6 flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 text-sm leading-relaxed mt-6 z-10 relative">
                    {item.text}
                  </p>

                  {/* Bottom Glow Line */}
                  <div className="mt-6 h-[2px] w-0 bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#7C3AED] group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({
            length: Math.ceil(testimonials.length / visibleCards),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i * visibleCards)}
              className={`h-3 rounded-full transition ${
                current === i * visibleCards
                  ? "bg-[#7C3AED] w-6"
                  : "bg-gray-300 w-3"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
