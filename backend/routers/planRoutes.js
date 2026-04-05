const express = require("express");
const router = express.Router();

const {
  
    createPlan,
    getPlans,
    getPlan,
    updatePlan,
    deletePlan,
    getPlansByCategory,
} = require("../controllers/pricingPlanController");

// CREATE
router.post("/createPlan", createPlan);

// READ ALL
router.get("/getPlans", getPlans);

// READ BY CATEGORY (IMPORTANT for UI)
router.get("/category/:categoryId", getPlansByCategory);

// READ ONE
router.get("/getPlan/:id", getPlan);

// UPDATE
router.put("/updatePlan/:id", updatePlan);

// DELETE
router.delete("/deletePlan/:id", deletePlan);

module.exports = router;