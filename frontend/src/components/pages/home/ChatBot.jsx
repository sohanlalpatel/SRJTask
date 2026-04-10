import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Bot,
  Loader2,
  Moon,
  Sun,
  Sparkles,
  Gamepad2,
  MessageCircle,
  ChevronRight,
  Volume2,
  VolumeX,
  Zap,
  Code2,
  Globe,
  Smartphone,
  Shield,
  Headphones,
  BookOpen,
  DollarSign,
  Phone,
  ArrowUpRight,
} from "lucide-react";

// ============================================================
// 🔑 GROQ API — Free Forever (no credit card needed)
// Get your key: https://console.groq.com/keys
// Model: llama-3.1-8b-instant — 14,400 requests/day FREE
// ============================================================
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ============================================================
// WhatsApp number — change to your actual number
// ============================================================
const WHATSAPP_NUMBER = "919266706599"; // format: country_code + number

// ============================================================
// COMPANY SYSTEM PROMPT
// ============================================================
const SYSTEM_PROMPT = `You are NexBot, the AI assistant for NexCore Gaming & Software Solutions.

FORMATTING RULES (STRICTLY FOLLOW):
- Keep replies SHORT — max 5-6 lines total
- Use bullet points with • for lists
- Use emojis naturally to match gaming/tech vibe
- Bold key terms using **text**
- Structure: 1-line intro → bullets → 1-line CTA
- NEVER write walls of text — keep it crisp and scannable
- End with a call to action or offer to connect on WhatsApp

=== COMPANY ===
NexCore Gaming & Software Solutions — India's premier game development + software house. Founded 2018. 80+ projects delivered. Clients across India, USA, UAE, UK, Canada, Germany.

=== SERVICES ===
🎮 GAMING:
• Game Development (Unity, Unreal Engine 5, Godot)
• Mobile Games (iOS + Android, Hyper-casual to AAA)
• PC & Console Games (Steam, PlayStation, Xbox)
• Multiplayer & Online Gaming (Photon, Mirror Networking)
• AR/VR/XR Games & Experiences
• Game UI/UX Design & 2D/3D Art
• NFT Games & Web3 Gaming

💻 SOFTWARE:
• Custom Web Applications (React, Next.js, Node.js, Django)
• Mobile Apps (Flutter, React Native)
• SaaS Product Development
• ERP & CRM Solutions
• AI & ML Integration / Chatbots
• Cloud Solutions (AWS, Azure, GCP)
• Cybersecurity & DevOps

=== PRICING ===
🟢 Starter Game: ₹50,000–₹1,50,000 (Hyper-casual mobile game, 2D, basic multiplayer)
🔵 Pro Game: ₹2,00,000–₹8,00,000 (Mid-core game, Unity/Unreal, custom art, online features)
🟣 AAA / Enterprise: Custom Quote (Full AAA studio pipeline, Unreal 5, console publishing)
💻 Web App Starter: ₹20,000–₹60,000
💻 SaaS Product: ₹1,00,000–₹5,00,000+
⏱️ Hourly Consulting: ₹1,000–₹3,000/hr
🎁 Free discovery call for all new clients!

=== TECH STACK ===
Unity • Unreal Engine 5 • Godot • Flutter • React • Node.js • Python • AWS • Firebase • Photon • Blender • Spine2D • Figma

=== INDUSTRIES ===
Gaming & Entertainment, EdTech (gamified learning), HealthTech (gamification), Retail (AR try-on), Real Estate (VR tours), Sports (simulation), Defense & Training (simulation)

=== BLOG TOPICS ===
• Unity vs Unreal Engine: Which for your game?
• Hyper-casual game monetization strategies
• How AR is changing retail
• Top game mechanics for player retention
• Mobile game marketing on $0 budget
• From idea to App Store in 90 days

=== CONTACT ===
📧 hello@gaming&solution.com
📞 +91 96251 90448
🌐 https://gaming-sw.vercel.app/
💬 WhatsApp available for quick queries!

=== PAGES ===
HOME: Portfolio showcase, client logos, tech stack
SERVICES: Gaming + Software services in detail
PRICING: Packages, hourly rates, custom quotes
BLOG: Game dev tutorials, industry insights
CONTACT: Form + WhatsApp + Call booking

INSTRUCTIONS:
- Match the energy: gaming = exciting, software = professional
- If asked about WhatsApp, tell them they can click the WhatsApp button in the chat
- Respond in Hindi or English based on user's language
- Always offer a free discovery call or WhatsApp connect as the CTA
- If you don't know something specific, offer to connect them with the team`;

