

 
const Order = require("../models/Order");

// POST /api/orders/submit  (Public)
exports.submitOrder = async (req, res) => {
    try {
        const {
            userName, userEmail, userPhone, userCompany, message,
            planId, planName, planBasePrice,
            serviceId, serviceName, serviceCategory,
            addons, deliveryDays, timelinePricing, totalAmount, source,
        } = req.body;

        if (!userName || !userEmail || !userPhone) {
            return res.status(400).json({ success: false, message: "Name, email and phone are required." });
        }
        if (!planId && !planName) {
            return res.status(400).json({ success: false, message: "Plan details are required." });
        }

        const order = await Order.create({
            userName, userEmail, userPhone, userCompany, message,
            planId: planId || null,
            planName, planBasePrice,
            serviceId: serviceId || null,
            serviceName, serviceCategory,
            addons: addons || [],
            deliveryDays, timelinePricing,
            totalAmount,
            source: source || "Pricing Page",
        });

        res.status(201).json({ success: true, message: "Order placed successfully!", data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders/all  (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, search, startDate, endDate, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status && status !== "all") filter.status = status;
        if (search) {
            filter.$or = [
                { userName: { $regex: search, $options: "i" } },
                { userEmail: { $regex: search, $options: "i" } },
                { userPhone: { $regex: search, $options: "i" } },
                { planName: { $regex: search, $options: "i" } },
                { serviceName: { $regex: search, $options: "i" } },
                { serviceCategory: { $regex: search, $options: "i" } },
            ];
        }
        if (startDate || endDate) {
            filter.submittedAt = {};
            if (startDate) filter.submittedAt.$gte = new Date(startDate);
            if (endDate) filter.submittedAt.$lte = new Date(endDate);
        }

        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders/:id  (Admin)
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found." });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/orders/:id/status  (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, assignedTo, adminNote } = req.body;
        const update = {};
        if (status) update.status = status;
        if (assignedTo !== undefined) update.assignedTo = assignedTo;
        if (adminNote !== undefined) update.adminNote = adminNote;

        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!order) return res.status(404).json({ success: false, message: "Order not found." });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/orders/:id  (Admin)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found." });
        res.json({ success: true, message: "Order deleted." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/orders/stats  (Admin dashboard)
exports.getOrderStats = async (req, res) => {
    try {
        const total = await Order.countDocuments();
        const newOrders = await Order.countDocuments({ status: "new" });
        const confirmed = await Order.countDocuments({ status: "confirmed" });
        const inProgress = await Order.countDocuments({ status: "in-progress" });
        const delivered = await Order.countDocuments({ status: "delivered" });
        const cancelled = await Order.countDocuments({ status: "cancelled" });
        const last7 = await Order.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });

        // Revenue
        const revenueAgg = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        // Top plans
        const topPlans = await Order.aggregate([
            { $group: { _id: "$planName", count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        res.json({
            success: true,
            data: { total, newOrders, confirmed, inProgress, delivered, cancelled, last7, totalRevenue, topPlans },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
