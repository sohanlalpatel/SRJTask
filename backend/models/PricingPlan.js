const mongoose = require("mongoose");

const pricingPlanSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },

    name: String, // Basic / Standard / Premium

    basePrice: Number,

    duration: String, // "one-time" / "monthly"

    pages: String, // "5 pages", "10 pages"

    features: [String],

    technologies: [String], // React, Node, MongoDB

    deliveryTime: String, // "5 days", "10 days"

    revisions: String, // "2 revisions"

    support: String, // "1 month support"

    isPopular: Boolean,

    ctaText: String, // "Get Started", "Buy Now"

    order: Number,

    isActive: { type: Boolean, default: true },
}, { timestamps: true });


module.exports = mongoose.model("PricingPlan", pricingPlanSchema);