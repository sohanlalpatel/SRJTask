 

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {   
        name: {
            type: String,
            required: true,
            trim: true,
        },


        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PricingCategory",
            required: true,
        },

        slug: {
            type: String,
            unique: true,
        },

        description: {
            type: String,
            required: true,
        },

        shortDescription: {
            type: String,
        },

        image: {
            type: String,
        },

        imagePublicId: {
            type: String,
        },

        features: [
            {
                type: String,
            },
        ],

        price: {
            type: String,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        icon: {
            type: String, // store icon name (lucide / react-icons)
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);