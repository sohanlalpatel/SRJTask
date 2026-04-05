const AddOn = require("../models/AddOn");

// CREATE
exports.createAddOn = async (req, res) => {
    const addon = await AddOn.create(req.body);
    res.json(addon);
};

// READ ALL
exports.getAddOns = async (req, res) => {
    const data = await AddOn.find().sort({ createdAt: -1 });
    res.json(data);
};

// READ ONE
exports.getAddOn = async (req, res) => {
    const data = await AddOn.findById(req.params.id);
    res.json(data);
};

// UPDATE
exports.updateAddOn = async (req, res) => {
    const data = await AddOn.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(data);
};

// DELETE
exports.deleteAddOn = async (req, res) => {
    await AddOn.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};