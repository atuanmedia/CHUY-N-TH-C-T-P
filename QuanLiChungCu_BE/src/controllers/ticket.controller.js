const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const Resident = require("../models/Resident");

/**
 * @route   POST /api/tickets
 * @desc    Tạo một yêu cầu/phiếu ghi mới
 * @access  Private (Resident)
 */
exports.createTicket = async (req, res) => {
  try {
    // Lấy ID của cư dân đã đăng nhập từ middleware xác thực (req.user)
    // Middleware `protect` sẽ giải mã token và gán thông tin user vào req.user
    const residentId = req.user.id;

    // Tìm thông tin cư dân để lấy ID căn hộ của họ
    const resident = await Resident.findById(residentId);
    if (!resident) {
      // Nếu không tìm thấy cư dân, trả về lỗi 404
      return res.status(404).json({ message: "Không tìm thấy thông tin cư dân." });
    }

    // Gán ID căn hộ vào body của request để tạo ticket
    req.body.apartment = resident.apartment;

    // Tạo một ticket mới với dữ liệu từ request body (đã bao gồm apartment)
    const ticket = new Ticket(req.body);
    await ticket.save();

    // Trả về thông báo thành công và dữ liệu của ticket vừa tạo
    res.status(201).json({ message: "Tạo yêu cầu thành công", ticket });
  } catch (err) {
    // Xử lý lỗi xác thực dữ liệu từ Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Lỗi xác thực dữ liệu", errors: err.errors });
    }
    // Ghi lại lỗi ra console và trả về lỗi 500 cho các lỗi khác
    console.error("Lỗi khi tạo yêu cầu:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   GET /api/tickets
 * @desc    Lấy danh sách tất cả yêu cầu (có phân trang, cho Admin/Manager)
 * @access  Private (Admin/Manager)
 */
exports.getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query)
      .populate("apartment", "code")
      .populate("assignee", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTickets = await Ticket.countDocuments(query);
    const totalPages = Math.ceil(totalTickets / limit);

    res.json({
        tickets,
        currentPage: page,
        totalPages,
        totalTickets,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách yêu cầu:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   GET /api/tickets/resident/:residentId
 * @desc    Lấy danh sách yêu cầu của một cư dân cụ thể
 * @access  Private (Resident xem của chính mình, hoặc Admin/Manager)
 */
exports.getTicketsByResident = async (req, res) => {
  try {
    const { residentId } = req.params;

    // Kiểm tra xem residentId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(residentId)) {
        return res.status(400).json({ message: "ID Cư dân không hợp lệ" });
    }

    // Tìm cư dân để lấy ID căn hộ của họ
    const resident = await Resident.findById(residentId);
    if (!resident) {
      return res.status(404).json({ message: "Không tìm thấy cư dân" });
    }

    // Lấy tất cả các ticket thuộc về căn hộ của cư dân đó
    const tickets = await Ticket.find({ apartment: resident.apartment })
      .populate("apartment", "code")
      .populate("assignee", "name")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error("Lỗi khi lấy yêu cầu của cư dân:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


/**
 * @route   GET /api/tickets/:id
 * @desc    Lấy thông tin chi tiết một yêu cầu
 * @access  Private
 */
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
        .populate("apartment", "code owner")
        .populate("assignee", "name email");

    if (!ticket) {
        return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }
    res.json(ticket);
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết yêu cầu:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   PUT /api/tickets/:id
 * @desc    Cập nhật một yêu cầu (ví dụ: thay đổi trạng thái, người xử lý)
 * @access  Private (Admin/Manager)
 */
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!ticket) {
        return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }

    res.json({ message: "Cập nhật yêu cầu thành công", ticket });
  } catch (err) {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Lỗi xác thực dữ liệu", errors: err.errors });
    }
    console.error("Lỗi khi cập nhật yêu cầu:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   DELETE /api/tickets/:id
 * @desc    Xóa một yêu cầu
 * @access  Private (Admin/Manager)
 */
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    }

    // Ví dụ: không cho xóa nếu ticket đã ở trạng thái "completed"
    if (ticket.status === 'completed') {
        return res.status(400).json({ message: "Không thể xóa yêu cầu đã hoàn thành." });
    }

    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa yêu cầu thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa yêu cầu:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};