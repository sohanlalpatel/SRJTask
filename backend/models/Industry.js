const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
        },

        desc: String,

        content: String,

        services: [String],

        benefits: [String],

        image: String,

        icon: String, // lucide icon name

        order: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Industry", industrySchema);