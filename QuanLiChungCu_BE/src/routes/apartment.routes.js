const express = require("express");
const { createApartment, getApartments, getApartment, updateApartment, deleteApartment } = require("../controllers/apartment.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, createApartment);
router.get("/", auth, getApartments);
router.get("/:id", auth, getApartment);
router.put("/:id", auth, updateApartment);
router.delete("/:id", auth, deleteApartment);

module.exports = router;
