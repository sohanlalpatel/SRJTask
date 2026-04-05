const PricingCategory = require("../models/PricingCategory");
const slugify = require("slugify");

// CREATE
exports.createCategory = async (req, res) => {
    try {
        const category = await PricingCategory.create({
            name: req.body.name,
            slug: slugify(req.body.name, { lower: true }),
        });

        res.json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ ALL
exports.getCategories = async (req, res) => {
    const data = await PricingCategory.find().sort();
    res.json(data);
};

// READ ONE
exports.getCategory = async (req, res) => {
    const data = await PricingCategory.findById(req.params.id);
    res.json(data);
};

// UPDATE
exports.updateCategory = async (req, res) => {
    const data = await PricingCategory.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: slugify(req.body.name, { lower: true }),
        },
        { new: true }
    );

    res.json(data);
};

// DELETE
exports.deleteCategory = async (req, res) => {
    await PricingCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
};