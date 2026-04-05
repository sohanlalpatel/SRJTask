const mongoose = require("mongoose");

const addOnSchema = new mongoose.Schema({
    name: String,
    basePrice: Number,
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("AddOn", addOnSchema);