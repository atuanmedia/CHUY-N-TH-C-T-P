const mongoose = require("mongoose");

// Định nghĩa Schema cho model Yêu cầu/Phản ánh (Ticket)
const ticketSchema = new mongoose.Schema({
  // Căn hộ gửi yêu cầu. Tham chiếu đến model 'Apartment'.
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: [true, 'ID căn hộ là bắt buộc']
  },

  // Tiêu đề của yêu cầu
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true
  },

  // Nội dung chi tiết của yêu cầu
  content: {
    type: String,
    required: [true, 'Nội dung là bắt buộc']
  },

  // Phân loại yêu cầu
  category: {
    type: String,
    enum: {
      values: ["maintenance", "complaint", "other"], // bảo trì, phàn nàn, khác
      message: 'Phân loại không hợp lệ'
    },
    default: "other"
  },

  // Mức độ ưu tiên của yêu cầu
  priority: {
    type: String,
    enum: {
      values: ["low", "medium", "high"], // thấp, trung bình, cao
      message: 'Mức độ ưu tiên không hợp lệ'
    },
    default: "medium"
  },

  // Trạng thái của yêu cầu
  status: {
    type: String,
    enum: {
      values: ["open", "in_progress", "resolved", "closed"], // mới, đang xử lý, đã giải quyết, đã đóng
      message: 'Trạng thái không hợp lệ'
    },
    default: "open"
  },

  // Nhân viên được giao xử lý yêu cầu. Tham chiếu đến model 'User'.
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true
});

// Tạo và xuất model Ticket từ schema đã định nghĩa
module.exports = mongoose.model("Ticket", ticketSchema);