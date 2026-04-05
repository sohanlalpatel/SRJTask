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


dotenv.config();

const app = express();

 app.use(express.json());
app.use(cors());
 
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






app.get("/", (req, res) => {
    res.send("AI Chatbot Server Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});