const Service = require("../models/services");
const slugify = require("slugify");

// CREATE
exports.createService = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        if (!req.body.category || req.body.category === "") {
            return res.status(400).json({ error: "Category is required" });
        }

        let slug = slugify(req.body.name, { lower: true });

        const existing = await Service.findOne({ slug });
        if (existing) {
            slug = slug + "-" + Date.now();
        }

        const service = await Service.create({
            ...req.body,
            slug,
            image: req.file
                ? `/uploads/services/${req.file.filename}`
                : "",
            features: typeof req.body.features === "string"
                ? req.body.features.split(",").map(f => f.trim())
                : [],
        });

        res.json({ success: true, data: service });

    } catch (err) {
        console.error("CREATE ERROR:", err); // 🔥 IMPORTANT
        res.status(500).json({ error: err.message });
    }
};


exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate("category");

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, data: service });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET BY CATEGORY
exports.getServicesByCategory = async (req, res) => {
    try {
        const services = await Service.find({
            category: req.params.categoryId,
            isActive: true,
        })
            .populate("category") // ✅ IMPORTANT
            .sort({ order: 1 });

        res.json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true })
            .populate("category")
            .sort({ order: 1 });

        res.json({
            success: true,
            data: services,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET SINGLE
exports.getServiceBySlug = async (req, res) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug })
            .populate("category"); // ✅ IMPORTANT

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
exports.updateService = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            updateData.image = `/uploads/services/${req.file.filename}`;
        }

        if (typeof req.body.features === "string") {
            updateData.features = req.body.features.split(",").map(f => f.trim());
        }

        if (req.body.name) {
            updateData.slug = slugify(req.body.name, { lower: true }); // ✅ FIXED
        }

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        res.json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




// DELETE
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};