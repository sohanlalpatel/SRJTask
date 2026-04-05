const PricingRule = require("../models/PricingRule");

// CREATE
exports.createRule = async (req, res) => {
    const rule = await PricingRule.create(req.body);
    res.json(rule);
};

// READ ALL
exports.getRules = async (req, res) => {
    const rules = await PricingRule.find().sort({ createdAt: -1 });
    res.json(rules);
};

// READ ONE
exports.getRule = async (req, res) => {
    const rule = await PricingRule.findById(req.params.id);
    res.json(rule);
};

// UPDATE
exports.updateRule = async (req, res) => {
    const rule = await PricingRule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(rule);
};

// DELETE
exports.deleteRule = async (req, res) => {
    await PricingRule.findByIdAndDelete(req.params.id);
    res.json({ message: "Rule deleted" });
};