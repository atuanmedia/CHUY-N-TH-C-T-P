const Resident = require("../models/Resident");

exports.createResident = async (req, res) => {
  const resident = new Resident(req.body);
  await resident.save();
  res.status(201).json(resident);
};

exports.getResidents = async (req, res) => {
  const residents = await Resident.find();
  res.json(residents);
};

exports.getResident = async (req, res) => {
  const resident = await Resident.findById(req.params.id);
  if (!resident) return res.status(404).json({ message: "Not found" });
  res.json(resident);
};

exports.updateResident = async (req, res) => {
  const resident = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(resident);
};

exports.deleteResident = async (req, res) => {
  await Resident.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
