const Apartment = require("../models/Apartment");
const Resident = require("../models/Resident");
const Ticket = require("../models/Ticket");
const Invoice = require("../models/Invoice");


exports.createApartment = async (req, res) => {
  try {
    // coerce numeric fields safely
    const payload = { ...req.body };
    if (payload.floor !== undefined && payload.floor !== null && payload.floor !== '') {
      const n = Number(payload.floor);
      if (!Number.isFinite(n)) return res.status(400).json({ message: 'Invalid floor value' });
      payload.floor = n;
    }
    if (payload.area !== undefined && payload.area !== null && payload.area !== '') {
      const n2 = Number(payload.area);
      if (!Number.isFinite(n2)) return res.status(400).json({ message: 'Invalid area value' });
      payload.area = n2;
    }

    const apartment = new Apartment(payload);
    await apartment.save();
    res.status(201).json(apartment);
  } catch (err) {
    // Validation error
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message, errors: err.errors });
    // Duplicate key
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate key', detail: err.keyValue });
    console.error('createApartment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find().populate('buildingRef');
    // for each apartment compute related counts
    const results = await Promise.all(apartments.map(async (a) => {
      const residentsCount = await Resident.countDocuments({ apartment: a._id });
      const openTicketsCount = await Ticket.countDocuments({ apartment: a._id, status: { $in: ['open', 'in_progress'] } });
      const unpaidInvoicesCount = await Invoice.countDocuments({ apartment: a._id, status: { $in: ['unpaid', 'overdue'] } });
      return {
        ...a.toObject(),
        residentsCount,
        openTicketsCount,
        unpaidInvoicesCount
      };
    }));
    res.json(results);
  } catch (err) {
    console.error('getApartments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getApartment = async (req, res) => {
  try {
  const apartment = await Apartment.findById(req.params.id).populate('buildingRef');
    if (!apartment) return res.status(404).json({ message: "Not found" });
    const residents = await Resident.find({ apartment: apartment._id }).select('fullName phone email');
    const openTicketsCount = await Ticket.countDocuments({ apartment: apartment._id, status: { $in: ['open', 'in_progress'] } });
    const unpaidInvoicesCount = await Invoice.countDocuments({ apartment: apartment._id, status: { $in: ['unpaid', 'overdue'] } });
  const building = apartment.buildingRef || (apartment.building ? { name: apartment.building } : null);
  res.json({ ...apartment.toObject(), building, residents, openTicketsCount, unpaidInvoicesCount });
  } catch (err) {
    console.error('getApartment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateApartment = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.floor !== undefined && payload.floor !== null && payload.floor !== '') {
      const n = Number(payload.floor);
      if (!Number.isFinite(n)) return res.status(400).json({ message: 'Invalid floor value' });
      payload.floor = n;
    }
    if (payload.area !== undefined && payload.area !== null && payload.area !== '') {
      const n2 = Number(payload.area);
      if (!Number.isFinite(n2)) return res.status(400).json({ message: 'Invalid area value' });
      payload.area = n2;
    }

    const apartment = await Apartment.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    res.json(apartment);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message, errors: err.errors });
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate key', detail: err.keyValue });
    console.error('updateApartment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteApartment = async (req, res) => {
  try {
    await Apartment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error('deleteApartment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
