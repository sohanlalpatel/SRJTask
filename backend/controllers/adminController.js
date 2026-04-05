const Admin = require("../models/admin");

module.exports.AdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminCount = await Admin.countDocuments();

        // First admin auto create
        if (adminCount === 0) {
            const newAdmin = await Admin.create({ email, password });

            return res.status(201).json({
                success: true,
                message: "Admin registered and logged in successfully",
                adminId: newAdmin._id,
            });
        }

        // Find admin
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email",
            });
        }

        if (password !== admin.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            adminId: admin._id,
            role: "admin",
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message:  "Server error",
        });
    }
};