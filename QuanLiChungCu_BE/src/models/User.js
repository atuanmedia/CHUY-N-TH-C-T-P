const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
