const Service = require("../models/services");

const slugify = require("slugify");


exports.createService = async (req, res) => {
    try {
        const service = await Service.create({
            ...req.body,
            slug: req.body.name.toLowerCase().replace(/ /g, "-"),
            image: req.file
                ? `/uploads/services/${req.file.filename}`
                : "",
            features: req.body.features
                ? req.body.features.split(",")
                : [],
        });

        res.json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateService = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            updateData.image = `/uploads/services/${req.file.filename}`;
        }

        if (req.body.features) {
            updateData.features = req.body.features.split(",");
        }

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


 

// GET ALL SERVICES
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true }).sort({ order: 1 });

        res.json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET SINGLE SERVICE BY SLUG
exports.getServiceBySlug = async (req, res) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug });

        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

 

// DELETE SERVICE
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
        res.status(500).json({ success: false, message: error.message });
    }
};