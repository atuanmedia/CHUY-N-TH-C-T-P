const express = require("express");
const { createPayment, getPayments, getPayment, updatePayment, deletePayment } = require("../controllers/payment.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, createPayment);
router.get("/", auth, getPayments);
router.get("/:id", auth, getPayment);
router.put("/:id", auth, updatePayment);
router.delete("/:id", auth, deletePayment);

module.exports = router;
