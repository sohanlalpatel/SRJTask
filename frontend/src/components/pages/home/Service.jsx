import {
  Monitor,
  Megaphone,
  ShieldCheck,
  Palette,
  BarChart3,
} from "lucide-react";

const services = [
  {
    title: "Product Development",
    desc: "Providing the best IT solutions for modern businesses.",
    icon: <Monitor size={28} />,
  },
  {
    title: "Digital Marketing",
    desc: "Creative & full-service digital marketing solutions.",
    icon: <Megaphone size={28} />,
  },
  {
    title: "Security System",
    desc: "Advanced security systems for scalable protection.",
    icon: <ShieldCheck size={28} />,
  },
  {
    title: "UI/UX Designing",
    desc: "Modern, intuitive and minimal web designs.",
    icon: <Palette size={28} />,
  },
  {
    title: "Data Analysis",
    desc: "Turn data into powerful business insights.",
    icon: <BarChart3 size={28} />,
  },
];

export default function Services() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#0f0c29] via-[#1a1446] to-[#0c0a1f] overflow-hidden">
      {/* Background Pattern Effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#6d28d9_1px,_transparent_1px)] [background-size:20px_20px]" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Top Heading */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <p className="text-purple-400 text-sm mb-2">
              — What We're Offering
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Dealing in all Professional <br /> IT Services
            </h2>
          </div>

          <p className="text-gray-300 text-sm md:text-base">
            We offer full-cycle software development services that meet varied
            business requirements—from IT strategy consulting to the end-to-end
            development of scalable solutions.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative bg-[#15122c] p-6 pt-12 rounded-xl text-center group hover:-translate-y-2 transition duration-300"
            >
              {/* Icon Circle */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#1e1a3c] flex items-center justify-center border border-purple-500 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
                {service.icon}
              </div>

              <h3 className="text-white font-semibold text-lg mt-4">
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
  );
}
