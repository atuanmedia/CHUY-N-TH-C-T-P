const mongoose = require("mongoose");

// Định nghĩa Schema cho model Dịch vụ (Service)
const serviceSchema = new mongoose.Schema({
  // Tên của dịch vụ, ví dụ: "Phí quản lý", "Tiền điện", "Tiền nước"
  name: {
    type: String,
    required: [true, 'Tên dịch vụ là bắt buộc'],
    unique: true,
    trim: true
  },

  // Đơn vị tính của dịch vụ, ví dụ: "m2", "kWh", "m3", "người", "phòng"
  unit: {
    type: String,
    required: [true, 'Đơn vị tính là bắt buộc'],
    trim: true
  },

  // Loại hình tính giá: "fixed" (cố định) hoặc "variable" (biến đổi)
  pricingType: {
    type: String,
    enum: {
        values: ["fixed", "variable"],
        message: 'Loại hình tính giá phải là "fixed" hoặc "variable"'
    },
    default: "fixed"
  },

  // Dịch vụ này có phải là dịch vụ định kỳ hàng tháng không?
  isRecurring: {
    type: Boolean,
    default: true
  },

  // Mảng chứa các quy tắc tính phí. Cho phép thay đổi công thức theo thời gian.
  rules: [{
    // Công thức hoặc giá trị để tính phí. 
    // Ví dụ: "10000" cho phí cố định, hoặc một công thức dạng chuỗi/JSON cho phí biến đổi.
    formula: {
        type: String,
        required: [true, 'Công thức tính phí là bắt buộc']
    },
    // Ngày bắt đầu áp dụng quy tắc này
    effectiveFrom: {
        type: Date,
        default: Date.now
    },
    // Ngày kết thúc áp dụng (nếu null, quy tắc có hiệu lực vô thời hạn)
    effectiveTo: {
        type: Date
    }
  }]
}, {
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true
});

// Tạo và xuất model Service từ schema đã định nghĩa
module.exports = mongoose.model("Service", serviceSchema);