import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, X } from "lucide-react";

export default function Chatbot({ closeChat }) {
   const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 Welcome to SRJ Global! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

  const reply = res.data.reply;
  const actions = res.data.actions || [];
  const suggestions = res.data.suggestions || [];

  setMessages((prev) => [
    ...prev,
    {
      sender: "bot",
      text: reply,
      actions,
      suggestions,
    },
  ]);
      // 👉 Contact redirect logic
      if (reply.includes("contact us")) {
        setTimeout(() => {
          window.location.href = "/contact";
        }, 2000);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}

      {/* Chat Window */}

      <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/20 bg-black/40">
          <div className="flex items-center gap-2">
            <Bot className="text-cyan-400" />
            <h2 className="text-white font-semibold">SRJ Assistant</h2>
          </div>
          <X
            className="text-white cursor-pointer"
            onClick={closeChat} // ✅ parent control
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <p>{msg.text}</p>

                {/* 🔘 ACTION BUTTONS */}
                {msg.actions && (
                  <div className="mt-2 flex flex-col gap-2">
                    {msg.actions.map((a, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (a.type === "internal") {
                            window.location.href = a.link;
                          } else {
                            window.open(a.link, "_blank");
                          }
                        }}
                        className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-xs hover:scale-105"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* 💡 SUGGESTIONS */}
                {msg.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInput(s);
                          setTimeout(() => sendMessage(), 100);
                        }}
                        className="border border-white/20 text-xs px-2 py-1 rounded-full hover:bg-cyan-500"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && <div className="text-gray-400 text-xs">Typing...</div>}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center border-t border-white/20 p-2 bg-black/40">
          <input
            className="flex-1 bg-transparent text-white outline-none px-2"
            placeholder="Ask about services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
