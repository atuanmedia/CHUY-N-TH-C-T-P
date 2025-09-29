const Resident = require("../models/Resident");
const Apartment = require("../models/Apartment");

// ➕ Tạo cư dân
exports.createResident = async (req, res) => {
  try {
    const payload = { ...req.body };

    // normalize empty value
    if (!payload.apartment || payload.apartment === "") {
      payload.apartment = null;
    }

    // kiểm tra apartment có tồn tại không
    if (payload.apartment) {
      const apt = await Apartment.findById(payload.apartment);
      if (!apt) return res.status(400).json({ message: "Apartment not found" });
    }

    const resident = new Resident(payload);
    await resident.save();

    // mark apartment occupied nếu gán
    if (resident.apartment) {
      await Apartment.findByIdAndUpdate(resident.apartment, { status: "occupied" });
    }

    res.status(201).json(await resident.populate({
      path: "apartment",
      select: "code floor status building",
      populate: {
        path: "buildingRef",
        select: "name"
      }
    }));
  } catch (err) {
    console.error("createResident error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 Lấy tất cả cư dân
exports.getResidents = async (req, res) => {
  try {
    const residents = await Resident.find().populate({
      path: "apartment",
      select: "code floor status building",
      populate: {
        path: "buildingRef",
        select: "name"
      }
    });
    res.json(residents);
  } catch (err) {
    console.error("getResidents error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📄 Lấy 1 cư dân theo ID
exports.getResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id).populate({
      path: "apartment",
      select: "code floor status building",
      populate: {
        path: "buildingRef",
        select: "name"
      }
    });
    if (!resident) return res.status(404).json({ message: "Resident not found" });
    res.json(resident);
  } catch (err) {
    console.error("getResident error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Cập nhật cư dân
exports.updateResident = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (!payload.apartment || payload.apartment === "") {
      payload.apartment = null;
    }

    if (payload.apartment) {
      const apt = await Apartment.findById(payload.apartment);
      if (!apt) return res.status(400).json({ message: "Apartment not found" });
    }

    const existing = await Resident.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Resident not found" });

    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    ).populate({
      path: "apartment",
      select: "code floor status building",
      populate: {
        path: "buildingRef",
        select: "name"
      }
    });

    // xử lý thay đổi apartment
    const oldApt = existing.apartment ? String(existing.apartment) : null;
    const newApt = resident.apartment ? String(resident.apartment._id) : null;

    if (oldApt && oldApt !== newApt) {
      await Apartment.findByIdAndUpdate(oldApt, { status: "vacant" });
    }
    if (newApt && oldApt !== newApt) {
      await Apartment.findByIdAndUpdate(newApt, { status: "occupied" });
    }

    res.json(resident);
  } catch (err) {
    console.error("updateResident error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Xoá cư dân
exports.deleteResident = async (req, res) => {
  try {
    const existing = await Resident.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Resident not found" });

    await Resident.findByIdAndDelete(req.params.id);

    if (existing.apartment) {
      await Apartment.findByIdAndUpdate(existing.apartment, { status: "vacant" });
    }

    res.json({ message: "Resident deleted" });
  } catch (err) {
    console.error("deleteResident error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
