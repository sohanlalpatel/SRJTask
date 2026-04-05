require("dotenv").config();
const mongoose = require("mongoose");
const slugify = require("slugify");
const Blog = require("./models/Blog");

mongoose.connect(process.env.MONGO_URI);

const blogs = [
    {
        title: "Top Web Development Trends in 2026",
        excerpt:
            "Explore the latest web development trends shaping modern digital experiences in 2026.",
        content: `
Web development is evolving faster than ever. In 2026, technologies like AI-driven UI, serverless architecture, and edge computing are transforming how websites are built.

At SRJ Global Technology, we focus on creating scalable and performance-driven web applications. The rise of frameworks like Next.js and improvements in React ecosystem are making development faster and more efficient.

Businesses must adapt to modern UI/UX trends, focusing on speed, accessibility, and responsiveness. Progressive Web Apps (PWAs) are also gaining popularity as they provide native-like experience.

If you want to stay ahead, investing in modern web technologies is no longer optional—it’s essential.
    `,
        category: "Web Development",
        tags: ["web", "trends", "react", "nextjs"],
        image: "/uploads/blogs/sample1.jpg",
        isPublished: true,
    },

    {
        title: "Why Digital Marketing is Essential for Business Growth",
        excerpt:
            "Learn how digital marketing can accelerate your business growth and brand awareness.",
        content: `
Digital marketing has become the backbone of modern business strategies. From SEO to social media campaigns, companies rely heavily on digital channels.

At SRJ Global Technology, we design data-driven marketing strategies that deliver real results. Paid ads, content marketing, and influencer collaborations help businesses reach the right audience.

Search engine optimization (SEO) ensures long-term organic growth, while PPC campaigns provide instant traffic.

In today’s competitive world, digital marketing is not just an option—it’s a necessity for survival and growth.
    `,
        category: "Digital Marketing",
        tags: ["marketing", "seo", "growth"],
        image: "/uploads/blogs/sample2.jpg",
        isPublished: true,
    },

    {
        title: "The Power of Mobile App Development in 2026",
        excerpt:
            "Discover why mobile apps are crucial for business success in the modern digital age.",
        content: `
Mobile apps have revolutionized how businesses interact with customers. With billions of smartphone users, having a mobile app is a strategic advantage.

SRJ Global Technology specializes in building high-performance mobile applications using modern frameworks like React Native and Flutter.

Apps enhance user engagement, improve customer retention, and provide personalized experiences. From e-commerce to service-based businesses, mobile apps are driving innovation.

Investing in mobile app development is a step toward future-ready business solutions.
    `,
        category: "App Development",
        tags: ["mobile", "apps", "react-native"],
        image: "/uploads/blogs/sample3.jpg",
        isPublished: true,
    },

    {
        title: "SEO Strategies That Actually Work in 2026",
        excerpt:
            "Boost your website ranking with proven SEO techniques and strategies.",
        content: `
Search Engine Optimization (SEO) continues to evolve with Google’s algorithm updates. In 2026, user experience and content quality are more important than ever.

SRJ Global Technology focuses on technical SEO, keyword research, and high-quality content creation.

Core Web Vitals, mobile responsiveness, and page speed play a major role in rankings. Backlink building and authority content help improve domain credibility.

Effective SEO strategies can drive long-term organic traffic and increase conversions.
    `,
        category: "SEO",
        tags: ["seo", "google", "ranking"],
        image: "/uploads/blogs/sample4.jpg",
        isPublished: true,
    },

    {
        title: "Creative Graphic Design for Brand Identity",
        excerpt:
            "Learn how powerful graphic design can build a strong brand identity.",
        content: `
Graphic design plays a crucial role in shaping a brand’s identity. A well-designed logo, color palette, and visual elements create a lasting impression.

At SRJ Global Technology, we focus on creating visually appealing and meaningful designs that resonate with your audience.

From social media creatives to branding materials, design consistency is key to building trust.

A strong visual identity can differentiate your business from competitors and attract more customers.
    `,
        category: "Design",
        tags: ["design", "branding", "ui"],
        image: "/uploads/blogs/sample5.jpg",
        isPublished: true,
    },

    {
        title: "How E-Commerce is Transforming Businesses",
        excerpt:
            "Explore how e-commerce platforms are reshaping the future of retail.",
        content: `
E-commerce has revolutionized the way businesses operate. Online stores provide convenience, accessibility, and global reach.

SRJ Global Technology builds scalable e-commerce platforms with secure payment gateways and seamless user experiences.

From product management to analytics, modern e-commerce solutions offer powerful tools for business growth.

With the rise of digital shopping, investing in e-commerce is a smart move for long-term success.
    `,
        category: "Business",
        tags: ["ecommerce", "business", "online"],
        image: "/uploads/blogs/sample6.jpg",
        isPublished: true,
    },

    {
        title: "Future of Artificial Intelligence in Technology",
        excerpt:
            "Understand how AI is transforming industries and shaping the future.",
        content: `
Artificial Intelligence is revolutionizing industries worldwide. From chatbots to automation, AI is enhancing efficiency and decision-making.

SRJ Global Technology integrates AI solutions into modern applications to improve performance and user experience.

Machine learning, natural language processing, and predictive analytics are key components of AI-driven systems.

The future belongs to businesses that leverage AI to innovate and stay competitive.
    `,
        category: "Business",
        tags: ["ai", "future", "technology"],
        image: "/uploads/blogs/sample7.jpg",
        isPublished: true,
    },

    {
        title: "Why Every Business Needs a Website",
        excerpt:
            "A professional website is the foundation of your online presence.",
        content: `
In today’s digital era, having a website is essential for any business. It acts as your online identity and builds credibility.

SRJ Global Technology creates modern, responsive websites that attract and engage users.

A well-designed website improves customer trust, increases visibility, and generates leads.

Without a website, businesses risk losing opportunities in the competitive online market.
    `,
        category: "Web Development",
        tags: ["website", "business", "online"],
        image: "/uploads/blogs/sample8.jpg",
        isPublished: true,
    },
];

// 🚀 Seed Function
const seedBlogs = async () => {
    try {
        await Blog.deleteMany();

        const formattedBlogs = blogs.map((b) => ({
            ...b,
            slug: slugify(b.title, { lower: true, strict: true }),
        }));

        await Blog.insertMany(formattedBlogs);

        console.log("✅ Blogs Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedBlogs();