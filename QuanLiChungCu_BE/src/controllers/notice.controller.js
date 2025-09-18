const Notice = require("../models/Notice");

exports.createNotice = async (req, res) => {
  const notice = new Notice(req.body);
  await notice.save();
  res.status(201).json(notice);
};

exports.getNotices = async (req, res) => {
  const notices = await Notice.find().populate("createdBy");
  res.json(notices);
};

exports.getNotice = async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate("createdBy");
  if (!notice) return res.status(404).json({ message: "Not found" });
  res.json(notice);
};

exports.updateNotice = async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(notice);
};

exports.deleteNotice = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
