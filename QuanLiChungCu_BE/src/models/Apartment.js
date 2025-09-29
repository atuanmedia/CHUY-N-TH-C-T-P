const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  code: { type: String, required: true }, // 👈 Mã căn hộ (ví dụ A101)
  floor: Number,
  area: Number,
  status: { type: String, default: "vacant" },
  building: String,
  buildingRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building"
  }
});

module.exports = mongoose.model("Apartment", apartmentSchema);
