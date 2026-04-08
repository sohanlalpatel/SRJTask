const Enquiry = require("../models/Enquiry");

// ── POST /api/enquiries/submit  (Public - from frontend)
exports.submitEnquiry = async (req, res) => {
    try {
        const {
            userName, userEmail, userPhone, userCompany,
            serviceId, serviceName, serviceCategory, servicePrice,
            budget, timeline, message, source,
        } = req.body;

        if (!userName || !userEmail || !userPhone) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and phone are required.",
            });
        }

        const enquiry = await Enquiry.create({
            userName, userEmail, userPhone, userCompany,
            serviceId: serviceId || null,
            serviceName, serviceCategory, servicePrice,
            budget, timeline, message,
            source: source || "Service Detail Page",
        });

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully.",
            data: enquiry,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/enquiries/all  (Admin)
exports.getAllEnquiries = async (req, res) => {
    try {
        const {
            status,
            search,
            startDate,
            endDate,
            page = 1,
            limit = 20,
        } = req.query;

        const filter = {};

        if (status && status !== "all") filter.status = status;

        if (search) {
            filter.$or = [
                { userName: { $regex: search, $options: "i" } },
                { userEmail: { $regex: search, $options: "i" } },
                { userPhone: { $regex: search, $options: "i" } },
                { userCompany: { $regex: search, $options: "i" } },
                { serviceName: { $regex: search, $options: "i" } },
            ];
        }

        if (startDate || endDate) {
            filter.submittedAt = {};
            if (startDate) filter.submittedAt.$gte = new Date(startDate);
            if (endDate) filter.submittedAt.$lte = new Date(endDate);
        }

        const total = await Enquiry.countDocuments(filter);
        const enquiries = await Enquiry.find(filter)
            .populate("serviceId", "name image slug")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: enquiries,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/enquiries/:id  (Admin - single)
exports.getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id)
            .populate("serviceId", "name image slug price");

        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found." });
        }

        res.json({ success: true, data: enquiry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── PATCH /api/enquiries/:id/status  (Admin - update status)
exports.updateEnquiryStatus = async (req, res) => {
    try {
        const { status, assignedTo, adminNote } = req.body;

        const update = {};
        if (status) update.status = status;
        if (assignedTo) update.assignedTo = assignedTo;
        if (adminNote !== undefined) update.adminNote = adminNote;

        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        );

        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found." });
        }

        res.json({ success: true, data: enquiry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── DELETE /api/enquiries/:id  (Admin)
exports.deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found." });
        }

        res.json({ success: true, message: "Enquiry deleted successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/enquiries/stats  (Admin - dashboard numbers)
exports.getEnquiryStats = async (req, res) => {
    try {
        const total = await Enquiry.countDocuments();
        const newCount = await Enquiry.countDocuments({ status: "new" });
        const contacted = await Enquiry.countDocuments({ status: "contacted" });
        const inProgress = await Enquiry.countDocuments({ status: "in-progress" });
        const converted = await Enquiry.countDocuments({ status: "converted" });
        const closed = await Enquiry.countDocuments({ status: "closed" });

        // Last 7 days
        const last7 = await Enquiry.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });

        // Top services by enquiry count
        const topServices = await Enquiry.aggregate([
            { $group: { _id: "$serviceName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        res.json({
            success: true,
            data: {
                total, newCount, contacted, inProgress, converted, closed, last7, topServices,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};