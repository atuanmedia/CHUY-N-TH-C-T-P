const AuditLog = require("../models/AuditLog");

exports.getLogs = async (req, res) => {
  const logs = await AuditLog.find().populate("user").sort({ createdAt: -1 });
  res.json(logs);
};
