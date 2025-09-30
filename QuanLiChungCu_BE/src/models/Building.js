const mongoose = require("mongoose");

// Định nghĩa Schema cho model Tòa nhà (Building)
const buildingSchema = new mongoose.Schema({
  // Tên của tòa nhà, ví dụ: "Tòa A", "Tòa B"
  name: {
    type: String,
    required: [true, 'Tên tòa nhà là bắt buộc'],
    unique: true,
    trim: true
  },

  // Địa chỉ của tòa nhà
  address: {
    type: String,
    required: [true, 'Địa chỉ là bắt buộc'],
    trim: true
  },

  // Tổng số tầng của tòa nhà
  floors: {
    type: Number,
    required: [true, 'Số tầng là bắt buộc'],
    min: [1, 'Số tầng phải là một số dương']
  }
}, {
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true
});

// Tạo và xuất model Building từ schema đã định nghĩa
module.exports = mongoose.model("Building", buildingSchema);