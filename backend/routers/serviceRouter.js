const express = require("express");
const router = express.Router();
const upload = require("../middleware/Upload");

const {
    createService,
    getAllServices,
    getServiceBySlug,
    updateService,
    deleteService,
} = require("../controllers/serviceController");

 


// CREATE
router.post("/createService", upload.single("serviceImage"),createService);

// UPDATE
router.put("/updateService/:id", upload.single("serviceImage"),updateService);
router.post("/createService", createService);

// GET ALL
router.get("/getAllServices", getAllServices);

// GET SINGLE
router.get("/getServiceBySlug/:slug", getServiceBySlug);

    

// DELETE
router.delete("/deleteService/:id", deleteService);

module.exports = router;