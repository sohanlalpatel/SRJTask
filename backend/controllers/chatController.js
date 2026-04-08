 const twilio = require('twilio');
const Chat = require('../models/Chat');
const fetch = require("node-fetch");
 

// ✅ QUICK REPLIES
const quickReplies = (msg) => {
    msg = msg.toLowerCase();

    if (msg.includes("price") || msg.includes("cost")) {
        return {
            reply: "💰 Pricing Plans:\nStarter: ₹15,000\nPro: ₹45,000\nEnterprise: Custom",
            suggestions: ["Starter Plan", "Enterprise Plan", "Contact Team"]
        };
    }

    if (msg.includes("contact")) {
        return {
            reply: "📞 +91-99999-99999\nhello@srjglobal.com",
            suggestions: ["Call now", "WhatsApp"]
        };
    }

    return null;
};

const SYSTEM_PROMPT = `
You are SRJ Global AI Assistant.

Company Info:
- Name: SRJ Global (India)
- Services:
  • Web Development (React, Node.js)
  • App Development (Flutter, React Native)
  • Digital Marketing
  • AI/ML Solutions
  • Cloud & DevOps

- Pricing:
  Starter: ₹15,000
  Professional: ₹45,000
  Enterprise: Custom

- Pages:
  Home, Services, About, Industries, Blog, Pricing

Rules:
- Reply in Hinglish / Hindi / English (same as user)
- Keep answer short & helpful
- If pricing → explain plans clearly
- If services → list services properly
- Always act like company assistant

Return JSON:
{
 "reply": "...",
 "actions": [],
 "suggestions": []
}
`;


// ================== 🌐 WEB CHAT ==================
exports.chatWithAI = async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.json({
                reply: "Please type something 😊",
                actions: [],
                suggestions: []
            });
        }

        // ⚡ quick reply
        const quick = quickReplies(message);
        if (quick) return res.json(quick);

        // 🧠 history
        const history = await Chat.find({ sessionId })
            .sort({ createdAt: -1 })
            .limit(6);

        const messages = history.reverse().flatMap(h => ([
            { role: "user", content: h.userMessage },
            { role: "assistant", content: h.botReply }
        ]));

        messages.push({ role: "user", content: message });

        let data;


        try {
            const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistralai/mistral-7b-instruct", // ✅ free model
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: message }
                    ]
                })
            });

            const aiData = await aiRes.json();

            console.log("AI RESPONSE:", aiData);

            // ✅ ERROR HANDLE (IMPORTANT)
            if (aiData.error) {
                throw new Error(aiData.error.message);
            }

            const replyText = aiData?.choices?.[0]?.message?.content;

            data = {
                reply: replyText || "No response from AI",
                actions: [],
                suggestions: ["Pricing", "Services", "Contact"]
            };

        } catch (err) {
            console.error("AI ERROR:", err.message);

            // 🔥 SMART FALLBACK (SRJ DATA)
            data = {
                reply: `SRJ Global services:
• Web Development
• App Development
• Digital Marketing
• AI Solutions

💰 Pricing:
Starter ₹15,000
Pro ₹45,000
Enterprise Custom

📞 Contact: +91-99999-99999`,
                suggestions: ["Pricing", "Services", "Contact"]
            };
        }

        // 💾 save
        await Chat.create({
            sessionId,
            userMessage: message,
            botReply: data.reply
        });

        res.json(data);

    } catch (err) {
        console.error(err);
        res.json({
            reply: "Server error 😢",
            actions: [],
            suggestions: []
        });
    }
};

// ================== 📱 WHATSAPP ==================
exports.whatsappWebhook = async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();

    const incomingMsg = req.body.Body;
    const from = req.body.From;

    try {
        // ⚡ quick reply
        const quick = quickReplies(incomingMsg);
        if (quick) {
            twiml.message(quick.reply);
            return res.type('text/xml').send(twiml.toString());
        }

        // 🤖 AI call
        // const ai = await client.messages.create({
        //     model: "claude-3-haiku-20240307",
        //     max_tokens: 200,
        //     system: SYSTEM_PROMPT + "\nReturn ONLY plain text.",
        //     messages: [{ role: "user", content: incomingMsg }]
        // });

        const replyText = "Thanks for contacting SRJ Global! 😊";

        // 💾 save
        await Chat.create({
            sessionId: from,
            channel: "whatsapp",
            userMessage: incomingMsg,
            botReply: replyText
        });

        twiml.message(replyText);

    } catch (err) {
        console.error(err);
        twiml.message("Server issue 😢 try again later");
    }

    res.type('text/xml').send(twiml.toString());
};