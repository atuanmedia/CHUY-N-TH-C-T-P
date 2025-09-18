const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["cash", "bank", "online"], default: "cash" },
  paidAt: { type: Date, default: Date.now },
  refNo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
