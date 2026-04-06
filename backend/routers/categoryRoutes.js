const express = require("express");
const router = express.Router();

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/pricingCategorycontroller");

// CREATE
router.post("/createCategory", createCategory);

// READ ALL
router.get("/getCategories", getCategories);

 
// READ ONE
router.get("/getCategory/:id", getCategory);

// UPDATE
router.put("/updateCategory/:id", updateCategory);

// DELETE
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;