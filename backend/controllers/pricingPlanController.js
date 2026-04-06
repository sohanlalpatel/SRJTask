const PricingPlan = require("../models/PricingPlan");
const Service = require("../models/services"); // ✅ FIXED
const mongoose = require("mongoose");
// 🔧 Helper
const formatArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;

    if (typeof field === "string") {
        return field.split(",").map((item) => item.trim());
    }

    return [];
};

// ================= CREATE =================
exports.createPlan = async (req, res) => {
    try {
        let { basePrice, features, technologies, isPopular, service } = req.body;

        // ✅ VALIDATION (VERY IMPORTANT)
        if (!service) {
            return res.status(400).json({ error: "Service is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(service)) {
            return res.status(400).json({ error: "Invalid Service ID" });
        }

        // ✅ PRICE FIX
        if (basePrice) {
            basePrice = basePrice.toString().replace(/,/g, "");
        }

        const plan = await PricingPlan.create({
            ...req.body,

            service: new mongoose.Types.ObjectId(service), // 🔥 FORCE FIX

            basePrice: Number(basePrice) || 0,
            features: formatArrayField(features),
            technologies: formatArrayField(technologies),
            isPopular: isPopular === "true" || isPopular === true,
        });

        res.json({ success: true, data: plan });
    } catch (err) {
        console.log("CREATE PLAN ERROR:", err); // 🔥 DEBUG
        res.status(500).json({ error: err.message });
    }
};
// ================= READ ALL =================
exports.getPlans = async (req, res) => {
    try {
        const plans = await PricingPlan.find({ isActive: true })
            .populate({
                path: "service",
                populate: { path: "category" },
            })
            .sort({ order: 1 });

        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= READ BY CATEGORY =================
exports.getPlansByCategory = async (req, res) => {
    try {
        const services = await Service.find({
            category: req.params.categoryId,
            isActive: true,
        });

        const serviceIds = services.map((s) => s._id);

        const plans = await PricingPlan.find({
            service: { $in: serviceIds },
            isActive: true,
        })
            .populate({
                path: "service",
                populate: { path: "category" },
            })
            .sort({ order: 1 });

        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= READ BY SERVICE ================= 🔥
exports.getPlansByService = async (req, res) => {
    try {
        const plans = await PricingPlan.find({
            service: req.params.serviceId,
            isActive: true,
        })
            .populate({
                path: "service",
                populate: { path: "category" },
            })
            .sort({ order: 1 });

        res.json({ success: true, data: plans });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= READ ONE =================
exports.getPlan = async (req, res) => {
    try {
        const plan = await PricingPlan.findById(req.params.id).populate({
            path: "service",
            populate: { path: "category" },
        });

        res.json({ success: true, data: plan });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= UPDATE =================
exports.updatePlan = async (req, res) => {
    try {
        let { basePrice, features, technologies, isPopular } = req.body;

        if (basePrice) {
            basePrice = basePrice.toString().replace(/,/g, "");
            req.body.basePrice = Number(basePrice);
        }

        if (features) {
            req.body.features = formatArrayField(features);
        }

        if (technologies) {
            req.body.technologies = formatArrayField(technologies);
        }

        if (isPopular !== undefined) {
            req.body.isPopular = isPopular === "true" || isPopular === true;
        }

        const plan = await PricingPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("service"); // ✅ nice to have

        res.json({ success: true, data: plan });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= DELETE =================
exports.deletePlan = async (req, res) => {
    try {
        await PricingPlan.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Plan deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};