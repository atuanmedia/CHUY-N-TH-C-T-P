// Import các model cần thiết
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Resident = require("../models/Resident");

/**
 * @route   GET /api/invoices
 * @desc    Lấy danh sách hóa đơn (có phân trang và tìm kiếm)
 * @access  Private
 */
exports.getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const invoices = await Invoice.find(query)
      .populate("apartment", "code") // Lấy mã căn hộ
      .populate("items.service", "name") // Lấy tên dịch vụ
      .sort({ issuedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalInvoices = await Invoice.countDocuments(query);
    const totalPages = Math.ceil(totalInvoices / limit);

    res.json({
      invoices,
      currentPage: page,
      totalPages,
      totalInvoices,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   POST /api/invoices
 * @desc    Tạo một hóa đơn mới
 * @access  Private (Admin/Manager)
 */
exports.createInvoice = async (req, res) => {
  try {
    // TODO: Thêm logic tự động tính tổng tiền (total) từ các mục (items)
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Lỗi xác thực dữ liệu", errors: err.errors });
    }
    console.error("Lỗi khi tạo hóa đơn:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   GET /api/invoices/:id
 * @desc    Lấy thông tin chi tiết một hóa đơn
 * @access  Private
 */
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("apartment", "code floor area") // Lấy thêm thông tin căn hộ
      .populate("items.service", "name unit"); // Lấy tên và đơn vị dịch vụ

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // Lấy các thanh toán liên quan đến hóa đơn này
    const payments = await Payment.find({ invoice: req.params.id }).sort({ paidAt: -1 });

    res.json({ invoice, payments });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết hóa đơn:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   PUT /api/invoices/:id
 * @desc    Cập nhật một hóa đơn
 * @access  Private (Admin/Manager)
 */
exports.updateInvoice = async (req, res) => {
  try {
    const payload = { ...req.body };

    // Chuyển đổi kiểu dữ liệu an toàn
    if (payload.periodMonth !== undefined) payload.periodMonth = Number(payload.periodMonth);
    if (payload.periodYear !== undefined) payload.periodYear = Number(payload.periodYear);
    if (payload.total !== undefined) payload.total = Number(payload.total);
    if (payload.apartment && !mongoose.Types.ObjectId.isValid(payload.apartment)) {
      return res.status(400).json({ message: 'ID căn hộ không hợp lệ' });
    }

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    res.json(invoice);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Lỗi xác thực dữ liệu", errors: err.errors });
    }
    console.error("Lỗi khi cập nhật hóa đơn:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   DELETE /api/invoices/:id
 * @desc    Xóa một hóa đơn
 * @access  Private (Admin/Manager)
 */
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // Không cho xóa hóa đơn đã có thanh toán
    const paymentCount = await Payment.countDocuments({ invoice: req.params.id });
    if (paymentCount > 0) {
      return res.status(400).json({ message: "Không thể xóa hóa đơn đã có thanh toán." });
    }

    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa hóa đơn thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa hóa đơn:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   POST /api/invoices/:id/payments
 * @desc    Thêm một thanh toán cho hóa đơn
 * @access  Private (Admin/Manager)
 */
exports.addPayment = async (req, res) => {
  try {
    const { id: invoiceId } = req.params;
    const { amount, method, paidAt, refNo } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // Tạo và lưu thanh toán mới
    const payment = new Payment({
      invoice: invoiceId,
      amount,
      method,
      paidAt,
      refNo
    });
    await payment.save();

    // Cập nhật lại trạng thái hóa đơn dựa trên tổng số tiền đã thanh toán
    const payments = await Payment.find({ invoice: invoiceId });
    const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);

    if (totalPaid >= invoice.total) {
      invoice.status = "paid";
    } else if (totalPaid > 0) {
      invoice.status = "partially_paid"; // Cần đảm bảo trạng thái này có trong enum của Invoice model
    } 
    
    await invoice.save();

    res.status(201).json({ message: "Ghi nhận thanh toán thành công", payment });
  } catch (err) {
     if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Lỗi xác thực dữ liệu thanh toán", errors: err.errors });
    }
    console.error("Lỗi khi thêm thanh toán:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

/**
 * @route   GET /api/invoices/resident/:residentId
 * @desc    Lấy danh sách hóa đơn của một cư dân
 * @access  Private (Cư dân tự xem hoặc Admin/Manager xem)
 */
exports.getInvoicesByResident = async (req, res) => {
  try {
    const { residentId } = req.params;

    // Tìm cư dân để lấy thông tin căn hộ của họ
    const resident = await Resident.findById(residentId);
    if (!resident) {
      return res.status(404).json({ message: "Không tìm thấy cư dân" });
    }

    // Tìm tất cả hóa đơn thuộc về căn hộ của cư dân đó
    const invoices = await Invoice.find({ apartment: resident.apartment })
      .populate("apartment", "code")
      .populate("items.service", "name")
      .sort({ issuedAt: -1 });

    res.json(invoices);
  } catch (err) {
    console.error("Lỗi khi lấy hóa đơn của cư dân:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};