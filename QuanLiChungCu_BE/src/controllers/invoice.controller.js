const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
// Lấy danh sách hóa đơn
exports.getInvoices = async (req, res) => {
  try {
    // populate correct path: items.service
    const invoices = await Invoice.find().populate("apartment").populate("items.service");
    res.json(invoices);
  } catch (err) {
    console.error('getInvoices error:', err);
    res.status(500).json({ error: err.message });
  }
};
// Tạo hóa đơn
exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy 1 hóa đơn theo id
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("apartment").populate("items.serviceType");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.periodMonth !== undefined) payload.periodMonth = Number(payload.periodMonth);
    if (payload.periodYear !== undefined) payload.periodYear = Number(payload.periodYear);
    if (payload.total !== undefined && payload.total !== '') payload.total = Number(payload.total);

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    res.json(invoice);
  } catch (err) {
    console.error('updateInvoice error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error('deleteInvoice error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const { amount, method } = req.body;

    // kiểm tra invoice có tồn tại không
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const payment = new Payment({
      invoice: invoiceId,
      amount,
      method
    });
    await payment.save();

    // cập nhật trạng thái hóa đơn
    invoice.status = "paid";
    await invoice.save();

    res.status(201).json({ message: "Payment recorded", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
