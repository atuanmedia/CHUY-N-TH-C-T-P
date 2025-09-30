const mongoose = require("mongoose");

// Định nghĩa Schema cho model Vai trò (Role)
const roleSchema = new mongoose.Schema({
  // Tên của vai trò, ví dụ: "admin", "manager", "resident"
  name: {
    type: String,
    required: [true, 'Tên vai trò là bắt buộc'],
    unique: true,
    trim: true,
    enum: { // Giới hạn các giá trị có thể chấp nhận cho vai trò
      values: ['admin', 'manager', 'resident'],
      message: '{VALUE} không phải là một vai trò hợp lệ'
    }
  }
}, {
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true
});

// Tạo và xuất model Role từ schema đã định nghĩa
module.exports = mongoose.model("Role", roleSchema);