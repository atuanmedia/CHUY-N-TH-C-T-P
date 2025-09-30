const mongoose = require("mongoose");

// Định nghĩa Schema cho model Thông báo (Notice)
const noticeSchema = new mongoose.Schema({
  // Tiêu đề của thông báo.
  title: { 
    type: String, 
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true
  },
  
  // Nội dung chi tiết của thông báo.
  content: { 
    type: String,
    required: [true, 'Nội dung là bắt buộc']
  },
  
  // Phạm vi của thông báo: 'all' (toàn bộ), 'building' (theo tòa nhà), 'apartment' (theo căn hộ).
  audienceScope: { 
    type: String, 
    enum: ["all", "building", "apartment"], 
    default: "all" 
  },
  
  // Ngày đăng thông báo.
  publishAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Người tạo thông báo. Tham chiếu đến model 'User'.
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: [true, 'Người tạo là bắt buộc']
  }
}, { 
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true 
});

// Tạo và xuất model Notice từ schema đã định nghĩa
module.exports = mongoose.model("Notice", noticeSchema);