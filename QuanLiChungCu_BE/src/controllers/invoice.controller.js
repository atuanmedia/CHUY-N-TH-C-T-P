const Invoice = require("../models/Invoice");

exports.createInvoice = async (req, res) => {
  const invoice = new Invoice(req.body);
  await invoice.save();
  res.status(201).json(invoice);
};

exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find().populate("apartment");
  res.json(invoices);
};

exports.getInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate("apartment");
  if (!invoice) return res.status(404).json({ message: "Not found" });
  res.json(invoice);
};

exports.updateInvoice = async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(invoice);
};

exports.deleteInvoice = async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
