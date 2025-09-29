const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
  const payment = new Payment(req.body);
  await payment.save();
  res.status(201).json(payment);
};

exports.getPayments = async (req, res) => {
  const payments = await Payment.find().populate("invoice");
  res.json(payments);
};

exports.getPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate("invoice");
  if (!payment) return res.status(404).json({ message: "Not found" });
  res.json(payment);
};

exports.updatePayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(payment);
};

exports.deletePayment = async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
exports.addPayment = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const { amount, method } = req.body;

    const payment = new Payment({
      invoice: invoiceId,
      amount,
      method,
      paidAt: new Date()
    });
    await payment.save();

    // cập nhật trạng thái hóa đơn
    await Invoice.findByIdAndUpdate(invoiceId, { status: "paid" });

    res.status(201).json({ message: "Payment recorded", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
