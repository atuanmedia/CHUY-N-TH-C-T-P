const express = require("express");
const { createService, getServices, getService, updateService, deleteService } = require("../controllers/service.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, createService);
router.get("/", auth, getServices);
router.get("/:id", auth, getService);
router.put("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;
