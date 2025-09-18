const Apartment = require("../models/Apartment");

exports.createApartment = async (req, res) => {
  const apartment = new Apartment(req.body);
  await apartment.save();
  res.status(201).json(apartment);
};

exports.getApartments = async (req, res) => {
  const apartments = await Apartment.find();
  res.json(apartments);
};

exports.getApartment = async (req, res) => {
  const apartment = await Apartment.findById(req.params.id);
  if (!apartment) return res.status(404).json({ message: "Not found" });
  res.json(apartment);
};

exports.updateApartment = async (req, res) => {
  const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(apartment);
};

exports.deleteApartment = async (req, res) => {
  await Apartment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
