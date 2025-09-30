// Import các model cần thiết
const Apartment = require("../models/Apartment");
const Resident = require("../models/Resident");
const Ticket = require("../models/Ticket");
const Invoice = require("../models/Invoice");

/**
 * @route   POST /api/apartments
 * @desc    Tạo một căn hộ mới
 * @access  Private (Yêu cầu quyền Admin/Manager)
 */
exports.createApartment = async (req, res) => {
  try {
    const payload = { ...req.body };

    // Chuyển đổi các trường số một cách an toàn
    if (payload.floor !== undefined && payload.floor !== null && payload.floor !== '') {
      const n = Number(payload.floor);
      if (!Number.isFinite(n)) return res.status(400).json({ message: 'Giá trị tầng không hợp lệ' });
      payload.floor = n;
    }
    if (payload.area !== undefined && payload.area !== null && payload.area !== '') {
      const n2 = Number(payload.area);
      if (!Number.isFinite(n2)) return res.status(400).json({ message: 'Giá trị diện tích không hợp lệ' });
      payload.area = n2;
    }

    // Tạo một đối tượng căn hộ mới từ payload
    const apartment = new Apartment(payload);
    // Lưu vào cơ sở dữ liệu
    await apartment.save();
    // Trả về thông tin căn hộ vừa tạo với status 201 (Created)
    res.status(201).json(apartment);
  } catch (err) {
    // Xử lý lỗi validation từ Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Lỗi xác thực dữ liệu", errors: err.errors });
    }
    // Xử lý lỗi trùng lặp (unique key)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Mã căn hộ đã tồn tại', detail: err.keyValue });
    }
    // Ghi lại lỗi không xác định ra console và trả về lỗi 500
    console.error('Lỗi khi tạo căn hộ:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

/**
 * @route   GET /api/apartments
 * @desc    Lấy danh sách tất cả căn hộ
 * @access  Private
 */
exports.getApartments = async (req, res) => {
  try {
    // Tìm tất cả căn hộ và populate thông tin tòa nhà
    const apartments = await Apartment.find().populate('building');
    
    // Với mỗi căn hộ, tính toán thêm các thông tin liên quan
    const results = await Promise.all(apartments.map(async (a) => {
      // Đếm số lượng cư dân trong căn hộ
      const residentsCount = await Resident.countDocuments({ apartment: a._id });
      // Đếm số lượng yêu cầu/phản ánh đang mở hoặc đang xử lý
      const openTicketsCount = await Ticket.countDocuments({ apartment: a._id, status: { $in: ['open', 'in_progress'] } });
      // Đếm số lượng hóa đơn chưa thanh toán hoặc quá hạn
      const unpaidInvoicesCount = await Invoice.countDocuments({ apartment: a._id, status: { $in: ['unpaid', 'overdue'] } });
      
      return {
        ...a.toObject(), // Chuyển Mongoose document thành object thường
        residentsCount,
        openTicketsCount,
        unpaidInvoicesCount
      };
    }));
    
    // Trả về danh sách kết quả
    res.json(results);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách căn hộ:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

/**
 * @route   GET /api/apartments/:id
 * @desc    Lấy thông tin chi tiết một căn hộ
 * @access  Private
 */
exports.getApartment = async (req, res) => {
  try {
    // Tìm căn hộ bằng ID và populate thông tin tòa nhà
    const apartment = await Apartment.findById(req.params.id).populate('building');
    
    // Nếu không tìm thấy, trả về lỗi 404
    if (!apartment) {
      return res.status(404).json({ message: "Không tìm thấy căn hộ" });
    }
    
    // Tìm danh sách cư dân thuộc căn hộ này
    const residents = await Resident.find({ apartment: apartment._id }).select('fullName phone email');
    // Đếm số lượng yêu cầu đang mở
    const openTicketsCount = await Ticket.countDocuments({ apartment: apartment._id, status: { $in: ['open', 'in_progress'] } });
    // Đếm số lượng hóa đơn chưa thanh toán
    const unpaidInvoicesCount = await Invoice.countDocuments({ apartment: apartment._id, status: { $in: ['unpaid', 'overdue'] } });
    
    // Trả về thông tin chi tiết của căn hộ cùng với các dữ liệu liên quan
    res.json({ 
      ...apartment.toObject(), 
      residents, 
      openTicketsCount, 
      unpaidInvoicesCount 
    });
  } catch (err) {
    console.error('Lỗi khi lấy thông tin căn hộ:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

/**
 * @route   PUT /api/apartments/:id
 * @desc    Cập nhật thông tin một căn hộ
 * @access  Private (Yêu cầu quyền Admin/Manager)
 */
exports.updateApartment = async (req, res) => {
  try {
    const payload = { ...req.body };

    // Chuyển đổi các trường số một cách an toàn
    if (payload.floor !== undefined && payload.floor !== null && payload.floor !== '') {
      const n = Number(payload.floor);
      if (!Number.isFinite(n)) return res.status(400).json({ message: 'Giá trị tầng không hợp lệ' });
      payload.floor = n;
    }
    if (payload.area !== undefined && payload.area !== null && payload.area !== '') {
      const n2 = Number(payload.area);
      if (!Number.isFinite(n2)) return res.status(400).json({ message: 'Giá trị diện tích không hợp lệ' });
      payload.area = n2;
    }

    // Tìm và cập nhật căn hộ bằng ID
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, payload, { 
      new: true, // Trả về document đã được cập nhật
      runValidators: true // Chạy lại các trình xác thực (validator) của schema
    });

    // Nếu không tìm thấy căn hộ để cập nhật
    if (!apartment) {
        return res.status(404).json({ message: 'Không tìm thấy căn hộ' });
    }

    // Trả về thông tin căn hộ đã được cập nhật
    res.json(apartment);
  } catch (err) {
    // Xử lý lỗi validation
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Lỗi xác thực dữ liệu", errors: err.errors });
    }
    // Xử lý lỗi trùng lặp
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Mã căn hộ đã tồn tại', detail: err.keyValue });
    }
    console.error('Lỗi khi cập nhật căn hộ:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

/**
 * @route   DELETE /api/apartments/:id
 * @desc    Xóa một căn hộ
 * @access  Private (Yêu cầu quyền Admin/Manager)
 */
exports.deleteApartment = async (req, res) => {
  try {
    // Tìm và xóa căn hộ bằng ID
    const apartment = await Apartment.findByIdAndDelete(req.params.id);

    // Nếu không tìm thấy căn hộ để xóa
    if (!apartment) {
        return res.status(404).json({ message: 'Không tìm thấy căn hộ' });
    }

    // TODO: Cân nhắc xử lý các dữ liệu liên quan khi xóa căn hộ
    // Ví dụ: Cập nhật lại thông tin cư dân, hóa đơn, ...

    // Trả về thông báo thành công
    res.json({ message: "Đã xóa căn hộ thành công" });
  } catch (err) {
    console.error('Lỗi khi xóa căn hộ:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};