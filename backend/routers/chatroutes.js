const express = require('express');
const router = express.Router();

const { chatWithAI, whatsappWebhook } = require('../controllers/chatController');

router.post("/", chatWithAI);
router.post("/whatsapp", express.urlencoded({ extended: false }), whatsappWebhook);

router.get('/history/:sessionId', async (req, res) => {
    const chats = await require('../models/Chat')
        .find({ sessionId: req.params.sessionId })
        .sort({ createdAt: -1 })
        .limit(50);

    res.json(chats);
});

module.exports = router;