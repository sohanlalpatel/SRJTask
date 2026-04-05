const mongoose = require("mongoose");

const pricingCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Website
    slug: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("PricingCategory", pricingCategorySchema);