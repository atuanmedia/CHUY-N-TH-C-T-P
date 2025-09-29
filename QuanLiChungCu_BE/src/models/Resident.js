const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" }, // 🔑 Liên kết tới căn hộ
}, { timestamps: true });

module.exports = mongoose.model("Resident", residentSchema);