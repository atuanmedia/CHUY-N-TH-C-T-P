const Service = require("../models/Service");

exports.createService = async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.status(201).json(service);
};

exports.getServices = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};

exports.getService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Not found" });
  res.json(service);
};

exports.updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(service);
};

exports.deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
