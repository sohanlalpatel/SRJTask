import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Building Future-Ready Digital Experiences",
    subtitle:
      "We provide website development, app solutions, SEO, branding and marketing to grow your business online.",
    image: "https://images.pexels.com/photos/7876906/pexels-photo-7876906.jpeg",
  },
  {
    title: "Scalable Web & App Development Solutions",
    subtitle:
      "Custom web and mobile applications using modern technologies like React, Node.js and cloud systems.",
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2074",
  },
  {
    title: "Grow Your Business with Smart Technology",
    subtitle:
      "We help startups and businesses build strong digital presence with high-performance solutions.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070",
  },
];

const Hero = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000 }}
        loop
        className="h-[85vh] md:h-[100vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full overflow-hidden">
              {/* Background Image with Zoom Animation */}
              <img
                src={slide.image}
                className="absolute w-full h-full object-cover scale-100 animate-zoom"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-[#0F172A]/80"></div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/70 via-transparent to-[#2563EB]/50"></div>

              {/* Left Shape */}
              <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-b from-[#7C3AED] to-transparent opacity-40 clip-path"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center items-center text-center h-full text-white px-4 md:px-6">
                <p className="uppercase tracking-widest text-xs md:text-sm text-gray-300 mb-4 animate-fadeIn">
                  IT Solutions Company
                </p>

                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-4xl animate-fadeIn">
                  {slide.title}
                </h1>

                <p className="text-sm md:text-lg text-gray-300 max-w-2xl mb-6">
                  {slide.subtitle}
                </p>

                <div className="flex gap-4 flex-wrap justify-center">
                  <Link to="/services">
                    <button className="bg-[#7C3AED] px-6 py-3 rounded-lg hover:bg-[#2563EB] transition">
                      Explore Services
                    </button>
                  </Link>
                  <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
                    Get Free Quote
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
