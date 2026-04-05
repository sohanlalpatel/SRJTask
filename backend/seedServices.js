const mongoose = require("mongoose");
const Service = require("./models/services"); // adjust path if needed
const dotenv = require("dotenv");



require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);
const services = [
    {
        name: "Website Designing",
        slug: "website-designing",
        description:
            "We design modern, responsive, and visually appealing websites that represent your brand identity and enhance user engagement.",
        shortDescription: "Modern responsive website designs",
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d",
        icon: "MonitorSmartphone",
        features: [
            "Responsive Design",
            "UI/UX Optimization",
            "Cross-browser Compatibility",
            "Mobile-first Approach",
        ],
        price: "₹10,000 - ₹50,000",
        order: 1,
    },
    {
        name: "Graphic Designing",
        slug: "graphic-designing",
        description:
            "Creative and professional graphic design services to make your brand visually impactful and memorable.",
        shortDescription: "Creative visual branding",
        image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a",
        icon: "Palette",
        features: [
            "Social Media Designs",
            "Banner & Poster Design",
            "Brand Identity",
            "Creative Concepts",
        ],
        price: "₹5,000 - ₹30,000",
        order: 2,
    },
    {
        name: "Logo Designing",
        slug: "logo-designing",
        description:
            "Unique and professional logo designs that represent your brand and create a lasting impression.",
        shortDescription: "Unique brand logo creation",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
        icon: "PenTool",
        features: [
            "Custom Logo Concepts",
            "High Resolution Files",
            "Brand Identity Support",
            "Multiple Revisions",
        ],
        price: "₹2,000 - ₹15,000",
        order: 3,
    },
    {
        name: "Custom Website Design",
        slug: "custom-website-design",
        description:
            "Fully customized websites built according to your business goals and audience needs.",
        shortDescription: "Tailor-made websites",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        icon: "LayoutTemplate",
        features: [
            "Custom UI/UX",
            "Scalable Design",
            "SEO Friendly",
            "Performance Optimized",
        ],
        price: "₹20,000 - ₹1,00,000",
        order: 4,
    },
    {
        name: "Web Development",
        slug: "web-development",
        description:
            "Robust and scalable web development solutions using modern technologies.",
        shortDescription: "Full-stack web development",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
        icon: "Code",
        features: [
            "MERN Stack",
            "API Integration",
            "Secure Backend",
            "High Performance",
        ],
        price: "₹25,000 - ₹2,00,000",
        order: 5,
    },
    {
        name: "E-Commerce Development",
        slug: "ecommerce-development",
        description:
            "Build high-converting eCommerce stores with seamless user experience.",
        shortDescription: "Online store development",
        image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b",
        icon: "ShoppingCart",
        features: [
            "Payment Gateway Integration",
            "Cart System",
            "Admin Dashboard",
            "Product Management",
        ],
        price: "₹30,000 - ₹2,50,000",
        order: 6,
    },
    {
        name: "App Development",
        slug: "app-development",
        description:
            "We develop high-performance mobile apps for Android and iOS.",
        shortDescription: "Mobile app solutions",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
        icon: "Smartphone",
        features: [
            "Android & iOS Apps",
            "UI/UX Design",
            "API Integration",
            "App Store Deployment",
        ],
        price: "₹50,000 - ₹5,00,000",
        order: 7,
    },
    {
        name: "Game Development",
        slug: "game-development",
        description:
            "Interactive and engaging game development services across multiple platforms.",
        shortDescription: "Game creation services",
        image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1",
        icon: "Gamepad2",
        features: [
            "2D/3D Games",
            "Unity Development",
            "Cross-platform Support",
            "High Performance",
        ],
        price: "₹1,00,000 - ₹10,00,000",
        order: 8,
    },
    {
        name: "WordPress Development",
        slug: "wordpress-development",
        description:
            "Custom WordPress solutions including themes and plugins.",
        shortDescription: "WordPress websites",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
        icon: "Wordpress",
        features: [
            "Custom Themes",
            "Plugin Development",
            "SEO Optimization",
            "Easy CMS",
        ],
        price: "₹10,000 - ₹80,000",
        order: 9,
    },
    {
        name: "Digital Marketing",
        slug: "digital-marketing",
        description:
            "Data-driven marketing strategies to grow your business online.",
        shortDescription: "Online growth strategies",
        image: "https://images.unsplash.com/photo-1557838923-2985c318be48",
        icon: "TrendingUp",
        features: [
            "Social Media Marketing",
            "Lead Generation",
            "Brand Awareness",
            "Analytics Tracking",
        ],
        price: "₹8,000/month",
        order: 10,
    },
    {
        name: "Search Engine Optimization",
        slug: "seo",
        description:
            "Improve your search rankings and drive organic traffic.",
        shortDescription: "SEO services",
        image: "https://images.unsplash.com/photo-1562577309-2592ab84b1bc",
        icon: "Search",
        features: [
            "On-page SEO",
            "Off-page SEO",
            "Keyword Research",
            "Technical SEO",
        ],
        price: "₹5,000/month",
        order: 11,
    },
    {
        name: "PPC Advertising",
        slug: "ppc-advertising",
        description:
            "Maximize ROI with targeted paid campaigns.",
        shortDescription: "Paid marketing campaigns",
        image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
        icon: "MousePointerClick",
        features: [
            "Google Ads",
            "Facebook Ads",
            "Conversion Tracking",
            "Campaign Optimization",
        ],
        price: "₹10,000/month",
        order: 12,
    },
    {
        name: "Content Writing",
        slug: "content-writing",
        description:
            "SEO-friendly content to attract and engage users.",
        shortDescription: "Content creation services",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        icon: "FileText",
        features: [
            "Blog Writing",
            "SEO Content",
            "Copywriting",
            "Website Content",
        ],
        price: "₹1/word",
        order: 13,
    },
    {
        name: "Web Hosting",
        slug: "web-hosting",
        description:
            "Fast and secure hosting with high uptime.",
        shortDescription: "Reliable hosting services",
        image: "https://images.unsplash.com/photo-1581090700227-1e8a5f5f8b43",
        icon: "Server",
        features: [
            "99.9% Uptime",
            "SSL Security",
            "Daily Backup",
            "24/7 Support",
        ],
        price: "₹2,000/year",
        order: 14,
    },
    {
        name: "Bulk SMS",
        slug: "bulk-sms",
        description:
            "Send bulk SMS instantly for marketing and alerts.",
        shortDescription: "Mass messaging service",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        icon: "MessageSquare",
        features: [
            "Instant Delivery",
            "High Reach",
            "API Integration",
            "Campaign Reports",
        ],
        price: "₹0.15/SMS",
        order: 15,
    },
    {
        name: "WhatsApp Advertising Software",
        slug: "whatsapp-marketing",
        description:
            "Automate WhatsApp campaigns for better engagement.",
        shortDescription: "WhatsApp automation",
        image: "https://images.unsplash.com/photo-1587614382346-ac1d2d3c8d4d",
        icon: "MessageCircle",
        features: [
            "Bulk Messaging",
            "Automation",
            "Lead Conversion",
            "Campaign Tracking",
        ],
        price: "₹5,000/month",
        order: 16,
    },
    {
        name: "Domain Registration",
        slug: "domain-registration",
        description:
            "Secure your business domain with ease.",
        shortDescription: "Buy domain names",
        image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
        icon: "Globe",
        features: [
            ".com/.in Domains",
            "Easy Setup",
            "Affordable Pricing",
            "DNS Management",
        ],
        price: "₹999/year",
        order: 17,
    },
];

const seedDB = async () => {
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log("✅ Services Seeded Successfully");
    mongoose.connection.close();
};

seedDB();