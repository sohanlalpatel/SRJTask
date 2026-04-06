const Industry = require("../models/Industry");
const slugify = require("slugify");

// ================= CREATE =================
exports.createIndustry = async (req, res) => {
    try {
        const industry = await Industry.create({
            ...req.body,

            slug: slugify(req.body.name, { lower: true }),

            // ✅ IMAGE HANDLE
            image: req.file
                ? `/uploads/industries/${req.file.filename}`
                : "",

            // ✅ ARRAY FIX
            services: req.body.services
                ? req.body.services.split(",").map((s) => s.trim())
                : [],

            benefits: req.body.benefits
                ? req.body.benefits.split(",").map((b) => b.trim())
                : [],
        });

        res.json({ success: true, data: industry });
    } catch (err) {
        console.log("CREATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};
 
    exports.getIndustries = async (req, res) => {
        try {
            const industries = await Industry.find({ isActive: true })
                .sort({ order: 1 });

            res.json({ success: true, data: industries });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

 
    exports.getIndustry = async (req, res) => {
        try {
            const industry = await Industry.findById(req.params.id);

            res.json({ success: true, data: industry });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

 
    exports.getIndustryBySlug = async (req, res) => {
        try {
            const industry = await Industry.findOne({
                slug: req.params.slug,
            });

            res.json({ success: true, data: industry });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

 
    exports.updateIndustry = async (req, res) => {
        try {
            let updateData = { ...req.body };

            // ✅ SLUG UPDATE
            if (req.body.name) {
                updateData.slug = slugify(req.body.name, { lower: true });
            }

            // ✅ IMAGE UPDATE
            if (req.file) {
                updateData.image = `/uploads/industries/${req.file.filename}`;
            }

            // ✅ ARRAY FIX
            if (req.body.services) {
                updateData.services = req.body.services
                    .split(",")
                    .map((s) => s.trim());
            }

            if (req.body.benefits) {
                updateData.benefits = req.body.benefits
                    .split(",")
                    .map((b) => b.trim());
            }

            // ✅ ORDER FIX (IMPORTANT)
            if (req.body.order) {
                updateData.order = Number(req.body.order) || 0;
            }

            const industry = await Industry.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            res.json({ success: true, data: industry });
        } catch (err) {
            console.log("UPDATE ERROR:", err);
            res.status(500).json({ error: err.message });
        }
    };

 
    exports.deleteIndustry = async (req, res) => {
        try {
            await Industry.findByIdAndDelete(req.params.id);

            res.json({ success: true, message: "Deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };