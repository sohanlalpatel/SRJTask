const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");

const {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    getAdminBlogs,
} = require("../controllers/blogController");

// 🌐 Public Routes
router.get("/getAllBlogs", getAllBlogs);
router.get("/getSingleBlog/:slug", getSingleBlog);

// 🔐 Admin Routes

// ✅ Create Blog with Image
router.post(
    "/createBlog",
    upload.single("blogImage"), // 👈 IMPORTANT
    createBlog
);

// ✅ Update Blog with optional image
router.put(
    "/updateBlog/:id",
    upload.single("blogImage"), // 👈 IMPORTANT
    updateBlog
);

router.get("/admin/all", getAdminBlogs);
router.delete("/deleteBlog/:id", deleteBlog);

module.exports = router;