const express = require("express");
const router = express.Router();

const {
    createPlan,
    getPlans,
    getPlan,
    updatePlan,
    deletePlan,
    getPlansByCategory,
    getPlansByService, // ✅ ADD THIS
} = require("../controllers/pricingPlanController");

// CREATE
router.post("/createPlan", createPlan);

// READ ALL
router.get("/getPlans", getPlans);

// 🔥 CATEGORY BASED
router.get("/category/:categoryId", getPlansByCategory);

// 🔥 SERVICE BASED (MOST IMPORTANT)
router.get("/service/:serviceId", getPlansByService);

// READ ONE
router.get("/getPlan/:id", getPlan);

// UPDATE
router.put("/updatePlan/:id", updatePlan);

// DELETE
router.delete("/deletePlan/:id", deletePlan);

module.exports = router;