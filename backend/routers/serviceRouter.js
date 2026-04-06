const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");

const {
    createService,
    getAllServices,
    getServiceBySlug,
    updateService,
    deleteService,
    getServicesByCategory, // ✅ ADD
} = require("../controllers/serviceController");

// CREATE
router.post("/createService", upload.single("serviceImage"), createService);

// UPDATE
router.put("/updateService/:id", upload.single("serviceImage"), updateService);

// GET ALL
router.get("/getAllServices", getAllServices);

// 🔥 GET BY CATEGORY (IMPORTANT)
router.get("/category/:categoryId", getServicesByCategory);

// GET SINGLE
router.get("/getServiceBySlug/:slug", getServiceBySlug);

// DELETE
router.delete("/deleteService/:id", deleteService);

module.exports = router;