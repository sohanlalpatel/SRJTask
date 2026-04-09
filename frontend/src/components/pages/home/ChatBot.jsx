import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2, Moon, Sun, Sparkles } from "lucide-react";

// ✅ Apni FREE Gemini API key yahan daalo
// Get it from: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyC8zLTRU5QbIlg0cw5N8z5YjyIobETS0bM";

const SRJ_SYSTEM_CONTEXT = `
You are a helpful AI assistant for SRJ Global Technology.

IMPORTANT FORMATTING RULES:
- Keep replies SHORT and SCANNABLE — max 4-6 lines
- Use bullet points with • for lists, never long paragraphs
- Use emojis naturally to make responses friendly
- Bold key terms with **text** markdown
- Structure: 1 line intro → bullets → 1 line CTA
- Never write walls of text

=== COMPANY ===
SRJ Global Technology — full-stack IT solutions provider, India-based, serving global clients (USA, UAE, UK, Canada). Team of 50+ professionals.

=== SERVICES ===
• 🌐 Web Development (React, Next.js, Node.js)
• 📱 Mobile Apps (Flutter, React Native)
• 🎨 UI/UX Design (Figma, Prototyping)
• ☁️ Cloud Solutions (AWS, Azure, GCP)
• 🤖 AI & Machine Learning / Chatbots
• 📈 SEO & Digital Marketing
• 🔒 Cybersecurity
• 🏢 ERP & CRM Solutions
• ⚙️ DevOps & IT Support

=== PRICING ===
• 🟢 Starter: ₹15,000–₹30,000 (Basic website, 5 pages, SEO)
• 🔵 Business: ₹50,000–₹1,50,000 (Web app + Mobile + 3mo support)
• 🟣 Enterprise: Custom Quote (Full digital transformation)
• ⏱️ Hourly: ₹800–₹2,000/hr
• Free consultation for all new clients!

=== INDUSTRIES ===
Healthcare, Education, E-commerce, Real Estate, Finance, Logistics, Hospitality, Manufacturing, Government

=== CONTACT ===
📧 info@srjglobaltechnology.com | 📞 +91 99999 99999

=== PAGES ===
HOME: Vision, services overview, testimonials
SERVICES: All tech services listed above
ABOUT: Team, values, certifications (ISO, Google Partner, AWS Partner)
INDUSTRIES: Industry-specific solutions
BLOG: Weekly tech articles, tutorials, AI/ML insights
PRICING: Packages and hourly rates

INSTRUCTIONS:
- Respond in Hindi or English based on user's language
- Be warm, professional, concise
- Always end with a helpful next step or contact suggestion
`;

const SUGGESTED_QUESTIONS = [
  { icon: "🛠️", text: "Services kya hain?" },
  { icon: "💰", text: "Pricing batao" },
  { icon: "🏭", text: "Which industries?" },
  { icon: "📞", text: "Contact info" },
];

const renderMessage = (text) => {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
    );
    if (line.trim() === "") return <div key={i} style={{ height: "4px" }} />;
    return (
      <div key={i} style={{ lineHeight: 1.55 }}>
        {rendered}
      </div>
    );
  });
};

