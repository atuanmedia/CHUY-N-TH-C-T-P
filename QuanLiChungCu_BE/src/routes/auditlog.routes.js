const express = require("express");
const { getLogs } = require("../controllers/auditlog.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", auth, getLogs);

module.exports = router;
