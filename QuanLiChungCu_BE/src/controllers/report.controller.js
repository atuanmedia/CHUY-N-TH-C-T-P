const Invoice = require("../models/Invoice");

// Báo cáo doanh thu
exports.getRevenueReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    // Lọc hóa đơn theo tháng/năm
    const invoices = await Invoice.find({
      periodMonth: parseInt(month),
      periodYear: parseInt(year)
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalUnpaid = totalRevenue - totalPaid;

    res.json({
      month: parseInt(month),
      year: parseInt(year),
      totalRevenue,
      totalPaid,
      totalUnpaid
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Báo cáo Aging: hóa đơn quá hạn
exports.getAgingReport = async (req, res) => {
  try {
    const today = new Date();

    const invoices = await Invoice.find({ status: { $ne: "paid" }, apartment: { $ne: null } }).populate("apartment");

    const aging = invoices.map(inv => {
      const dueDate = new Date(inv.dueAt);
      const daysOverdue = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));

      return {
        apartment: inv.apartment?.code || "Unknown",
        month: inv.periodMonth,
        year: inv.periodYear,
        total: inv.total,
        status: inv.status,
        daysOverdue
      };
    });

    res.json(aging);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};