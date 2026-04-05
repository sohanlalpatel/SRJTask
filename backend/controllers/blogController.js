const Blog = require("../models/Blog");

// ✅ Create Blog
const slugify = require("slugify");

 
exports.createBlog = async (req, res) => {
    try {
        let content = req.body.content;

        // ✅ Fix array issue (Tiptap)
        if (Array.isArray(content)) {
            content = content.find(Boolean) || "";
        }

        if (!req.body.title || !req.body.excerpt || !content) {
            return res.status(400).json({
                success: false,
                message: "Title, Excerpt, Content are required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const slug = slugify(req.body.title, {
            lower: true,
            strict: true,
        });

        const tags = req.body.tags
            ? req.body.tags.split(",").map((t) => t.trim())
            : [];

        const isPublished =
            req.body.isPublished === "true" || req.body.isPublished === true;

        const blog = await Blog.create({
            title: req.body.title,
            excerpt: req.body.excerpt,
            content, // ✅ MOST IMPORTANT
            category: req.body.category,
            author: req.body.author || "SRJ Company",
            slug,
            tags,
            isPublished,
            image: `/uploads/blogs/${req.file.filename}`,
        });

        res.status(201).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Get All Blogs (Public)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Get Single Blog (by slug)
exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        // 👁 Increase views
        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Update Blog
exports.updateBlog = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // ✅ Fix content array
        if (updateData.content && Array.isArray(updateData.content)) {
            updateData.content = updateData.content.find(Boolean) || "";
        }

        if (req.file) {
            updateData.image = `/uploads/blogs/${req.file.filename}`;
        }

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ✅ Delete Blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ✅ Admin: Get All (including drafts)
exports.getAdminBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};