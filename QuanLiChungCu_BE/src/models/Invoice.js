const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", required: true },
  periodMonth: { type: Number, required: true },
  periodYear: { type: Number, required: true },
  total: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ["unpaid", "paid", "overdue"], default: "unpaid" },
  issuedAt: { type: Date, default: Date.now },
  dueAt: { type: Date },
  items: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    qty: Number,
    unitPrice: Number,
    amount: Number,
    meta: Object
  }]
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
