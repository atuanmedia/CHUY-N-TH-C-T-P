const mongoose = require("mongoose");

// Định nghĩa Schema cho model Thanh toán (Payment)
const paymentSchema = new mongoose.Schema({
  // Hóa đơn được thanh toán. Tham chiếu đến model 'Invoice'.
  invoice: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Invoice", 
    required: [true, 'ID hóa đơn là bắt buộc'] 
  },
  
  // Số tiền đã thanh toán.
  amount: { 
    type: Number, 
    required: [true, 'Số tiền thanh toán là bắt buộc'] 
  },
  
  // Phương thức thanh toán: 'cash' (tiền mặt), 'bank' (chuyển khoản), 'online' (trực tuyến).
  method: { 
    type: String, 
    enum: ["cash", "bank", "online"], 
    default: "cash" 
  },
  
  // Ngày thực hiện thanh toán.
  paidAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Mã tham chiếu của giao dịch (ví dụ: mã giao dịch ngân hàng).
  refNo: { 
    type: String,
    trim: true
  }
}, { 
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true 
});

// Tạo và xuất model Payment từ schema đã định nghĩa
module.exports = mongoose.model("Payment", paymentSchema);