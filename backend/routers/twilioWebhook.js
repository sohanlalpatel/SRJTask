const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/whatsapp", async (req, res) => {
    const msg = req.body.Body;

    const aiRes = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt: `Reply professionally for SRJ company: ${msg}`,
        stream: false,
    });

    const reply = aiRes.data.response;

    res.type("text/xml");
    res.send(`
    <Response>
      <Message>${reply}</Message>
    </Response>
  `);
});

module.exports = router;