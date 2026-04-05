import React from "react";

const clients = [
  {
    name: "Google",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
    link: "#",
  },
  {
    name: "Microsoft",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",
    link: "#",
  },
  {
    name: "Amazon",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    link: "#",
  },
  {
    name: "Meta",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg",
    link: "#",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    link: "#",
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
    link: "#",
  },
];

// Duplicate for infinite scroll
const duplicatedClients = [...clients, ...clients];

const ClientsSlider = () => {
  return (
    <section className="relative py-16 bg-[#F8FAFC] overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">
          Trusted by Leading Companies
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] mx-auto mt-3 rounded"></div>
      </div>

      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

      {/* Slider */}
      <div className="overflow-hidden">
        <div className="flex gap-12 items-center w-max animate-scroll hover:[animation-play-state:paused]">
          {duplicatedClients.map((client, idx) => (
            <a
              key={idx}
              href={client.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] flex items-center justify-center"
            >
              <div
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300 
              hover:scale-110"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-12 sm:h-14 object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ClientsSlider;
