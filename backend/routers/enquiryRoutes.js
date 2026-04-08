const express = require("express");
const router = express.Router();

const {
    submitEnquiry,
    getAllEnquiries,
    getEnquiryById,
    updateEnquiryStatus,
    deleteEnquiry,
    getEnquiryStats,
} = require("../controllers/Enquirycontroller");

// Public
router.post("/submit", submitEnquiry);

// Admin
router.get("/stats", getEnquiryStats);       // GET /api/enquiries/stats
router.get("/all", getAllEnquiries);        // GET /api/enquiries/all?status=new&search=&page=1
router.get("/:id", getEnquiryById);        // GET /api/enquiries/:id
router.patch("/:id/status", updateEnquiryStatus); // PATCH /api/enquiries/:id/status
router.delete("/:id", deleteEnquiry);         // DELETE /api/enquiries/:id

module.exports = router;

// ── In server.js / app.js add: ──
// const enquiryRoutes = require("./routes/enquiryRoutes");
// app.use("/api/enquiries", enquiryRoutes);