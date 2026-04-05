const PricingPlan = require("../models/PricingPlan");

// 🔧 Helper function (IMPORTANT)
const formatArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field.split(",").map((item) => item.trim());
};

// ================= CREATE =================
exports.createPlan = async (req, res) => {
    try {
        let {
            basePrice,
            features,
            technologies,
            isPopular,
        } = req.body;

        // ✅ Price clean
        if (basePrice) {
            basePrice = basePrice.toString().replace(/,/g, "");
        }

        const plan = await PricingPlan.create({
            ...req.body,

            basePrice: Number(basePrice) || 0,

            // ✅ Arrays
            features: formatArrayField(features),
            technologies: formatArrayField(technologies),

            // ✅ Boolean fix
            isPopular: isPopular === "true" || isPopular === true,
        });

        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= READ ALL =================
exports.getPlans = async (req, res) => {
    try {
        const plans = await PricingPlan.find()
            .populate("category")
            .sort({ order: -1 });

        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= READ BY CATEGORY =================
exports.getPlansByCategory = async (req, res) => {
    try {
        const plans = await PricingPlan.find({
            category: req.params.categoryId,
        }).sort({ order: 1 });

        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= READ ONE =================
exports.getPlan = async (req, res) => {
    try {
        const plan = await PricingPlan.findById(req.params.id);
        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= UPDATE =================
exports.updatePlan = async (req, res) => {
    try {
        let {
            basePrice,
            features,
            technologies,
            isPopular,
        } = req.body;

        // ✅ Price clean
        if (basePrice) {
            basePrice = basePrice.toString().replace(/,/g, "");
            req.body.basePrice = Number(basePrice);
        }

        // ✅ Arrays
        if (features) {
            req.body.features = formatArrayField(features);
        }

        if (technologies) {
            req.body.technologies = formatArrayField(technologies);
        }

        // ✅ Boolean fix
        if (isPopular !== undefined) {
            req.body.isPopular = isPopular === "true" || isPopular === true;
        }

        const plan = await PricingPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // ✅ correct option
        );

        res.json(plan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ================= DELETE =================
exports.deletePlan = async (req, res) => {
    try {
        await PricingPlan.findByIdAndDelete(req.params.id);
        res.json({ message: "Plan deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};