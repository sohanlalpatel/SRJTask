const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");

const {
    createIndustry,
    getIndustries,
    getIndustry,
    getIndustryBySlug,
    updateIndustry,
    deleteIndustry,
} = require("../controllers/industryController");

// CREATE

router.post(
    "/createIndustry",
    upload.single("industryImage"),
    createIndustry
);


// GET ALL
router.get("/getIndustries", getIndustries);

// GET ONE
router.get("/getIndustry/:id", getIndustry);

// GET BY SLUG (SEO)
router.get("/slug/:slug", getIndustryBySlug);

// UPDATE
router.put(
    "/updateIndustry/:id",
    upload.single("industryImage"),
    updateIndustry
);
// DELETE
router.delete("/deleteIndustry/:id", deleteIndustry);

module.exports = router;