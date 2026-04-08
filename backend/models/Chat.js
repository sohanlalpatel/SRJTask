const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sessionId: String,
    channel: { type: String, default: "web" },

    userMessage: String,
    botReply: String,
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);