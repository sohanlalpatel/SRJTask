const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        excerpt: {
            type: String,
            required: true,
            maxlength: 300,
        },

        content: {
            type: String,
            required: true,
        },

        author: {
            type: String,
            default: "SRJ Global Team",
        },

        category: {
            type: String,
            enum: [
                "Web Development",
                "App Development",
                "Digital Marketing",
                "SEO",
                "Design",
                "Business",
            ],
            default: "Business",
        },

        tags: [
            {
                type: String,
            },
        ],

        image: {
            type: String,
            required: true,
        },

        readTime: {
            type: String, // e.g. "5 min read"
        },

        views: {
            type: Number,
            default: 0,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },

        // 🔥 SEO Fields
        metaTitle: String,
        metaDescription: String,
        keywords: [String],

        // 📅 Dates
        publishedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);