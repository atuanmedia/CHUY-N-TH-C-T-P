const mongoose = require("mongoose");

// Định nghĩa Schema cho model Hóa đơn (Invoice)
const invoiceSchema = new mongoose.Schema({
  // Căn hộ mà hóa đơn này thuộc về. Tham chiếu đến model 'Apartment'.
  apartment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Apartment", 
    required: [true, 'ID căn hộ là bắt buộc']
  },
  
  // Tháng của kỳ hóa đơn.
  periodMonth: { 
    type: Number, 
    required: [true, 'Tháng của kỳ hóa đơn là bắt buộc'],
    min: [1, 'Tháng phải từ 1 đến 12'],
    max: [12, 'Tháng phải từ 1 đến 12']
  },
  
  // Năm của kỳ hóa đơn.
  periodYear: { 
    type: Number, 
    required: [true, 'Năm của kỳ hóa đơn là bắt buộc']
  },
  
  // Tổng số tiền của hóa đơn.
  total: { 
    type: Number, 
    required: [true, 'Tổng tiền là bắt buộc'], 
    default: 0 
  },
  
  // Trạng thái của hóa đơn: 'unpaid' (chưa thanh toán), 'paid' (đã thanh toán), 'overdue' (quá hạn).
  status: { 
    type: String, 
    enum: ["unpaid", "paid", "overdue"], 
    default: "unpaid" 
  },
  
  // Ngày phát hành hóa đơn.
  issuedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Ngày hết hạn thanh toán.
  dueAt: { 
    type: Date 
  },
  
  // Danh sách các mục trong hóa đơn (ví dụ: tiền điện, tiền nước, phí quản lý).
  items: [{
    // Dịch vụ được tính phí. Tham chiếu đến model 'Service'.
    service: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Service" 
    },
    // Số lượng (ví dụ: số kWh điện, số m3 nước).
    qty: Number,
    // Đơn giá.
    unitPrice: Number,
    // Thành tiền cho mục này.
    amount: Number,
    // Thông tin bổ sung (metadata), ví dụ: chỉ số công tơ cũ và mới.
    meta: Object
  }]
}, { 
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true 
});

// Tạo và xuất model Invoice từ schema đã định nghĩa
module.exports = mongoose.model("Invoice", invoiceSchema);