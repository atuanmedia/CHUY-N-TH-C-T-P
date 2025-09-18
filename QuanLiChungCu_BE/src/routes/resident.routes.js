const express = require("express");
const { createResident, getResidents, getResident, updateResident, deleteResident } = require("../controllers/resident.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, createResident);
router.get("/", auth, getResidents);
router.get("/:id", auth, getResident);
router.put("/:id", auth, updateResident);
router.delete("/:id", auth, deleteResident);

module.exports = router;
