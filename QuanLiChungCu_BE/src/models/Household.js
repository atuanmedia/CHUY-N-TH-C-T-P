const mongoose = require("mongoose");

const householdSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", required: true },
  members: [{
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
    relation: String,
    isPrimary: { type: Boolean, default: false }
  }],
  startDate: Date,
  endDate: Date,
  note: String
}, { timestamps: true });

module.exports = mongoose.model("Household", householdSchema);
