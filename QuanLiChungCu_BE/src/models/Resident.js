const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  idNo: { type: String },
  dob: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Resident", residentSchema);
