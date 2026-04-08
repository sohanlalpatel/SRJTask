const express = require("express");
const {
    createContact,
    getAllContacts,
    getSingleContact,
    updateContactStatus,
    deleteContact,
} = require("../controllers/Contactcontroller");

const router = express.Router();

// PUBLIC
router.post("/create", createContact);

// ADMIN
router.get("/", getAllContacts);
router.get("/:id", getSingleContact);
router.put("/:id", updateContactStatus);
router.delete("/:id", deleteContact);

module.exports = router;