const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", required: true },
  title: { type: String, required: true },
  content: { type: String },
  category: { type: String, enum: ["maintenance", "complaint", "other"], default: "other" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
