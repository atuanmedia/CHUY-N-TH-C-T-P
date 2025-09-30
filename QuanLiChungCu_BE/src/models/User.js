const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Thư viện để mã hóa mật khẩu

// Định nghĩa Schema cho model Người dùng (User) - Dành cho ban quản lý, nhân viên
const userSchema = new mongoose.Schema({
  // Họ và tên của người dùng
  name: {
    type: String,
    required: [true, 'Họ và tên là bắt buộc'],
    trim: true
  },

  // Email để đăng nhập và liên lạc
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true, // Luôn chuyển email về chữ thường
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Vui lòng nhập một địa chỉ email hợp lệ']
  },

  // Mật khẩu đăng nhập
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    select: false // Không trả về mật khẩu khi truy vấn
  },

  // Trạng thái tài khoản: "active" (hoạt động) hoặc "inactive" (không hoạt động)
  status: {
    type: String,
    enum: {
        values: ["active", "inactive"],
        message: 'Trạng thái không hợp lệ'
    },
    default: "active"
  },

  // Mảng chứa các vai trò của người dùng. Tham chiếu đến model 'Role'.
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  }]
}, {
  // Tự động thêm hai trường: createdAt và updatedAt.
  timestamps: true
});

// Middleware: Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  // Chỉ mã hóa lại mật khẩu nếu nó đã được thay đổi (hoặc là mật khẩu mới)
  if (!this.isModified('password')) {
    return next();
  }

  // Tạo salt và hash mật khẩu
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Phương thức để so sánh mật khẩu nhập vào với mật khẩu đã mã hóa
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tạo và xuất model User từ schema đã định nghĩa
module.exports = mongoose.model("User", userSchema);