// ============================================================
// QUICK ACTION BUTTONS
// ============================================================
const QUICK_ACTIONS = [
  {
    icon: <Gamepad2 size={12} />,
    text: "Game dev services?",
    color: "#7C3AED",
  },
  { icon: <DollarSign size={12} />, text: "Pricing?", color: "#2563EB" },
  { icon: <BookOpen size={12} />, text: "Latest blogs?", color: "#0891B2" },
  { icon: <Phone size={12} />, text: "Contact team", color: "#059669" },
];

// ============================================================
// NAV PILLS
// ============================================================
const NAV_ITEMS = [
  { icon: <Globe size={11} />, label: "Services", path: "/services" },
  { icon: <DollarSign size={11} />, label: "Pricing", path: "/pricing" },
  { icon: <BookOpen size={11} />, label: "Blog", path: "/blogs" },
  { icon: <MessageCircle size={11} />, label: "Contact", path: "/contact" },
];

// ============================================================
// RENDER FORMATTED MESSAGE
// ============================================================
function renderMessage(text) {
  return text.split("\n").map((line, i) => {
    if (line.trim() === "") return <div key={i} style={{ height: 3 }} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((p, j) =>
      j % 2 === 1 ? (
        <strong key={j} style={{ fontWeight: 600 }}>
          {p}
        </strong>
      ) : (
        p
      ),
    );
    return (
      <div key={i} style={{ lineHeight: 1.6, marginBottom: 1 }}>
        {rendered}
      </div>
    );
  });
}

