// ═══════════════════════════════════════════════
const express = require("express");
const router = express.Router();
const {
    submitOrder, getAllOrders, getOrderById,
    updateOrderStatus, deleteOrder, getOrderStats,
} = require("../controllers/OrderController");

// Public
router.post("/submitOrder", submitOrder);

// Admin
router.get("/stats", getOrderStats);
router.get("/all", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;

