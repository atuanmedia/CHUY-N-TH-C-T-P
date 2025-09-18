const express = require("express");
const { createNotice, getNotices, getNotice, updateNotice, deleteNotice } = require("../controllers/notice.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, createNotice);
router.get("/", auth, getNotices);
router.get("/:id", auth, getNotice);
router.put("/:id", auth, updateNotice);
router.delete("/:id", auth, deleteNotice);

module.exports = router;
