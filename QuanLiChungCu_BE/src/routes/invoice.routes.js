const express = require("express");
const { createInvoice, getInvoices, getInvoice, updateInvoice, deleteInvoice, addPayment, getInvoicesByResident } = require("../controllers/invoice.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();


router.post("/", auth, createInvoice);
router.get("/", auth, getInvoices);
router.get("/resident/:residentId", auth, getInvoicesByResident);
router.get("/:id", auth, getInvoice);
router.put("/:id", auth, updateInvoice);
router.delete("/:id", auth, deleteInvoice);
router.post("/:id/payments", auth, addPayment);


module.exports = router;