const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String }, // m2, kWh, người...
  pricingType: { type: String, enum: ["fixed", "variable"], default: "fixed" },
  isRecurring: { type: Boolean, default: true },
  rules: [{
    formula: String,       // công thức tính phí (JSON/string)
    effectiveFrom: Date,
    effectiveTo: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
