// Import model AuditLog
const AuditLog = require("../models/AuditLog");

/**
 * @route   GET /api/audit-logs
 * @desc    Lấy danh sách nhật ký hệ thống (có phân trang)
 * @access  Private (Yêu cầu quyền Admin)
 */
exports.getLogs = async (req, res) => {
  try {
    // Lấy các tham số phân trang từ query string, với giá trị mặc định
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Mặc định 20 logs mỗi trang
    const skip = (page - 1) * limit;

    // Tạo query để lấy logs, populate thông tin người dùng (user) và sắp xếp theo thời gian mới nhất
    const logsQuery = AuditLog.find()
      .populate("user", "name email") // Chỉ lấy tên và email của user
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Lấy tổng số lượng logs để tính toán tổng số trang
    const totalLogs = await AuditLog.countDocuments();
    const totalPages = Math.ceil(totalLogs / limit);

    // Thực thi query để lấy logs cho trang hiện tại
    const logs = await logsQuery;

    // Trả về dữ liệu logs cùng với thông tin phân trang
    res.json({
      logs,
      currentPage: page,
      totalPages,
      totalLogs,
    });
  } catch (err) {
    // Ghi lại lỗi và trả về thông báo lỗi cho client
    console.error("Lỗi khi lấy nhật ký hệ thống:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};