import React, { useState } from "react";
import { MessageCircle, Phone, Bot } from "lucide-react";
import Chatbot from "./ChatBot";



const FloatingContact = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Chatbot */}


      
      <button
        onClick={() => setIsChatOpen(true)}
        className="group relative bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        <Bot size={22} />

        {/* Tooltip */}
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Chat with AI
        </span>
      </button>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919999999999" // apna number yaha daalo
        target="_blank"
        rel="noopener noreferrer"
        className="group relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        <MessageCircle size={22} />

        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          WhatsApp
        </span>
      </a>

      {/* Contact */}
      <a
        href="/contact"
        className="group relative bg-[#38BDF8] text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        <Phone size={22} />

        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Contact Us
        </span>
      </a>

      {isChatOpen && <Chatbot closeChat={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default FloatingContact;
