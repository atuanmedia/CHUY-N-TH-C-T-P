const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  building: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  floor: { type: Number, required: true },
  area: { type: Number },
  status: { type: String, enum: ["occupied", "vacant"], default: "vacant" }
}, { timestamps: true });

module.exports = mongoose.model("Apartment", apartmentSchema);
