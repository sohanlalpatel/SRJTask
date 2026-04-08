 
const mongoose = require("mongoose");

const AddonItemSchema = new mongoose.Schema({
    addonId: { type: mongoose.Schema.Types.ObjectId, ref: "Addon", default: null },
    addonName: { type: String },
    price: { type: Number },
}, { _id: false });

const OrderSchema = new mongoose.Schema(
    {
        // ── User ──
        userName: { type: String, required: true, trim: true },
        userEmail: { type: String, required: true, trim: true, lowercase: true },
        userPhone: { type: String, required: true },
        userCompany: { type: String, default: "" },
        message: { type: String, default: "" },

        // ── Plan ──
        planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", default: null },
        planName: { type: String },
        planBasePrice: { type: Number },

        // ── Service ──
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
        serviceName: { type: String, default: "" },
        serviceCategory: { type: String, default: "" },

        // ── Addons ──
        addons: { type: [AddonItemSchema], default: [] },

        // ── Timeline ──
        deliveryDays: { type: Number },
        timelinePricing: { type: String },

        // ── Financials ──
        totalAmount: { type: Number },

        // ── Admin ──
        status: {
            type: String,
            enum: ["new", "confirmed", "in-progress", "delivered", "cancelled"],
            default: "new",
        },
        assignedTo: { type: String, default: "" },
        adminNote: { type: String, default: "" },

        // ── Meta ──
        source: { type: String, default: "Pricing Page" },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

