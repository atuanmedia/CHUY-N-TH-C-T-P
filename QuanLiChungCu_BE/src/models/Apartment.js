const mongoose = require("mongoose");

// Định nghĩa Schema (lược đồ) cho model Căn hộ
const apartmentSchema = new mongoose.Schema({
  // Mã căn hộ, là một chuỗi và là trường bắt buộc. Ví dụ: "A101"
  code: { 
    type: String, 
    required: [true, 'Mã căn hộ là bắt buộc'],
    unique: true, // Đảm bảo mỗi căn hộ có một mã duy nhất
    trim: true // Loại bỏ khoảng trắng thừa ở đầu và cuối
  },
  
  // Số tầng của căn hộ
  floor: { 
    type: Number,
    required: [true, 'Số tầng là bắt buộc']
  },
  
  // Diện tích của căn hộ, tính bằng mét vuông (m2)
  area: { 
    type: Number,
    required: [true, 'Diện tích là bắt buộc']
  },
  
  // Trạng thái của căn hộ. Mặc định là "còn trống".
  // Các giá trị có thể là: 'vacant' (còn trống), 'occupied' (đã có người ở), 'maintenance' (đang bảo trì)
  status: { 
    type: String, 
    enum: ['vacant', 'occupied', 'maintenance'],
    default: "vacant" 
  },
  
  // Tên tòa nhà (ví dụ: "Tòa A", "Tòa B")
  // Có thể không cần thiết nếu đã có buildingRef
  building: { 
    type: String,
    trim: true
  },
  
  /*
  // Tham chiếu đến model Building (nếu bạn có một model riêng cho tòa nhà)
  // Hiện tại đang được comment ra, có thể kích hoạt khi cần
  buildingRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building"
  }
  */
}, {
  // Tự động thêm hai trường: createdAt (thời điểm tạo) và updatedAt (thời điểm cập nhật)
  timestamps: true 
});

// Tạo và xuất model Căn hộ từ schema đã định nghĩa
module.exports = mongoose.model("Apartment", apartmentSchema);