 const mongoose = require("mongoose");
const Industry = require("./models/Industry"); // adjust path if needed
  
 
 
  
 // ===== DATA =====
const industries = [
    {
        name: "Healthcare & Fitness",
        slug: "healthcare-fitness",
        description: "Build wellness with tech.",
        content: "We develop HIPAA-compliant healthcare systems, fitness tracking apps, and telemedicine platforms that improve patient engagement and operational efficiency.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
        services: [
            "Telemedicine App Development",
            "Patient Management Systems",
            "Fitness Tracking Apps",
            "AI Health Analytics"
        ],
        benefits: [
            "Secure & compliant systems",
            "Real-time monitoring",
            "High scalability",
            "Better engagement"
        ],
        order: 1,
    },

    {
        name: "Event & Ticketing",
        slug: "event-ticketing",
        description: "Manage events seamlessly.",
        content: "We create event management platforms, ticket booking systems, and real-time check-in solutions.",
        image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
        services: [
            "Event Booking Platforms",
            "QR Check-in Systems",
            "Seat Management",
            "Payment Integration"
        ],
        benefits: [
            "Smooth event handling",
            "Real-time analytics",
            "Secure payments",
            "Scalable systems"
        ],
        order: 2,
    },

    {
        name: "Food & Beverage",
        slug: "food-beverage",
        description: "Digitizing dining experiences.",
        content: "We build food delivery apps, POS systems, and online ordering platforms for restaurants.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        services: [
            "Food Delivery Apps",
            "Restaurant POS Systems",
            "Online Ordering Systems",
            "Inventory Management"
        ],
        benefits: [
            "Faster service",
            "Inventory automation",
            "Better UX",
            "Scalable platform"
        ],
        order: 3,
    },

    {
        name: "Ecommerce & Retail",
        slug: "ecommerce-retail",
        description: "Scalable retail solutions.",
        content: "We develop high-performance ecommerce platforms with secure payments and analytics.",
        image: "https://images.unsplash.com/photo-1515169067865-5387ec356754",
        services: [
            "Shopify Stores",
            "Custom Ecommerce",
            "Payment Gateway",
            "Inventory Automation"
        ],
        benefits: [
            "Secure checkout",
            "Analytics dashboard",
            "High conversion",
            "Scalable infra"
        ],
        order: 4,
    },

    {
        name: "Digital Marketing",
        slug: "digital-marketing",
        description: "Drive visibility and leads.",
        content: "We provide SEO, paid ads, and automation tools to maximize ROI.",
        image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
        services: [
            "SEO Optimization",
            "Google Ads",
            "Email Marketing",
            "Analytics Tracking"
        ],
        benefits: [
            "Lead generation",
            "High ROI",
            "Brand growth",
            "Data insights"
        ],
        order: 5,
    },

    {
        name: "Social Networking",
        slug: "social-networking",
        description: "Connect your audience.",
        content: "We build scalable social platforms with chat and engagement tools.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        services: [
            "Social Apps",
            "Chat Systems",
            "Community Platforms",
            "Content Moderation"
        ],
        benefits: [
            "High engagement",
            "Realtime systems",
            "Secure backend",
            "Scalable design"
        ],
        order: 6,
    },

    {
        name: "Business Startup",
        slug: "business-startup",
        description: "Launch your startup fast.",
        content: "We help startups build MVPs and scale products quickly.",
        image: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
        services: [
            "MVP Development",
            "Startup Consulting",
            "UI/UX Design",
            "Cloud Setup"
        ],
        benefits: [
            "Fast launch",
            "Cost effective",
            "Scalable",
            "Investor ready"
        ],
        order: 7,
    },

    {
        name: "Enterprise Solutions",
        slug: "enterprise-solutions",
        description: "Robust enterprise systems.",
        content: "We develop ERP, CRM, and automation tools for enterprises.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        services: [
            "ERP Systems",
            "CRM Software",
            "Automation",
            "Cloud Infra"
        ],
        benefits: [
            "Efficiency",
            "Automation",
            "Security",
            "Scalability"
        ],
        order: 8,
    },

    {
        name: "Education & Learning",
        slug: "education-learning",
        description: "Smart learning platforms.",
        content: "We build LMS, online courses, and virtual classrooms.",
        image: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b",
        services: [
            "LMS Systems",
            "Online Courses",
            "Live Classes",
            "Student Analytics"
        ],
        benefits: [
            "Interactive learning",
            "Scalable",
            "Analytics",
            "Modern UI"
        ],
        order: 9,
    }
];

// ===== SEED FUNCTION =====
const seed = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/SRJG");

        await Industry.deleteMany();
        await Industry.insertMany(industries);

        console.log("✅ Industries Seeded Successfully");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();