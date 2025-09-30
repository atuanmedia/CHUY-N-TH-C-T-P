const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Resident = require("../models/Resident");

// Hàm tiện ích để tạo JWT token
const generateToken = (id, isResident = false) => {
  return jwt.sign({ id, isResident }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token có hiệu lực trong 7 ngày
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký một tài khoản người dùng mới (Admin/Manager)
 * @access  Private (Thường chỉ dành cho Admin để tạo tài khoản nhân viên)
 */
exports.register = async (req, res) => {
  try {
    // Dữ liệu từ body request
    const { name, email, password, roles } = req.body;

    // Tạo người dùng mới. Mật khẩu sẽ được tự động mã hóa bởi middleware trong User model.
    const user = new User({ name, email, password, roles });
    await user.save();

    // Không trả về mật khẩu trong response
    user.password = undefined;

    res.status(201).json({ message: "Đăng ký người dùng thành công", user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Lỗi xác thực dữ liệu", errors: err.errors });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email đã tồn tại', detail: err.keyValue });
    }
    console.error("Lỗi khi đăng ký:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập cho Người dùng (Admin/Manager)
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email và password có được cung cấp không
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng cung cấp email và mật khẩu" });
    }

    // Tìm người dùng bằng email và lấy cả trường password
    const user = await User.findOne({ email }).select("+password");

    // Kiểm tra người dùng có tồn tại và mật khẩu có khớp không
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // Tạo token
    const token = generateToken(user._id, false);

    // Không trả về mật khẩu
    user.password = undefined;

    res.json({ token, user });
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   POST /api/auth/login-resident
 * @desc    Đăng nhập cho Cư dân
 * @access  Public
 */
exports.loginResident = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng cung cấp email và mật khẩu" });
    }

    // Tìm cư dân bằng email và lấy cả trường password
    const resident = await Resident.findOne({ email }).select("+password");

    // Kiểm tra cư dân có tồn tại và mật khẩu có khớp không
    if (!resident || !(await resident.matchPassword(password))) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    // Tạo token với cờ isResident = true
    const token = generateToken(resident._id, true);

    // Không trả về mật khẩu
    resident.password = undefined;

    res.json({ token, user: resident });
  } catch (err) {
    console.error("Lỗi khi đăng nhập cư dân:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin người dùng/cư dân đang đăng nhập
 * @access  Private
 */
exports.getMe = async (req, res) => {
  // req.user được gán từ middleware `protect`
  if (!req.user) {
      return res.status(401).json({ message: "Không được phép" });
  }
  res.status(200).json({ user: req.user });
};