const express = require("express");
const router = express.Router();
const { getRevenueReport, getAgingReport } = require("../controllers/report.controller");

// /api/reports/revenue
router.get("/revenue", getRevenueReport);

// /api/reports/aging
router.get("/aging", getAgingReport);

module.exports = router;