const ChatBot = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! 👋 Main SRJ Global Technology ka AI Assistant hoon.\n\nAap mujhse pooch sakte hain:\n• 🛠️ Services & Pricing\n• 🏭 Industries we serve\n• 📞 Contact & Consultation\n\nKaise help kar sakta hoon? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages
        .slice(0, -1)
        .map(
          (m) =>
            `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`,
        )
        .join("\n");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${SRJ_SYSTEM_CONTEXT}\n\n---\n${history}\nUser: ${userText}\nAssistant:`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 400,
              topP: 0.8,
            },
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          `${response.status}: ${errData?.error?.message || "Unknown error"}`,
        );
      }

      const data = await response.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, response nahi mila. Dobara try karein. 🙏";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: botReply },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Error:** ${error.message}\n\nDirect contact karein:\n📧 info@srjglobaltechnology.com\n📞 +91 99999 99999`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const t = dark
    ? {
        bg: "#0F0F1A",
        surface: "#1A1A2E",
        surface2: "#13131F",
        border: "#2A2A45",
        text: "#E8E6FF",
        textMuted: "#7A78A0",
        botBubble: "#1C1C35",
        input: "#0D0D1A",
        inputBorder: "#35355A",
        suggBg: "#1A1030",
        suggText: "#A78BFA",
        suggBorder: "#3B2D6E",
      }
    : {
        bg: "#F5F4FF",
        surface: "#FFFFFF",
        surface2: "#EEEDF9",
        border: "#DDD9F5",
        text: "#1A1A2E",
        textMuted: "#6B6894",
        botBubble: "#FFFFFF",
        input: "#EEEDF9",
        inputBorder: "#C8C5E8",
        suggBg: "#EDE9FF",
        suggText: "#6D28D9",
        suggBorder: "#C4B5FD",
      };

  return (
    <div
      style={{
        width: "360px",
        maxWidth: "calc(100vw - 24px)",
        height: "540px",
        maxHeight: "80vh",
        background: t.bg,
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: `1px solid ${t.border}`,
        boxShadow: dark
          ? "0 24px 60px rgba(124,58,237,0.25), 0 0 0 1px rgba(124,58,237,0.08)"
          : "0 24px 60px rgba(0,0,0,0.12)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
          padding: "13px 16px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={16} color="white" />
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: 1.2,
                }}
              >
                SRJ AI Assistant
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "3px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#4ADE80",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}
                >
                  Online • Gemini AI
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setDark(!dark)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {dark ? (
                <Sun size={13} color="white" />
              ) : (
                <Moon size={13} color="white" />
              )}
            </button>
            <button
              onClick={closeChat}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={13} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 12px 4px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: t.bg,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bot size={13} color="white" />
              </div>
            )}
            <div
              style={{
                maxWidth: "80%",
                padding: "9px 13px",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #7C3AED, #2563EB)"
                    : t.botBubble,
                color: msg.role === "user" ? "white" : t.text,
                fontSize: "13px",
                border:
                  msg.role === "assistant" ? `1px solid ${t.border}` : "none",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {renderMessage(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={13} color="white" />
            </div>
            <div
              style={{
                background: t.botBubble,
                border: `1px solid ${t.border}`,
                borderRadius: "18px 18px 18px 4px",
                padding: "12px 16px",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              {[0, 150, 300].map((delay, i) => (
                <span
                  key={i}
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#7C3AED",
                    display: "inline-block",
                    animation: `dotBounce 1.2s ${delay}ms infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div
          style={{
            padding: "8px 12px 10px",
            background: t.surface2,
            borderTop: `1px solid ${t.border}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: t.textMuted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Quick questions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q.text)}
                style={{
                  background: t.suggBg,
                  color: t.suggText,
                  border: `1px solid ${t.suggBorder}`,
                  borderRadius: "20px",
                  padding: "5px 11px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {q.icon} {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "10px 12px",
          background: t.surface,
          borderTop: `1px solid ${t.border}`,
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kuch bhi poochein..."
          disabled={loading}
          style={{
            flex: 1,
            background: t.input,
            border: `1px solid ${t.inputBorder}`,
            borderRadius: "24px",
            padding: "9px 16px",
            fontSize: "13px",
            outline: "none",
            color: t.text,
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            background:
              input.trim() && !loading
                ? "linear-gradient(135deg, #7C3AED, #2563EB)"
                : t.border,
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {loading ? (
            <Loader2
              size={15}
              color="white"
              style={{ animation: "spinIcon 1s linear infinite" }}
            />
          ) : (
            <Send size={15} color={input.trim() ? "white" : t.textMuted} />
          )}
        </button>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes spinIcon {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default ChatBot;
