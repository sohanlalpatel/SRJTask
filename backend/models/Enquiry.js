const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
    {
        // ── User Info ──
        userName: { type: String, required: true, trim: true },
        userEmail: { type: String, required: true, trim: true, lowercase: true },
        userPhone: { type: String, required: true, trim: true },
        userCompany: { type: String, default: "", trim: true },

        // ── Service Info ──
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            default: null,
        },
        serviceName: { type: String, default: "" },
        serviceCategory: { type: String, default: "" },
        servicePrice: { type: String, default: "" },

        // ── Project Details ──
        budget: { type: String, default: "" },
        timeline: { type: String, default: "" },
        message: { type: String, default: "" },

        // ── Admin Fields ──
        status: {
            type: String,
            enum: ["new", "contacted", "in-progress", "converted", "closed"],
            default: "new",
        },
        assignedTo: { type: String, default: "" },  // admin name / team member
        adminNote: { type: String, default: "" },  // internal note by admin

        // ── Meta ──
        source: { type: String, default: "Service Detail Page" },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);