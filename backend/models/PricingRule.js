 const mongoose = require("mongoose");

const pricingRuleSchema = new mongoose.Schema({
    title: String, // Urgent Delivery

    type: {
        type: String,
        enum: ["urgent", "bulk", "weekend", "custom"],
    },

    condition: {
        field: String, // deliveryDays
        operator: String, // <, >
        value: Number,
    },

    effect: {
        type: {
            type: String,
            enum: ["increase", "discount"],
        },
        value: Number, // %
    },

    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("PricingRule", pricingRuleSchema);