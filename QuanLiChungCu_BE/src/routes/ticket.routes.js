const express = require("express");
const { createTicket, getTickets, getTicket, updateTicket, deleteTicket } = require("../controllers/ticket.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, createTicket);
router.get("/", auth, getTickets);
router.get("/:id", auth, getTicket);
router.put("/:id", auth, updateTicket);
router.delete("/:id", auth, deleteTicket);

module.exports = router;
