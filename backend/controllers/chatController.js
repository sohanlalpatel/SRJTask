exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const msg = message.toLowerCase();

        // 🔥 Smart responses with suggestions
        if (msg.includes("about") || msg.includes("company")) {
            return res.json({
                reply:
                    "SRJ Global is a software company specializing in Web Development, Mobile Apps, Digital Marketing, and AI solutions.",
                suggestions: ["Our Services", "Pricing", "Contact"],
            });
        }

        if (msg.includes("service")) {
            return res.json({
                reply:
                    "We offer:\n• Web Development\n• App Development\n• Digital Marketing\n• AI Solutions",
                suggestions: ["Pricing", "Contact Us", "About Company"],
            });
        }

        if (msg.includes("price") || msg.includes("cost") || msg.includes("pricing")) {
            return res.json({
                reply:
                    "Pricing depends on your requirements. Click below to get a custom quote 👇",
                actions: [
                    { label: "📞 Contact Us", link: "/contact", type: "internal" },
                    { label: "💬 WhatsApp", link: "https://wa.me/919999999999", type: "external" },
                ],
            });
        }

        if (msg.includes("contact")) {
            return res.json({
                reply: "You can reach us instantly 👇",
                actions: [
                    { label: "📞 Contact Us", link: "/contact", type: "internal" },
                    { label: "💬 WhatsApp", link: "https://wa.me/919999999999", type: "external" },
                ],
            });
        }

        // ❌ fallback (AI-like)
        return res.json({
            reply:
                "I can assist you with SRJ Global services, pricing, and contact details. What would you like to know?",
            suggestions: ["Our Services", "About Company", "Contact"],
            actions: [
                { label: "💬 WhatsApp", link: "https://wa.me/919999999999", type: "external" },
            ],
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};