// ============================================================
// TYPING INDICATOR
// ============================================================
function TypingDots({ color }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        padding: "4px 0",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
            animation: `dotBounce 1.1s ${i * 160}ms ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// MAIN CHATBOT COMPONENT
// ============================================================
const ChatBot = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey there, gamer! 🎮 I'm **NexBot** — your guide to NexCore Gaming & Software Solutions.\n\nI can help you with:\n• 🎮 Game development services & tech\n• 💰 Pricing & packages\n• 📝 Latest blog & tutorials\n• 📞 Connect with our team on WhatsApp\n\nWhat would you like to explore? 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [sound, setSound] = useState(true);
  const [showQuick, setShowQuick] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Soft click sound using Web Audio API — no external files needed
  const playPop = useCallback(() => {
    if (!sound) return;
    try {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  }, [sound]);

  const openWhatsApp = (prefill = "") => {
    const msg = encodeURIComponent(
      prefill || "Hi Gaming and Software Solutions Team!I'd like to know more about your services.",
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const sendMessage = async (textOverride) => {
    const userText = (textOverride || input).trim();
    if (!userText || loading) return;

    // WhatsApp redirect intent
    const waKeywords = [
      "whatsapp",
      "contact",
      "connect",
      "call",
      "talk to human",
      "speak",
      "team",
      "support",
    ];
    if (waKeywords.some((kw) => userText.toLowerCase().includes(kw))) {
      setInput("");
      const newMsgs = [...messages, { role: "user", content: userText }];
      setMessages(newMsgs);
      playPop();
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sure! 💬 Click the **WhatsApp** button below to chat directly with our team. We typically respond within minutes! 🚀",
            showWA: true,
          },
        ]);
      }, 600);
      setShowQuick(false);
      return;
    }

    setInput("");
    setShowQuick(false);
    const updatedMsgs = [...messages, { role: "user", content: userText }];
    setMessages(updatedMsgs);
    setLoading(true);
    setIsTyping(true);

    try {
      const history = updatedMsgs.slice(-12).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
          temperature: 0.75,
          max_tokens: 350,
          top_p: 0.9,
          stream: false,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply =
        data?.choices?.[0]?.message?.content?.trim() ||
        "Oops, something went wrong. Please try again or reach us on WhatsApp! 🙏";

      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      playPop();
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Connection issue:** ${err.message}\n\nReach us directly:\n• 📧 hello@nexcoregaming.com\n• 💬 WhatsApp button below`,
          showWA: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ---- THEME ----
  const T = dark
    ? {
        bg: "#080B14",
        chatBg: "#0B0F1A",
        surface: "#111827",
        surface2: "#0D1117",
        border: "rgba(124,58,237,0.2)",
        borderMid: "rgba(124,58,237,0.12)",
        text: "#E2E8FF",
        textMuted: "#6B7280",
        botBubble: "#111827",
        inputBg: "#0D1117",
        inputBorder: "rgba(124,58,237,0.25)",
        accent: "#7C3AED",
        accent2: "#2563EB",
        pill: "rgba(124,58,237,0.12)",
        pillText: "#A78BFA",
        pillBorder: "rgba(124,58,237,0.25)",
        scrollbar: "rgba(124,58,237,0.3)",
        glow: "rgba(124,58,237,0.15)",
      }
    : {
        bg: "#F0F4FF",
        chatBg: "#F8FAFF",
        surface: "#FFFFFF",
        surface2: "#EEF2FF",
        border: "rgba(37,99,235,0.2)",
        borderMid: "rgba(37,99,235,0.1)",
        text: "#1E1B4B",
        textMuted: "#6B7280",
        botBubble: "#FFFFFF",
        inputBg: "#EEF2FF",
        inputBorder: "rgba(37,99,235,0.3)",
        accent: "#7C3AED",
        accent2: "#2563EB",
        pill: "#EDE9FF",
        pillText: "#5B21B6",
        pillBorder: "rgba(124,58,237,0.25)",
        scrollbar: "rgba(124,58,237,0.3)",
        glow: "rgba(37,99,235,0.08)",
      };

  return (
    <div
      style={{
        width: 370,
        maxWidth: "calc(100vw - 20px)",
        height: 580,
        maxHeight: "85vh",
        background: T.bg,
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: `1px solid ${T.border}`,
        boxShadow: dark
          ? `0 32px 80px rgba(124,58,237,0.3), 0 0 0 1px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 24px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(37,99,235,0.1)`,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #4C1D95 0%, #1D4ED8 60%, #0E7490 100%)",
          padding: "13px 14px 12px",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -18,
            right: -18,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -25,
            left: 60,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              <Gamepad2 size={18} color="white" />
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 0.2,
                }}
              >
                NexBot
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ADE80",
                    display: "inline-block",
                    boxShadow: "0 0 6px #4ADE80",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
                  Online ·
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 5 }}>
            <HeaderBtn
              onClick={() => setSound(!sound)}
              title={sound ? "Mute" : "Unmute"}
            >
              {sound ? (
                <Volume2 size={12} color="white" />
              ) : (
                <VolumeX size={12} color="white" />
              )}
            </HeaderBtn>
            <HeaderBtn onClick={() => setDark(!dark)} title="Toggle theme">
              {dark ? (
                <Sun size={12} color="white" />
              ) : (
                <Moon size={12} color="white" />
              )}
            </HeaderBtn>
            <HeaderBtn onClick={closeChat} title="Close">
              <X size={12} color="white" />
            </HeaderBtn>
          </div>
        </div>

        {/* NAV PILLS */}
        <div
          style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}
        >
          {NAV_ITEMS.map((n) => (
            <button
              key={n.label}
              onClick={() =>
                n.label === "Contact"
                  ? openWhatsApp()
                  : window.open(n.path, "_blank")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20,
                padding: "3px 10px",
                color: "rgba(255,255,255,0.85)",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
            >
              {n.icon} {n.label}
              {n.label === "Contact" && <ArrowUpRight size={9} />}
            </button>
          ))}
        </div>
      </div>

      {/* ===== MESSAGES ===== */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: T.chatBg,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              {msg.role === "assistant" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#4C1D95,#1D4ED8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Gamepad2 size={13} color="white" />
                </div>
              )}

              <div
                style={{
                  maxWidth: "80%",
                  padding: msg.role === "user" ? "9px 14px" : "10px 14px",
                  borderRadius:
                    msg.role === "user"
                      ? "18px 18px 4px 18px"
                      : "4px 18px 18px 18px",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #7C3AED, #2563EB)"
                      : T.botBubble,
                  color: msg.role === "user" ? "white" : T.text,
                  fontSize: 13,
                  border:
                    msg.role === "assistant"
                      ? `1px solid ${T.borderMid}`
                      : "none",
                  lineHeight: 1.55,
                  boxShadow:
                    msg.role === "assistant"
                      ? dark
                        ? "0 2px 12px rgba(0,0,0,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.06)"
                      : "0 2px 10px rgba(124,58,237,0.3)",
                }}
              >
                {renderMessage(msg.content)}
                {msg.showWA && (
                  <button
                    onClick={() => openWhatsApp()}
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "linear-gradient(135deg,#25D366,#128C7E)",
                      border: "none",
                      borderRadius: 8,
                      padding: "7px 14px",
                      cursor: "pointer",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "inherit",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <MessageCircle size={13} />
                    Chat on WhatsApp
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>

              {msg.role === "user" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: dark ? "#1F2937" : "#E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 13,
                  }}
                >
                  👤
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#4C1D95,#1D4ED8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Gamepad2 size={13} color="white" />
            </div>
            <div
              style={{
                background: T.botBubble,
                border: `1px solid ${T.borderMid}`,
                borderRadius: "4px 18px 18px 18px",
                padding: "10px 16px",
              }}
            >
              <TypingDots color={T.accent} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      {showQuick && messages.length === 1 && (
        <div
          style={{
            padding: "8px 12px 10px",
            background: T.surface,
            borderTop: `1px solid ${T.borderMid}`,
            flexShrink: 0,
          }}
        >
          <p
            style={{
              margin: "0 0 7px",
              fontSize: 10,
              color: T.textMuted,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Quick Ask
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK_ACTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q.text)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: T.pill,
                  border: `1px solid ${T.pillBorder}`,
                  borderRadius: 20,
                  padding: "5px 12px",
                  color: T.pillText,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = dark
                    ? "rgba(124,58,237,0.22)"
                    : "#DDD6FE")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = T.pill)
                }
              >
                {q.icon} {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== INPUT ===== */}
      <div
        style={{
          padding: "10px 12px",
          background: T.surface,
          borderTop: `1px solid ${T.borderMid}`,
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {/* WhatsApp floating button */}
        <button
          onClick={() => openWhatsApp()}
          title="Chat on WhatsApp"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg,#25D366,#128C7E)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageCircle size={16} color="white" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about games, pricing, blogs..."
          disabled={loading}
          style={{
            flex: 1,
            background: T.inputBg,
            border: `1px solid ${T.inputBorder}`,
            borderRadius: 24,
            padding: "9px 16px",
            fontSize: 13,
            outline: "none",
            color: T.text,
            fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = T.accent)}
          onBlur={(e) => (e.target.style.borderColor = T.inputBorder)}
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            flexShrink: 0,
            background:
              input.trim() && !loading
                ? "linear-gradient(135deg,#7C3AED,#2563EB)"
                : dark
                  ? "#1F2937"
                  : "#E5E7EB",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow:
              input.trim() && !loading
                ? "0 4px 12px rgba(124,58,237,0.35)"
                : "none",
          }}
          onMouseEnter={(e) =>
            input.trim() &&
            !loading &&
            (e.currentTarget.style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {loading ? (
            <Loader2
              size={15}
              color={dark ? "#6B7280" : "#9CA3AF"}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Send
              size={14}
              color={input.trim() ? "white" : dark ? "#4B5563" : "#9CA3AF"}
              style={{ transform: "translateX(1px)" }}
            />
          )}
        </button>
      </div>

      {/* ===== FOOTER BRAND ===== */}
      <div
        style={{
          padding: "5px 12px 6px",
          background: T.surface,
          borderTop: `1px solid ${T.borderMid}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <Zap size={9} color={T.textMuted} />
        {/* <span style={{ fontSize: 10, color: T.textMuted }}>
          Powered by{" "}
          <strong style={{ color: T.pillText }}>Groq + Llama 3.1</strong> · Free
          AI · Ultra-fast
        </span> */}
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.55; }
          30%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.scrollbar}; border-radius: 4px; }
      `}</style>
    </div>
  );
};

// Small reusable header button
function HeaderBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "50%",
        width: 28,
        height: 28,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
      }
    >
      {children}
    </button>
  );
}

// ============================================================
// FLOATING CHAT LAUNCHER (ready to use in your App.jsx)
// ============================================================
export function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
      }}
    >
      {open && <ChatBot closeChat={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg,#374151,#1F2937)"
            : "linear-gradient(135deg,#7C3AED,#2563EB)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: open
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 8px 30px rgba(124,58,237,0.5)",
          transition: "all 0.25s",
          transform: open ? "rotate(0deg)" : "rotate(0deg)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <X size={22} color="white" />
        ) : (
          <Gamepad2 size={22} color="white" />
        )}
      </button>
    </div>
  );
}

export default ChatBot;
