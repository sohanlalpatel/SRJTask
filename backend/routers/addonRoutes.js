const express = require("express");
const router = express.Router();

const {
    createAddOn,
    getAddOns,
    getAddOn,
    updateAddOn,
    deleteAddOn,
} = require("../controllers/AddOnController");

// CREATE
router.post("/createAddOn", createAddOn);

// READ ALL
router.get("/getAddOns", getAddOns);

// READ ONE
router.get("/getAddOn/:id", getAddOn);

// UPDATE
router.put("/updateAddOn/:id", updateAddOn);

// DELETE
router.delete("/deleteAddOn/:id", deleteAddOn);

module.exports = router;