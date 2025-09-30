const mongoose = require("mongoose");

// Định nghĩa Schema cho model Ghi log kiểm toán (Audit Log)
const auditLogSchema = new mongoose.Schema({
  // Người dùng thực hiện hành động. Tham chiếu đến model 'User'.
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: [true, 'ID người dùng là bắt buộc']
  },
  
  // Hành động đã được thực hiện. Ví dụ: 'create', 'update', 'delete'.
  action: { 
    type: String, 
    required: [true, 'Hành động là bắt buộc'],
    enum: ['create', 'update', 'delete', 'login', 'logout'] // Giới hạn các hành động có thể ghi lại
  },
  
  // Loại đối tượng bị ảnh hưởng bởi hành động. Ví dụ: "Apartment", "Invoice".
  refType: { 
    type: String, 
    required: [true, 'Loại tham chiếu là bắt buộc']
  },
  
  // ID của đối tượng bị ảnh hưởng.
  refId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'ID tham chiếu là bắt buộc']
  },
  
  // Dữ liệu hoặc thông tin chi tiết về sự thay đổi (payload).
  // Lưu lại trạng thái trước và sau khi thay đổi để dễ dàng truy vết.
  payload: { 
    type: Object 
  },
  
  // Thời điểm hành động được ghi lại. Mặc định là thời điểm hiện tại.
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Tạo và xuất model AuditLog từ schema đã định nghĩa
module.exports = mongoose.model("AuditLog", auditLogSchema);