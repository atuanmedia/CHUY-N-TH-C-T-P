const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  audienceScope: { type: String, enum: ["all", "building", "apartment"], default: "all" },
  publishAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
