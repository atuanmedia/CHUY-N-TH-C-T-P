const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Thư viện để mã hóa mật khẩu

// Định nghĩa Schema cho model Cư dân (Resident)
const residentSchema = new mongoose.Schema({
  // Họ và tên đầy đủ của cư dân
  fullName: {
    type: String,
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true
  },

  // Email của cư dân, dùng để đăng nhập và liên lạc
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true, // Luôn chuyển email về chữ thường để đảm bảo tính duy nhất
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập một địa chỉ email hợp lệ']
  },

  // Số điện thoại của cư dân
  phone: {
    type: String,
    trim: true,
    // Tùy chọn: có thể thêm validation cho số điện thoại Việt Nam
    // match: [/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Vui lòng nhập số điện thoại hợp lệ']
  },

  // Căn hộ mà cư dân này đang ở. Tham chiếu đến model 'Apartment'.
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: [true, 'ID căn hộ là bắt buộc']
  },

  // Mật khẩu để cư dân đăng nhập vào hệ thống
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    select: false // Không trả về mật khẩu khi truy vấn thông tin cư dân
  }
}, {
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true
});

// Middleware: Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
residentSchema.pre('save', async function(next) {
  // Chỉ mã hóa lại mật khẩu nếu nó đã được thay đổi (hoặc là mật khẩu mới)
  if (!this.isModified('password')) {
    next();
  }

  // Tạo salt và hash mật khẩu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Phương thức để so sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong CSDL
residentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Tạo và xuất model Resident từ schema đã định nghĩa
module.exports = mongoose.model("Resident", residentSchema);