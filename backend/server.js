require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const adminroutes = require("./routers/adminroutes");
const serviceRoutes = require("./routers/serviceRouter");
const blogsRoutes = require("./routers/blogRoutes")
const categoryRoutes = require("./routers/categoryRoutes");
const planRoutes = require("./routers/planRoutes");
const addonRoutes = require("./routers/addonRoutes");
const contactRoutes = require("./routers/contactRouter");
const chatRoutes = require("./routers/chatroutes");
const industryRoutes = require("./routers/industryRoutes");
const enquiryRoutes = require("./routers/enquiryRoutes");
const orderRoutes = require("./routers/orderRoutes");


 
const app = express();

 app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://gaming-sw.vercel.app"
    ],
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(" DB Error:", err));

app.use("/uploads", express.static("uploads"));
app.use('/api/admin', adminroutes)
app.use("/api/services", serviceRoutes);
app.use("/api/blogs", blogsRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/addons", addonRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes); 
app.use("/api/twilio", require("./routers/twilioWebhook"));
app.use("/api/industries", industryRoutes);
app.use("/api/enquiries", enquiryRoutes);
 app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date(),
    });
});

app.get("/", (req, res) => {
    res.send("AI Chatbot Server Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});



app.use((err, req, res, next) => {
    console.error("❌ Global Error:", err);
    res.status(500).json({
        message: err.message || "Internal Server Error"
    });
});